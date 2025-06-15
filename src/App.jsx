import { useState } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { addTodo, deleteTodo } from "./slices/todoSlice";
import { v4 as uuid } from "uuid";

export default function App() {
  const [inputText, setInputText] = useState("");
  const dispatch = useDispatch();

  const { todos } = useSelector((state) => state.todos);

  const onAddClick = () => {
    dispatch(
      addTodo({
        todo: inputText,
        id: uuid(),
      })
    );
    setInputText("");
  };

  const onDeleteTodo = (id) => {
    dispatch(deleteTodo(id));
  };

  return (
    <div className=" flex flex-col   items-center  bg-slate-200 w-screen h-screen">
      <h1 className=" text-purple-950 mt-4">Todo App</h1>
      <div>
        <input
          onChange={(e) => setInputText(e.target.value)}
          value={inputText}
          placeholder="Enter a todo..."
        />
        <button onClick={onAddClick}>Add</button>
      </div>
      <div>
        {todos?.length > 0 &&
          todos.map((todo) => (
            <div
              key={todo.id}
              className="bg-purple-100 p-2 m-2 rounded-md shadow-md w-80 flex justify-between items-center"
            >
              <span> {todo.todo}</span>
              <button onClick={() => onDeleteTodo(todo.id)}>delete</button>
            </div>
          ))}
      </div>
    </div>
  );
}
