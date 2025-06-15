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
  lastDeleted: null,
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
      const index = state.todos.findIndex((todo) => todo.id === action.payload);
      const deleted = state.todos[index];
      if (deleted) {
        state.lastDeleted = { todo: deleted, index };
        state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      }
    },
    undoDelete: (state) => {
      if (state.lastDeleted) {
        const { todo, index } = state.lastDeleted;
        state.todos.splice(index, 0, todo);
        state.lastDeleted = null;
      }
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

export const { addTodo, deleteTodo, updateTodo, toggleComplete, undoDelete } =
  todoSlice.actions;
export default todoSlice.reducer;
