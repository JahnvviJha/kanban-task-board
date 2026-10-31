/**
 * Safe LocalStorage utility functions.
 *
 * Why we wrap localStorage in a helper:
 * 1. In private/incognito mode or if storage quota is full, localStorage can throw errors.
 * 2. It keeps JSON.parse and JSON.stringify logic in one clean place.
 * 3. Makes unit testing and mocking easier!
 */

const STORAGE_KEY = 'kanban_board_tasks_v2';

export const loadTasksFromStorage = (fallbackData = []) => {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) {
      return fallbackData;
    }
    const parsed = JSON.parse(rawData);
    // Basic sanity check to ensure parsed data is an array
    return Array.isArray(parsed) ? parsed : fallbackData;
  } catch (err) {
    console.error('Error reading tasks from LocalStorage:', err);
    return fallbackData;
  }
};

export const saveTasksToStorage = (tasks) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('Error saving tasks to LocalStorage:', err);
  }
};

export const clearTasksFromStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing tasks from LocalStorage:', err);
  }
};
