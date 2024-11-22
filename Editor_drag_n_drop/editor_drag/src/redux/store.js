import { configureStore, combineReducers } from '@reduxjs/toolkit';
import pagesReducer from './reducers/pagesReducer';
import elementsReducer from './reducers/elementsReducer';
import templatesReducer from './reducers/templatesReducer';

const rootReducer = combineReducers({
  pages: pagesReducer,
  elements: elementsReducer,
  templates: templatesReducer,
});

const store = configureStore(rootReducer);

export default store;
