# Next Do: What's next? Do it!

A feature-rich todo application built with React and Redux Toolkit, featuring local storage persistence and complete todo management capabilities.

## Features

- Create, read, update, and delete todos (CRUD operations)
- Mark todos as complete/incomplete
- Persistent storage using localStorage
- Redux state management with Redux Toolkit
- Unique IDs for each todo item

## Technical Architecture

### State Management

The application uses Redux Toolkit for state management with the following structure:

```
src/
├── store/
│   └── index.js         # Redux store configuration
├── slices/
│   └── todoSlice.js     # Todo state management
└── main.jsx            # Application entry point
```

### Core Components

#### Store Configuration (store/index.js)

- Configures Redux store
- Implements localStorage persistence
- Sets up store subscribers

```javascript
const store = configureStore({
  reducer: {
    todos: todoReducer,
  },
});
```

#### Todo Slice (slices/todoSlice.js)

Manages todo state with the following actions:

- `addTodo`: Creates new todos
- `deleteTodo`: Removes todos
- `updateTodo`: Modifies existing todos
- `toggleComplete`: Toggles todo completion status

### State Structure

```javascript
{
  todos: {
    todos: [
      {
        id: string,
        todo: string,
        complete: boolean
      }
    ]
  }
}
```

## Key Features Implementation

### 1. Local Storage Persistence

```javascript
// Loading todos
const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem("todos");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
};

// Saving todos
const saveToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state.todos.todos);
    localStorage.setItem("todos", serializedState);
  } catch (error) {
    console.error("Could not save state", error);
  }
};
```

### 2. Todo Management Actions

```javascript
// Add Todo
dispatch(
  addTodo({
    id: uniqueId,
    todo: "New Todo",
    complete: false,
  })
);

// Update Todo
dispatch(
  updateTodo({
    id: existingId,
    todos: "Updated Todo",
  })
);

// Toggle Complete
dispatch(
  toggleComplete({
    id: todoId,
    complete: true,
  })
);

// Delete Todo with Undo Support
dispatch(deleteTodo(todoId));

// Undo Delete
dispatch(undoDelete());
```

### 3. Undo Feature Implementation

The application includes an undo feature for deleted todos. When a todo is deleted, users have a brief window to undo the deletion.

#### How it works:

1. **State Structure**: The Redux store maintains a `lastDeleted` state that stores:

   ```javascript
   lastDeleted: {
     todo: {/* deleted todo object */},
     index: number // original position
   }
   ```

2. **Delete Operation**:

   - When a todo is deleted, it's stored in `lastDeleted` before removal
   - A toast notification appears with an "Undo" button
   - The user has 4 seconds to undo the deletion

3. **Undo Operation**:
   - Clicking "Undo" restores the todo to its original position
   - The `lastDeleted` state is cleared after restoration
   - A success message confirms the undo action

#### Code Example:

```javascript
// Delete with undo support
const onDeleteTodo = (id) => {
  dispatch(deleteTodo(id));
  toast((t) => (
    <span>
      Task Deleted Successfully
      <button onClick={() => dispatch(undoDelete())}>Undo</button>
    </span>
  ));
};
```

## Getting Started

1. Clone the repository

```bash
git clone [repository-url]
```

2. Install dependencies

```bash
cd todo-app-redux
npm install
```

3. Start the development server

```bash
npm run dev
```

## Dependencies

- React
- Redux Toolkit (`@reduxjs/toolkit`)
- React Redux (`react-redux`)
- Vite (Development server and build tool)

## Best Practices

- Uses Redux Toolkit for simplified Redux logic
- Implements persistent storage for data retention
- Follows immutable state patterns
- Includes error handling for storage operations
- Maintains separation of concerns between state and UI

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
