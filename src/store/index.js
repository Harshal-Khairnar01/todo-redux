import { configureStore } from "@reduxjs/toolkit";

import todoReducer from "../slices/todoSlice";

const saveToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state.todos.todos); // access todos slice
    localStorage.setItem("todos", serializedState);
  } catch (error) {
    console.error("Could not save state", error);
  }
};

export const store = configureStore({
  reducer: {
    todos: todoReducer,
  },
});

store.subscribe(() => {
  saveToLocalStorage(store.getState());
});
