import React, { useState, useEffect, useRef } from 'react';
import type { Message } from './types';
import { Sender } from './types';
import ChatWindow from './components/ChatWindow';
import ChatControls from './components/ChatControls';
import { ThemeIcon } from './components/icons';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [loadingAI, setLoadingAI] = useState<Sender.Deepseek | Sender.ChatGPT | Sender.Gemini | null>(null);
  const [waitingFor, setWaitingFor] = useState<Sender.Deepseek | Sender.ChatGPT | Sender.Gemini | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lastClipboardTextRef = useRef<string>('');
  const [theme, setTheme] = useState<'xubuntu' | 'windows'>(() => {
    const savedTheme = localStorage.getItem('chat-theme');
    return (savedTheme === 'xubuntu' || savedTheme === 'windows') ? savedTheme : 'xubuntu';
  });

  useEffect(() => {
    const now = Date.now();
    setMessages([
      {
        id: now,
        text: 'Hello its Mohit here',
        sender: Sender.User,
      },
      {
        id: now + 1,
        text: 'Hello its deepseek here',
        sender: Sender.Deepseek,
      },
      {
        id: now + 2,
        text: 'Hello its chatgpt here',
        sender: Sender.ChatGPT,
      },
      {
        id: now + 3,
        text: 'Hello its Gemini here',
        sender: Sender.Gemini,
      },
    ]);
  }, []);

  useEffect(() => {
    localStorage.setItem('chat-theme', theme);
    const root = document.documentElement;
    if (theme === 'windows') {
      root.classList.add('theme-windows');
    } else {
      root.classList.remove('theme-windows');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'xubuntu' ? 'windows' : 'xubuntu');
  };

  const addMessage = (text: string, sender: Sender) => {
    if (!text.trim()) return;
    const newMessage: Message = {
      id: Date.now() + Math.random(), // Add randomness to avoid key collision
      text,
      sender,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSendMessage = () => {
    addMessage(userInput, Sender.User);
    setUserInput('');
  };

  const getSenderName = (sender: Sender): string => {
    switch (sender) {
      case Sender.User: return 'Mohit';
      case Sender.Deepseek: return 'Deepseek';
      case Sender.ChatGPT: return 'ChatGPT';
      case Sender.Gemini: return 'Gemini';
      case Sender.System: return 'System';
      default: return '';
    }
  };
  
  // Effect to poll clipboard when waiting for a response
  useEffect(() => {
    if (!waitingFor) {
      return; // Not waiting, do nothing.
    }

    const checkClipboard = async () => {
      if (!document.hasFocus()) {
        return; // Don't check if page is not active
      }

      try {
        const clipboardText = await navigator.clipboard.readText();

        if (clipboardText && clipboardText !== lastClipboardTextRef.current) {
          lastClipboardTextRef.current = clipboardText;

          const trimmedClipboard = clipboardText.trim();
          const senderName = getSenderName(waitingFor);
          const prefixRegex = new RegExp(`^${senderName}:\\s*`, 'i');

          if (prefixRegex.test(trimmedClipboard)) {
            const clipboardContent = trimmedClipboard.replace(prefixRegex, '').trim();
            if (clipboardContent) {
              addMessage(clipboardContent, waitingFor);
              setWaitingFor(null); // Success! Stop waiting.
            }
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'NotAllowedError') {
          // This is a common, expected error when the doc isn't focused or permissions are denied.
          // We can just ignore it and the interval will try again later.
          return;
        }
        console.error('Clipboard read failed:', err);
        setError('Automatic paste failed. Please check clipboard permissions.');
        setWaitingFor(null); // Stop polling on unexpected errors.
      }
    };

    const intervalId = setInterval(checkClipboard, 500); // Check every 500ms

    return () => {
      clearInterval(intervalId);
    };
  }, [waitingFor]);


  const handleCopyContext = async (aiSender: Sender.Deepseek | Sender.ChatGPT | Sender.Gemini) => {
    if (waitingFor) {
      addMessage(`Action changed. Waiting for ${getSenderName(waitingFor)} cancelled.`, Sender.System);
    }
    setLoadingAI(aiSender);
    setError(null);
    setWaitingFor(null); // Reset waiting state initially
    await new Promise(resolve => setTimeout(resolve, 50)); // Ensure UI updates

    try {
      const senderName = getSenderName(aiSender);
      const lastAiMessageIndex = messages.map(m => m.sender).lastIndexOf(aiSender);
      const messagesSinceLastAiTurn = messages.slice(lastAiMessageIndex + 1);
      const messagesToCopy = messagesSinceLastAiTurn.filter(m => m.sender !== aiSender && m.sender !== Sender.System);

      if (messagesToCopy.length > 0) {
        const conversationHistory = messagesToCopy
          .map(m => `${getSenderName(m.sender)}: ${m.text}`)
          .join(' ; ');
        
        const contentForClipboard = `[ Conversation till ${senderName}'s last message : ${conversationHistory} ]`;

        await navigator.clipboard.writeText(contentForClipboard);
        
        lastClipboardTextRef.current = contentForClipboard;
        setWaitingFor(aiSender);
        addMessage(`Context for ${senderName} copied. Waiting for you to copy the response... it will be pasted automatically.`, Sender.System);
      } else {
        addMessage(`No new context to copy for ${senderName}. You can start a new query.`, Sender.System);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.name === 'NotAllowedError' ? 'Clipboard permission denied.' : 'Failed to copy to clipboard.');
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoadingAI(null);
    }
  };
  
  const handleCancelWaiting = () => {
    if (waitingFor) {
      addMessage(`Cancelled waiting for paste from ${getSenderName(waitingFor)}.`, Sender.System);
      setWaitingFor(null);
    }
  };
  
  useEffect(() => {
    if (error) {
        const timer = setTimeout(() => setError(null), 6000);
        return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="flex flex-col h-screen bg-chat-bg font-sans text-text-primary">
      <header className="bg-header-bg text-text-primary p-4 shadow-lg flex justify-between items-center relative">
        <div className="w-10 h-8"></div> {/* Spacer for left side to balance the button */}
        <h1 className="text-2xl font-bold text-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">AI Group Chat</h1>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-border-theme transition-colors"
          title={theme === 'xubuntu' ? "Switch to Windows compatible" : "Switch to Xubuntu+KDE compatible"}
          aria-label={theme === 'xubuntu' ? "Switch to Windows compatible theme" : "Switch to Xubuntu+KDE compatible theme"}
        >
          <ThemeIcon theme={theme} />
        </button>
      </header>
      
      <ChatWindow messages={messages} />
      
      {error && (
        <div className="px-6 pb-2">
            <div className="bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-md text-center">
                {error}
            </div>
        </div>
      )}

      <ChatControls
        userInput={userInput}
        setUserInput={setUserInput}
        onSendMessage={handleSendMessage}
        onCopyContext={handleCopyContext}
        onCancelWaiting={handleCancelWaiting}
        loadingAI={loadingAI}
        waitingFor={waitingFor}
      />
    </div>
  );
};

export default App;