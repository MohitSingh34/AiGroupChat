import React from 'react';
import { SendIcon, ClipboardIcon } from './icons';
import { Sender } from '../types';

interface ChatControlsProps {
  userInput: string;
  setUserInput: (value: string) => void;
  onSendMessage: () => void;
  onCopyContext: (sender: Sender.Deepseek | Sender.ChatGPT | Sender.Gemini) => void;
  onCancelWaiting: () => void;
  loadingAI: Sender.Deepseek | Sender.ChatGPT | Sender.Gemini | null;
  waitingFor: Sender.Deepseek | Sender.ChatGPT | Sender.Gemini | null;
}

const ChatControls: React.FC<ChatControlsProps> = ({
  userInput,
  setUserInput,
  onSendMessage,
  onCopyContext,
  onCancelWaiting,
  loadingAI,
  waitingFor,
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSendMessage();
    }
  };

  const isWaiting = waitingFor !== null;
  const isWaitingForDeepseek = waitingFor === Sender.Deepseek;
  const isWaitingForChatGPT = waitingFor === Sender.ChatGPT;
  const isWaitingForGemini = waitingFor === Sender.Gemini;

  return (
    <div className="bg-chat-bg px-6 pb-6 border-t border-border-theme">
      <div className="flex justify-center items-center gap-4 mb-4">
        {/* Deepseek Button */}
        <button
          onClick={() => onCopyContext(Sender.Deepseek)}
          disabled={loadingAI !== null || (isWaiting && !isWaitingForDeepseek)}
          className={`flex items-center justify-center w-full px-4 py-2 text-white font-semibold rounded-lg shadow-md transition duration-300 disabled:cursor-not-allowed disabled:bg-gray-500
            ${isWaitingForDeepseek 
              ? 'bg-green-600 ring-2 ring-offset-2 ring-offset-chat-bg ring-green-400' 
              : 'bg-green-600 hover:bg-green-700'}
            ${isWaiting && !isWaitingForDeepseek ? 'opacity-50' : ''}
          `}
        >
          {loadingAI === Sender.Deepseek ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : isWaitingForDeepseek ? (
            <>
              <div className="animate-pulse w-5 h-5 mr-2 rounded-full bg-green-300"></div>
              Waiting for Deepseek...
            </>
          ) : (
            <>
              <ClipboardIcon />
              Copy for Deepseek
            </>
          )}
        </button>

        {/* ChatGPT Button */}
        <button
          onClick={() => onCopyContext(Sender.ChatGPT)}
          disabled={loadingAI !== null || (isWaiting && !isWaitingForChatGPT)}
          className={`flex items-center justify-center w-full px-4 py-2 text-white font-semibold rounded-lg shadow-md transition duration-300 disabled:cursor-not-allowed disabled:bg-gray-500
            ${isWaitingForChatGPT 
              ? 'bg-purple-600 ring-2 ring-offset-2 ring-offset-chat-bg ring-purple-400' 
              : 'bg-purple-600 hover:bg-purple-700'}
            ${isWaiting && !isWaitingForChatGPT ? 'opacity-50' : ''}
          `}
        >
          {loadingAI === Sender.ChatGPT ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : isWaitingForChatGPT ? (
            <>
              <div className="animate-pulse w-5 h-5 mr-2 rounded-full bg-purple-300"></div>
              Waiting for ChatGPT...
            </>
          ) : (
            <>
              <ClipboardIcon />
              Copy for ChatGPT
            </>
          )}
        </button>
        
        {/* Gemini Button */}
        <button
          onClick={() => onCopyContext(Sender.Gemini)}
          disabled={loadingAI !== null || (isWaiting && !isWaitingForGemini)}
          className={`flex items-center justify-center w-full px-4 py-2 text-white font-semibold rounded-lg shadow-md transition duration-300 disabled:cursor-not-allowed disabled:bg-gray-500
            ${isWaitingForGemini 
              ? 'bg-indigo-600 ring-2 ring-offset-2 ring-offset-chat-bg ring-indigo-400' 
              : 'bg-indigo-600 hover:bg-indigo-700'}
            ${isWaiting && !isWaitingForGemini ? 'opacity-50' : ''}
          `}
        >
          {loadingAI === Sender.Gemini ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : isWaitingForGemini ? (
            <>
              <div className="animate-pulse w-5 h-5 mr-2 rounded-full bg-indigo-300"></div>
              Waiting for Gemini...
            </>
          ) : (
            <>
              <ClipboardIcon />
              Copy for Gemini
            </>
          )}
        </button>

        {/* Cancel Button */}
        {isWaiting && (
          <button
            onClick={onCancelWaiting}
            disabled={loadingAI !== null}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-300 disabled:bg-gray-500 shrink-0"
          >
            Cancel
          </button>
        )}
      </div>
      <div className="flex items-center bg-input-bg rounded-full p-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="w-full bg-transparent text-text-primary placeholder-text-secondary focus:outline-none px-4"
        />
        <button
          onClick={onSendMessage}
          disabled={!userInput.trim()}
          className="bg-btn-primary text-white p-3 rounded-full hover:bg-btn-hover transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

export default ChatControls;