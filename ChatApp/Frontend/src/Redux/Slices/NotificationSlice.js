import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: []
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {

    addNotification: (state, action) => {
      function makeArrayUnique(arr) {
        const uniqueMap = new Map();
        arr.forEach(obj => {
          uniqueMap.set(obj._id, obj);
        });
        return Array.from(uniqueMap.values());
      }

      state.notifications = [...state.notifications, ...makeArrayUnique(action.payload)]
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(notification => notification.id !== action.payload);
    },
    clearNotification: (state, action) => {
      state.notifications = []
    }
  },
});

export const { addNotification, removeNotification, clearNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
