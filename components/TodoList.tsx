"use client";

import {
  FaCheck,
  FaEdit,
  FaPlus,
  FaSave,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import { useEffect, useState } from "react";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  priority: "low" | "medium" | "high";
}

// Storage keys for todo preferences
const TODO_STORAGE_KEYS = {
  TODOS: "mycafevibes_todos",
  SAVE_PREFERENCES: "mycafevibes_todo_save_preferences",
};

export default function TodoList({ onClose }: { onClose: () => void }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState("");
  const [newTodoPriority, setNewTodoPriority] =
    useState<Todo["priority"]>("medium");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editPriority, setEditPriority] = useState<Todo["priority"]>("medium");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [sortBy, setSortBy] = useState<"created" | "priority" | "alphabetical">(
    "created"
  );
  const [savePreferences, setSavePreferences] = useState(false);
  const [showCompleted, setShowCompleted] = useState(true);

  // Load todos on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Load save preferences setting first
        const savedSavePrefs = localStorage.getItem(
          TODO_STORAGE_KEYS.SAVE_PREFERENCES
        );
        const shouldSave = savedSavePrefs ? JSON.parse(savedSavePrefs) : false;
        setSavePreferences(shouldSave);

        if (shouldSave) {
          // Load todos
          const savedTodos = localStorage.getItem(TODO_STORAGE_KEYS.TODOS);
          if (savedTodos) {
            const parsedTodos = JSON.parse(savedTodos).map(
              (todo: {
                id: string;
                text: string;
                completed: boolean;
                createdAt: string;
                priority: Todo["priority"];
              }) => ({
                ...todo,
                createdAt: new Date(todo.createdAt),
              })
            );
            setTodos(parsedTodos);
          }
        }
      } catch (error) {
        console.error("Error loading todos:", error);
      }
    }
  }, []);

  // Save todos whenever they change
  const saveTodos = (newTodos: Todo[]) => {
    if (typeof window !== "undefined" && savePreferences) {
      try {
        localStorage.setItem(TODO_STORAGE_KEYS.TODOS, JSON.stringify(newTodos));
      } catch (error) {
        console.error("Error saving todos:", error);
      }
    }
  };

  const addTodo = () => {
    if (newTodoText.trim()) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: newTodoText.trim(),
        completed: false,
        createdAt: new Date(),
        priority: newTodoPriority,
      };
      const updatedTodos = [...todos, newTodo];
      setTodos(updatedTodos);
      saveTodos(updatedTodos);
      setNewTodoText("");
      setNewTodoPriority("medium"); // Reset to default
    }
  };

  const toggleTodo = (id: string) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  const deleteTodo = (id: string) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
    setEditPriority(todo.priority);
  };

  const saveEdit = () => {
    if (editText.trim() && editingId) {
      const updatedTodos = todos.map((todo) =>
        todo.id === editingId
          ? { ...todo, text: editText.trim(), priority: editPriority }
          : todo
      );
      setTodos(updatedTodos);
      saveTodos(updatedTodos);
      setEditingId(null);
      setEditText("");
      setEditPriority("medium");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
    setEditPriority("medium");
  };

  const updatePriority = (id: string, priority: Todo["priority"]) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, priority } : todo
    );
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  const handleSavePreferencesChange = (checked: boolean) => {
    setSavePreferences(checked);
    localStorage.setItem(
      TODO_STORAGE_KEYS.SAVE_PREFERENCES,
      JSON.stringify(checked)
    );

    // If turning off save preferences, clear all saved todo data
    if (!checked) {
      localStorage.removeItem(TODO_STORAGE_KEYS.TODOS);
    }
  };

  const clearCompleted = () => {
    const updatedTodos = todos.filter((todo) => !todo.completed);
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  const toggleAll = () => {
    const allCompleted = todos.every((todo) => todo.completed);
    const updatedTodos = todos.map((todo) => ({
      ...todo,
      completed: !allCompleted,
    }));
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  // Filter and sort todos
  const filteredTodos = todos
    .filter((todo) => {
      if (filter === "active") return !todo.completed;
      if (filter === "completed") return todo.completed;
      return true;
    })
    .filter((todo) => showCompleted || !todo.completed)
    .sort((a, b) => {
      switch (sortBy) {
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "alphabetical":
          return a.text.localeCompare(b.text);
        case "created":
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

  const completedCount = todos.filter((todo) => todo.completed).length;
  const activeCount = todos.length - completedCount;

  const getPriorityColor = (priority: Todo["priority"]) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
    }
  };

  const getPriorityBg = (priority: Todo["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 border-red-500/30";
      case "medium":
        return "bg-yellow-500/20 border-yellow-500/30";
      case "low":
        return "bg-green-500/20 border-green-500/30";
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[var(--modal-bg)] backdrop-blur-md rounded-2xl p-6 border border-[var(--modal-border)] max-w-2xl w-full shadow-xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <h3 className="text-2xl font-semibold text-[var(--text-primary)]">
            Todo List
          </h3>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer p-2 rounded-lg hover:bg-[var(--button-bg)]"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Add Todo Form */}
        <div className="flex flex-col sm:flex-row gap-2 mb-6 flex-shrink-0">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTodo()}
            placeholder="Add a new todo..."
            className="flex-1 px-4 py-2 bg-[var(--button-bg)] border border-[var(--card-border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
          <div className="flex gap-2 w-full">
            <select
              value={newTodoPriority}
              onChange={(e) =>
                setNewTodoPriority(e.target.value as Todo["priority"])
              }
              className="w-[48%] px-3 py-2 bg-[var(--button-bg)] border border-[var(--card-border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] cursor-pointer"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button
              onClick={addTodo}
              className="w-[48%] px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <FaPlus size={14} />
              Add
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6 flex-shrink-0">
          {/* Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--text-secondary)]">
              Filter:
            </span>
            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value as "all" | "active" | "completed")
              }
              className="px-3 py-1 bg-[var(--button-bg)] border border-[var(--card-border)] rounded text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] cursor-pointer"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--text-secondary)]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as "created" | "priority" | "alphabetical"
                )
              }
              className="px-3 py-1 bg-[var(--button-bg)] border border-[var(--card-border)] rounded text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] cursor-pointer"
            >
              <option value="created">Created</option>
              <option value="priority">Priority</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>

          {/* Show Completed Toggle */}
          <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer">
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
              className="w-4 h-4 text-[var(--accent)] bg-[var(--button-bg)] border-[var(--card-border)] rounded focus:ring-[var(--accent)] focus:ring-2 cursor-pointer"
            />
            <span>Show completed</span>
          </label>

          {/* Save Preferences */}
          <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer">
            <input
              type="checkbox"
              checked={savePreferences}
              onChange={(e) => handleSavePreferencesChange(e.target.checked)}
              className="w-4 h-4 text-[var(--accent)] bg-[var(--button-bg)] border-[var(--card-border)] rounded focus:ring-[var(--accent)] focus:ring-2 cursor-pointer"
            />
            <span>Save todos</span>
          </label>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4 text-sm text-[var(--text-muted)] flex-shrink-0">
          <span>
            {activeCount} active, {completedCount} completed
          </span>
          <div className="flex gap-2">
            <button
              onClick={toggleAll}
              className="text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors cursor-pointer"
            >
              {todos.length > 0 && todos.every((todo) => todo.completed)
                ? "Uncheck all"
                : "Check all"}
            </button>
            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                className="text-red-500 hover:text-red-600 transition-colors cursor-pointer"
              >
                Clear completed
              </button>
            )}
          </div>
        </div>

        {/* Todo List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-8 text-[var(--text-muted)]">
              {todos.length === 0
                ? "No todos yet. Add one above!"
                : "No todos match your filter."}
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  todo.completed
                    ? "bg-[var(--card-bg)]/50 border-[var(--card-border)]/50"
                    : "bg-[var(--card-bg)] border-[var(--card-border)]"
                }`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`p-1 rounded transition-colors cursor-pointer ${
                    todo.completed
                      ? "bg-[var(--accent)] text-white"
                      : "bg-[var(--button-bg)] text-[var(--text-muted)] hover:bg-[var(--button-hover)]"
                  }`}
                >
                  <FaCheck size={12} />
                </button>

                {/* Priority Badge - Clickable to change priority */}
                <button
                  onClick={() => {
                    const priorities: Todo["priority"][] = [
                      "low",
                      "medium",
                      "high",
                    ];
                    const currentIndex = priorities.indexOf(todo.priority);
                    const nextPriority =
                      priorities[(currentIndex + 1) % priorities.length];
                    updatePriority(todo.id, nextPriority);
                  }}
                  className={`px-2 py-1 rounded text-xs font-medium border transition-all hover:scale-105 cursor-pointer ${getPriorityBg(
                    todo.priority
                  )} ${getPriorityColor(todo.priority)}`}
                  title={`Click to change priority. Current: ${todo.priority}`}
                >
                  {todo.priority}
                </button>

                {/* Todo Text */}
                <div className="flex-1 min-w-0">
                  {editingId === todo.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && saveEdit()}
                        className="flex-1 px-2 py-1 bg-[var(--button-bg)] border border-[var(--accent)] rounded text-[var(--text-primary)] focus:outline-none"
                        autoFocus
                      />
                      <select
                        value={editPriority}
                        onChange={(e) =>
                          setEditPriority(e.target.value as Todo["priority"])
                        }
                        className="px-2 py-1 bg-[var(--button-bg)] border border-[var(--accent)] rounded text-[var(--text-primary)] focus:outline-none cursor-pointer text-xs"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  ) : (
                    <span
                      className={`block truncate ${
                        todo.completed
                          ? "line-through text-[var(--text-muted)]"
                          : "text-[var(--text-primary)]"
                      }`}
                    >
                      {todo.text}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  {editingId === todo.id ? (
                    <>
                      <button
                        onClick={saveEdit}
                        className="p-1 text-green-500 hover:text-green-600 transition-colors cursor-pointer"
                        title="Save"
                      >
                        <FaSave size={12} />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-1 text-gray-500 hover:text-gray-600 transition-colors cursor-pointer"
                        title="Cancel"
                      >
                        <FaTimes size={12} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(todo)}
                        className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <FaEdit size={12} />
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="p-1 text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <FaTrash size={12} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Priority Legend */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[var(--card-border)] text-xs text-[var(--text-muted)] flex-shrink-0">
          <span>Priority:</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>High</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>Medium</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Low</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
