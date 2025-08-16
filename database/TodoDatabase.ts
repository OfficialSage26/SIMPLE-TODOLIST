import * as SQLite from 'expo-sqlite';

const dbPromise = SQLite.openDatabaseAsync('todo.db');

export const initDB = async (): Promise<void> => {
  const db = await dbPromise;
  await db.execAsync(
    'CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, completed INTEGER NOT NULL DEFAULT 0);'
  );
};

export const addTodo = async (title: string, onSuccess: () => void): Promise<void> => {
  const db = await dbPromise;
  await db.runAsync('INSERT INTO todos (title, completed) VALUES (?, 0);', [title]);
  onSuccess();
};

export const getTodos = async (onSuccess: (todos: Todo[]) => void): Promise<void> => {
  const db = await dbPromise;
  const rows = await db.getAllAsync<Todo>('SELECT id, title, completed FROM todos;');
  onSuccess(rows);
};

export const toggleTodo = async (
  id: number,
  completed: boolean,
  onSuccess: () => void
): Promise<void> => {
  const db = await dbPromise;
  await db.runAsync('UPDATE todos SET completed = ? WHERE id = ?;', [completed ? 1 : 0, id]);
  onSuccess();
};

export const deleteTodo = async (id: number, onSuccess: () => void): Promise<void> => {
  const db = await dbPromise;
  await db.runAsync('DELETE FROM todos WHERE id = ?;', [id]);
  onSuccess();
};

export const deleteAllComplete = async (onSuccess: () => void): Promise<void> => {
  const db = await dbPromise;
  await db.runAsync('DELETE FROM todos WHERE completed = 1;');
  onSuccess();
};

export interface Todo {
  id: number;
  title: string;
  completed: number;
}