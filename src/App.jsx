import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addTodo,
  deleteTodo,
  toggleComplete,
  updateTodo,
  undoDelete,
} from "./slices/todoSlice";
import { v4 as uuid } from "uuid";

import { useRef } from "react";

import { FaEdit } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "./context/themeContext";

export default function App() {
  const [inputText, setInputText] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const dispatch = useDispatch();

  const undoToastRef = useRef(null);

  const { todos } = useSelector((state) => state.todos);

  const onAddClick = () => {
    if (inputText.trim() === "") {
      return;
    }
    !isUpdate
      ? dispatch(
          addTodo({
            todo: inputText,
            id: uuid(),
            complete: false,
          })
        )
      : dispatch(updateTodo({ todos: inputText, id: updateId }));
    setInputText("");
    toast.success(
      !isUpdate ? "Task added successfully!" : "Task updated successfully!"
    );
    setIsUpdate(false);
    setUpdateId(null);
  };

  const onDeleteTodo = (id) => {
    dispatch(deleteTodo(id));

    if (undoToastRef.current) {
      toast.dismiss(undoToastRef.current);
    }

    const toastId = toast.error(
      (t) => (
        <span className=" flex items-center gap-4">
          Task Deleted Successfully
          <button
            className=" bg-green-500 p-2 rounded-md"
            onClick={() => {
              dispatch(undoDelete());
              toast.dismiss(t.id);
              toast.success("Undo successfull!");
              undoToastRef.current = null;
            }}
          >
            Undo
          </button>
        </span>
      ),
      {
        duration: 4000,
      }
    );
    undoToastRef.current = toastId;
  };

  const onUpdateTodo = (todo) => {
    setIsUpdate(true);
    setUpdateId(todo.id);
    setInputText(todo.todo);
  };

  const onToggleComplete = (value, todoId) => {
    console.log(value, todoId);
    dispatch(toggleComplete({ id: todoId, complete: value }));
  };

  const { theme, toggleTheme } = useTheme();
  return (
    <div className=" flex flex-col   items-center  bg-slate-100 dark:bg-slate-900  w-screen h-screen">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: theme === "dark" ? "#1f2937" : "#f9fafb", // Tailwind's gray-800 / gray-100
            color: theme === "dark" ? "#f9fafb" : "#111827", // gray-100 / gray-900
            borderRadius: "0.5rem",
          },
        }}
      />
      <div className=" flex justify-between items-center w-full px-20">
        <h1 className=" text-purple-950 dark:text-purple-300 mt-4 text-3xl font-bold p-2">
          Next Do
        </h1>
        <div className="relative">
          <button
            onClick={toggleTheme}
            className="w-14 h-8 flex items-center px-1 rounded-full transition-all duration-300 ease-in-out
               bg-gray-300 dark:bg-gray-700 shadow-inner"
          >
            <div
              className={`w-6 h-6 flex items-center justify-center rounded-full shadow-md transform transition-transform duration-300 ease-in-out
        ${
          theme === "dark"
            ? "translate-x-6 bg-yellow-200"
            : "translate-x-0 bg-gray-100"
        }`}
            >
              {theme === "dark" ? (
                <FiSun
                  size={16}
                  className="text-pink-600 transition-opacity duration-300"
                />
              ) : (
                <FiMoon
                  size={16}
                  className="text-purple-900 transition-opacity duration-300"
                />
              )}
            </div>
          </button>
        </div>
      </div>
      <div className="mt-12 flex justify-between gap-10 duration-700 ease-in-out transition-all">
        <input
          onChange={(e) => setInputText(e.target.value)}
          value={inputText}
          placeholder="Enter a task..."
          className="p-2 bg-transparent border-b-2  outline-none border-pink-500 dark:border-pink-300 text-gray-800 dark:text-white"
        />
        <button
          className={`${
            isUpdate
              ? "bg-green-500 hover:bg-green-600 dark:bg-green-400 dark:hover:bg-green-600"
              : "bg-pink-600 hover:bg-pink-700 dark:bg-pink-500 dark:hover:bg-pink-600"
          }  text-white  shadow-md py-1 px-5 rounded-md  ${
            inputText.trim() === "" ? "cursor-not-allowed" : " cursor-pointer"
          }`}
          onClick={onAddClick}
        >
          {isUpdate ? "Update" : "Add"}
        </button>
      </div>
      <div className=" mt-12 lg:w-1/3 w-11/12 ">
        {todos?.length > 0 &&
          todos.map((todo) => (
            <div
              key={todo.id}
              className="bg-yellow-50  dark:bg-zinc-800 px-5 py-3 my-4 rounded-md shadow-md  flex justify-between items-center"
            >
              <div className=" flex items-center gap-3 ">
                <input
                  type="checkbox"
                  checked={todo.complete}
                  onChange={(e) => onToggleComplete(e.target.checked, todo.id)}
                  className="  w-4 h-4 rounded accent-pink-600 dark:accent-pink-400 hover:scale-105  transition duration-200"
                />
                <span
                  className={`${
                    todo.complete ? "line-through" : ""
                  }  text-rose-900 dark:text-gray-100 text-lg`}
                >
                  {" "}
                  {todo.todo}
                </span>
              </div>

              <div className=" flex items-center gap-10">
                <button
                  className={`${
                    isUpdate ? "cursor-not-allowed" : "cursor-pointer"
                  } text-blue-600 dark:text-blue-300 `}
                  onClick={() => onUpdateTodo(todo)}
                >
                  <FaEdit size={20} />
                </button>
                <button
                  className=" text-red-600 dark:text-red-500"
                  onClick={() => onDeleteTodo(todo.id)}
                >
                  <FaTrash size={20} />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
