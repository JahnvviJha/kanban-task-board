import { useState, useEffect, useMemo, useCallback } from 'react';
import { initialTasks } from '../data/initialTasks';
import { loadTasksFromStorage, saveTasksToStorage } from '../utils/storage';
import { isTaskOverdue } from '../utils/dateHelpers';

/**
 * Custom Hook: useTasks
 *
 * Why we created this custom hook:
 * Separating data operations (CRUD + persistence) away from UI rendering
 * makes our code modular, easier to read, and simpler to test!
 */
export function useTasks() {
  // 1. Initialize tasks from LocalStorage using a lazy function so it runs once
  const [tasks, setTasks] = useState(() => {
    return loadTasksFromStorage(initialTasks);
  });

  // 2. Automatically sync tasks to LocalStorage whenever tasks state updates
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  // 3. Add a brand new task
  const addTask = useCallback((taskData) => {
    const newTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      ...taskData,
      createdAt: new Date().toISOString()
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }, []);

  // 4. Update an existing task
  const updateTask = useCallback((taskId, updatedFields) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updatedFields } : t))
    );
  }, []);

  // 5. Delete a task permanently
  const deleteTask = useCallback((taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }, []);

  // 6. Move task between columns (status transition)
  const moveTaskStatus = useCallback((taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  }, []);

  // 7. Reset tasks to demo starter data
  const resetTasksToDemo = useCallback(() => {
    setTasks(initialTasks);
  }, []);

  // 8. Derived Metrics (useMemo calculates only when tasks array changes)
  const metrics = useMemo(() => {
    const total = tasks.length;
    const todoCount = tasks.filter((t) => t.status === 'Todo').length;
    const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length;
    const completedCount = tasks.filter((t) => t.status === 'Completed').length;
    const overdueCount = tasks.filter((t) => isTaskOverdue(t.dueDate, t.status)).length;
    const percentComplete = total > 0 ? Math.round((completedCount / total) * 100) : 0;

    return {
      total,
      todoCount,
      inProgressCount,
      completedCount,
      overdueCount,
      percentComplete
    };
  }, [tasks]);

  return {
    tasks,
    metrics,
    addTask,
    updateTask,
    deleteTask,
    moveTaskStatus,
    resetTasksToDemo
  };
}
