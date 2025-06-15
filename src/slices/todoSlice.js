import { createSlice } from "@reduxjs/toolkit";

const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem("todos");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load from localStorage", error);
    return [];
  }
};

const initialState = {
   todos: loadFromLocalStorage(),
};

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    addTodo: (state, action) => {
      state.todos.push(action.payload);
      //   state.todos = [...state.todos, action.payload];
    },
    deleteTodo: (state, action) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },
    updateTodo: (state, action) => {
      const { id, todos } = action.payload;
      const todoIndex = state.todos.findIndex((todo) => todo.id === id);
      if (todoIndex !== -1) {
        state.todos[todoIndex].todo = todos;
      }
    },
    toggleComplete: (state, action) => {
      const { id, complete } = action.payload;
      const todoIndex = state.todos.findIndex((todo) => todo.id === id);
      if (todoIndex !== -1) {
        state.todos[todoIndex].complete = complete;
      }
    },
  },
});

export const { addTodo, deleteTodo, updateTodo, toggleComplete } =
  todoSlice.actions;
export default todoSlice.reducer;
