/**
 * Application-wide constants for the Kanban Task Board.
 * Centralizing constants prevents typo bugs and makes configuration easy!
 */

// 1. Column Definitions
export const COLUMNS = [
  { id: 'Todo', title: 'Todo', colorTheme: 'col-theme-todo' },
  { id: 'In Progress', title: 'In Progress', colorTheme: 'col-theme-progress' },
  { id: 'Completed', title: 'Completed', colorTheme: 'col-theme-completed' }
];

// 2. Priority Levels
export const PRIORITIES = ['High', 'Medium', 'Low'];

// 3. Storage Key for LocalStorage Persistence
export const STORAGE_KEY = 'kanban_board_tasks_v2';

// 4. Input Validation Constraints
export const VALIDATION_LIMITS = {
  MIN_TITLE_LENGTH: 2,
  MAX_TITLE_LENGTH: 80,
  MAX_DESCRIPTION_LENGTH: 500
};
