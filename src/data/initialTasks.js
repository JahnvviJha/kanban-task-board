/**
 * Starter mock data for the Kanban Task Board.
 * These give the board immediate life when opened for the first time,
 * reflecting actual technical interview preparation topics.
 */

// Helper to generate a relative date formatted as YYYY-MM-DD
function getRelativeDate(daysOffset) {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
}

export const initialTasks = [
  {
    id: 'task-1',
    title: 'Study Git Rebase vs Merge',
    description: 'Understand linear history vs merge commits and practice git rebase -i on a practice branch.',
    status: 'In Progress',
    priority: 'High',
    dueDate: getRelativeDate(1),
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-2',
    title: 'Record Git Scenario Self-Review Video',
    description: 'Record 60-90 second answers for all 5 Git scenarios to evaluate clarity and confidence before Sunday.',
    status: 'Todo',
    priority: 'High',
    dueDate: getRelativeDate(2),
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-3',
    title: 'Build Kanban Task Board UI',
    description: 'Create responsive 3-column layout with Todo, In Progress, and Completed columns using custom CSS.',
    status: 'In Progress',
    priority: 'High',
    dueDate: getRelativeDate(0),
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-4',
    title: 'Review Express Middleware Architecture',
    description: 'Verify sequential order: Logger -> Authenticate -> Validate -> Controller -> Error Handler.',
    status: 'Completed',
    priority: 'Medium',
    dueDate: getRelativeDate(-2),
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-5',
    title: 'Practice MongoDB Indexing with .explain()',
    description: 'Analyze COLLSCAN vs IXSCAN and practice ESR (Equality, Sort, Range) compound indexing rules.',
    status: 'Todo',
    priority: 'Medium',
    dueDate: getRelativeDate(3),
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-6',
    title: 'Verify LocalStorage Persistence & Validation',
    description: 'Ensure tasks survive browser reload and modals enforce title length and valid dates.',
    status: 'Completed',
    priority: 'Low',
    dueDate: getRelativeDate(-1),
    createdAt: new Date().toISOString()
  }
];
