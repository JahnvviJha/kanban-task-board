/**
 * Date helper utilities for the Kanban board.
 * Human-friendly date formatting and overdue checks.
 */

// Returns today's date formatted as YYYY-MM-DD for <input type="date">
export const getTodayString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Checks if a task is overdue.
// A task is overdue only if:
// 1. A dueDate exists
// 2. The task is not already 'Completed'
// 3. The due date is before today
export const isTaskOverdue = (dueDate, status) => {
  if (!dueDate || status === 'Completed') return false;

  const todayStr = getTodayString();
  return dueDate < todayStr;
};

// Formats a date string into a friendly human label like "Today", "Tomorrow", "Yesterday", or "Oct 31, 2026"
export const formatDueDateLabel = (dateString) => {
  if (!dateString) return 'No due date';

  const todayStr = getTodayString();
  
  // Quick direct comparisons for today
  if (dateString === todayStr) {
    return 'Due Today';
  }

  // Calculate day difference
  const targetDate = new Date(dateString + 'T00:00:00');
  const todayDate = new Date(todayStr + 'T00:00:00');
  const diffTime = targetDate - todayDate;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return 'Due Tomorrow';
  if (diffDays === -1) return 'Overdue by 1 day';
  if (diffDays < -1) return `Overdue by ${Math.abs(diffDays)} days`;

  // Standard readable date formatting
  return targetDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};
