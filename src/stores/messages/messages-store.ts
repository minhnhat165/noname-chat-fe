import { Message } from '@/types/message';
import { create } from 'zustand';

export interface IMessagesStore {
  messages: Message[] | [];
  setMessages: (messages: Message[] | []) => void;
  addMessage: (message: Message) => void;
  removeMessage: (id: string) => void;
}

export const useMessagesStore = create<IMessagesStore>((set) => ({
  messages: [],
  setMessages: (messages) => {
    return set({ messages: messages });
  },
  addMessage: (message) => {
    return set((state) => ({ messages: [message, ...state.messages] }));
  },
  removeMessage: (id) =>
    set((state) => {
      return { messages: [...state.messages.filter((message: Message) => message._id !== id)] };
    }),
}));
// export const MessagesStore = create<IMessagesStore>((set) => ({
//     data: [],
//     setMessages: (data) => set(data),
//     addMessage: (message) => set((state) => ([message,...state]),
//     removeMessage: (id) => set((state) =>{state.filter((message: Message) => message._id !== id)})
// }));
