import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chat:"",
  selectedChat:"" 
};

const currentStateSlice = createSlice({
  name: 'currentState',
  initialState,
  reducers: {
    setChatState: (state, action) => {
      state.chat = action.payload;
    },
    setUpdateChatState: (state, action) => {
      state.chat = [action.payload,...state.chat];
    },
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
  },
});

export const { setChatState,setSelectedChat,setUpdateChatState } = currentStateSlice.actions;
export default currentStateSlice.reducer;
