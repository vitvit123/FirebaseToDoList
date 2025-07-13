import { useEffect, useState, useRef, FormEvent } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  DocumentData,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

// ✅ Type for a Todo item
interface Todo {
  id: string;
  todo: string;
  isCompleted: boolean;
  createdAt?: any;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState<string>('');
  const [warning, setWarning] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const q = query(collection(db, 'todos'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const todosData: Todo[] = [];
        querySnapshot.forEach((doc) => {
          todosData.push({ id: doc.id, ...doc.data() } as Todo);
        });
        setTodos(todosData);
      },
      (error) => {
        console.error('Realtime update error:', error);
      }
    );
    return () => unsubscribe();
  }, []);

  const resetWarning = () => {
    if (warning) setWarning('');
  };

  const isDuplicate = (text: string) =>
    todos.some(
      (t) =>
        t.todo.toLowerCase().trim() === text.toLowerCase().trim() &&
        t.id !== editingId
    );

  const handleAddOrEdit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    resetWarning();

    if (!trimmedInput) {
      setWarning('Todo cannot be empty');
      return;
    }
    if (isDuplicate(trimmedInput)) {
      setWarning('Duplicate todo not allowed');
      return;
    }

    try {
      if (editingId) {
        const docRef = doc(db, 'todos', editingId);
        await updateDoc(docRef, {
          todo: trimmedInput,
          isCompleted:
            todos.find((t) => t.id === editingId)?.isCompleted || false,
          createdAt: serverTimestamp(),
        });
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'todos'), {
          todo: trimmedInput,
          isCompleted: false,
          createdAt: serverTimestamp(),
        });
      }
      setInput('');
    } catch (error) {
      console.error('Error saving todo:', error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'todos', id));
      if (editingId === id) {
        setEditingId(null);
        setInput('');
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setInput(todo.todo);
    inputRef.current?.focus();
    resetWarning();
  };

  const toggleComplete = async (todo: Todo) => {
    try {
      await updateDoc(doc(db, 'todos', todo.id), {
        todo: todo.todo,
        isCompleted: !todo.isCompleted,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error toggling complete:', error);
    }
  };

  const filteredTodos = input.trim() === ''
    ? todos
    : todos.filter((todo) =>
        todo.todo.toLowerCase().includes(input.toLowerCase().trim())
      );

  return (
    <div className="container">
      <h2 className="title">My Todo List</h2>

      <form onSubmit={handleAddOrEdit} className="form">
        <input
          type="text"
          placeholder={editingId ? 'Edit your todo and hit Enter' : 'Add new todo'}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            resetWarning();
          }}
          ref={inputRef}
          className="input"
          autoComplete="off"
        />
        <button type="submit" className="add-btn">
          {editingId ? 'Save' : 'Add'}
        </button>
      </form>

      {warning && <p className="warning">{warning}</p>}

      {filteredTodos.length === 0 ? (
        <p className="no-result">No result. Create a new one instead!</p>
      ) : (
        <ul className="todo-list">
          {filteredTodos.map((todo) => (
            <li key={todo.id} className="todo-item">
              <span
                className={`todo-text ${todo.isCompleted ? 'completed' : ''}`}
              >
                {todo.todo}
              </span>

              <div className="todo-actions">
                <button
                  type="button"
                  onClick={() => toggleComplete(todo)}
                  title={todo.isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
                  className="action-btn complete-btn"
                >
                  {todo.isCompleted ? 'Undo' : 'Done'}
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(todo)}
                  className="action-btn edit-btn"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteTodo(todo.id)}
                  className="action-btn remove-btn"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <style jsx>{`
        .container {
          max-width: 480px;
          margin: 24px auto;
          padding: 0 16px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          color: #222;
        }
        .title {
          text-align: center;
          margin-bottom: 20px;
          font-weight: 700;
          font-size: 1.8rem;
          color: #333;
        }
        .form {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }
        .input {
          flex-grow: 1;
          padding: 10px 14px;
          font-size: 1rem;
          border: 1.8px solid #ccc;
          border-radius: 4px;
          outline-offset: 2px;
          transition: border-color 0.2s ease-in-out;
        }
        .input:focus {
          border-color: #0070f3;
          box-shadow: 0 0 5px rgba(0, 112, 243, 0.5);
        }
        .add-btn {
          padding: 10px 16px;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          background-color: #0070f3;
          color: white;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s ease-in-out;
        }
        .add-btn:hover {
          background-color: #005bb5;
        }
        .warning {
          color: #d93025;
          font-weight: 600;
          margin-bottom: 12px;
          user-select: none;
        }
        .no-result {
          text-align: center;
          color: #666;
          font-style: italic;
          margin-top: 20px;
          user-select: none;
        }
        .todo-list {
          list-style: none;
          padding-left: 0;
          margin: 0;
        }
        .todo-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          margin-bottom: 8px;
          border-radius: 6px;
          background-color: #f9f9f9;
          transition: background-color 0.2s ease;
          box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
        }
        .todo-item:hover {
          background-color: #e0f0ff;
        }
        .todo-text {
          flex-grow: 1;
          font-size: 1rem;
          user-select: text;
        }
        .todo-text.completed {
          text-decoration: line-through;
          color: #999;
          user-select: none;
        }
        .todo-actions {
          display: flex;
          gap: 8px;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .todo-item:hover .todo-actions {
          opacity: 1;
        }
        .action-btn {
          border: none;
          background: none;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
          padding: 6px 8px;
          border-radius: 4px;
          transition: background-color 0.15s ease;
          user-select: none;
        }
        .action-btn:hover {
          background-color: #dbefff;
        }
        .complete-btn {
          color: #0070f3;
        }
        .edit-btn {
          color: #f0a500;
        }
        .remove-btn {
          color: #d93025;
        }
      `}</style>
    </div>
  );
}

