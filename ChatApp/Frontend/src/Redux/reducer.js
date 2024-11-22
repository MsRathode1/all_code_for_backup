import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import userReducer from './Slices/UserSlice';
import currentStateReducer from './Slices/CurrentState';
import notificationsReducer from "./Slices/NotificationSlice"

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  user: userReducer,
  currentState: currentStateReducer,
  notifications: notificationsReducer,
});

export default persistReducer(persistConfig, rootReducer);