import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {MessageTypes} from '../../types/index';

interface MessagesState {
  messages: MessageTypes[];
}

const initialState: MessagesState = {
  messages: [],
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<MessageTypes[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<MessageTypes>) => {
      state.messages.push(action.payload);
    },
  },
});

export const { setMessages, addMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
