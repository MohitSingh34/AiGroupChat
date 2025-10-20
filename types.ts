
export enum Sender {
  User = 'user',
  Deepseek = 'deepseek',
  ChatGPT = 'chatgpt',
  Gemini = 'gemini',
  System = 'system',
}

export interface Message {
  id: number;
  text: string;
  sender: Sender;
}
