import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addTodo,
  deleteTodo,
  toggleComplete,
  updateTodo,
} from "./slices/todoSlice";
import { v4 as uuid } from "uuid";

import { FaEdit } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export default function App() {
  const [inputText, setInputText] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const dispatch = useDispatch();

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
    toast.error("Task deleted successfully!");
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

  return (
    <div className=" flex flex-col   items-center  bg-slate-200 w-screen h-screen">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
      <h1 className=" text-purple-950 mt-4 text-3xl font-bold p-2">Next Do</h1>
      <div className="mt-12 flex justify-between gap-10">
        <input
          onChange={(e) => setInputText(e.target.value)}
          value={inputText}
          placeholder="Enter a task..."
          className="p-2 bg-transparent border-b-2 outline-none border-pink-500 text-purple-900"
        />
        <button
          className={`${ isUpdate?"bg-green-500":"bg-pink-600"}  text-white  shadow-md py-1 px-5 rounded-md  ${
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
              className="bg-yellow-50 px-5 py-3 my-4 rounded-md shadow-md  flex justify-between items-center"
            >
              <div className=" flex items-center gap-3 ">
                <input
                  type="checkbox"
                  checked={todo.complete}
                  onChange={(e) => onToggleComplete(e.target.checked, todo.id)}
                  className=" translate-y-0.5"
                />
                <span className={`${todo.complete ? "line-through" : ""}  text-rose-900 text-lg`}>
                  {" "}
                  {todo.todo}
                </span>
              </div>

              <div className=" flex items-center gap-10">
                <button
                  className={`${
                    isUpdate ? "cursor-not-allowed" : "cursor-pointer"
                  } `}
                  onClick={() => onUpdateTodo(todo)}
                >
                  <FaEdit size={20} color="blue" />
                </button>
                <button onClick={() => onDeleteTodo(todo.id)}>
                  <FaTrash size={20} color="red" />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
