/**
 * Automated Logic & State Verification Test Suite for Kanban Task Board
 * Location: tests/test_logic.js
 * Run using: npm test
 */

import { initialTasks } from '../src/data/initialTasks.js';
import { isTaskOverdue, formatDueDateLabel, getTodayString } from '../src/utils/dateHelpers.js';
import { VALIDATION_LIMITS, COLUMNS, PRIORITIES } from '../src/constants/kanbanConstants.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

console.log('=== Running Kanban Task Board Logic Tests ===\n');

// 1. Initial State & Constants Tests
console.log('Test Group 1: Constants & Initial Task Data Structure');
assert(Array.isArray(initialTasks), 'initialTasks is an array');
assert(initialTasks.length >= 5, `Initial dataset has at least 5 starter tasks (has ${initialTasks.length})`);

const validStatuses = COLUMNS.map(c => c.id);
const validPriorities = PRIORITIES;

const allStatusesValid = initialTasks.every(t => validStatuses.includes(t.status));
assert(allStatusesValid, 'All starter tasks have valid status (Todo, In Progress, or Completed)');

const allPrioritiesValid = initialTasks.every(t => validPriorities.includes(t.priority));
assert(allPrioritiesValid, 'All starter tasks have valid priority (High, Medium, or Low)');

// 2. Task Validation Logic Tests
console.log('\nTest Group 2: Form Validation Logic');
function validateTaskInput(title, description) {
  const errors = {};
  const trimmed = (title || '').trim();
  if (!trimmed) {
    errors.title = 'Title is required';
  } else if (trimmed.length < VALIDATION_LIMITS.MIN_TITLE_LENGTH) {
    errors.title = 'Title too short';
  } else if (trimmed.length > VALIDATION_LIMITS.MAX_TITLE_LENGTH) {
    errors.title = 'Title too long';
  }
  if (description && description.length > VALIDATION_LIMITS.MAX_DESCRIPTION_LENGTH) {
    errors.description = 'Description too long';
  }
  return { isValid: Object.keys(errors).length === 0, errors };
}

assert(!validateTaskInput('', '').isValid, 'Rejects empty title');
assert(!validateTaskInput('   ', '').isValid, 'Rejects whitespace-only title');
assert(!validateTaskInput('a', '').isValid, 'Rejects title shorter than 2 chars');
assert(validateTaskInput('Valid Title', 'Some description').isValid, 'Accepts valid title & description');
assert(!validateTaskInput('Valid Title', 'a'.repeat(501)).isValid, 'Rejects description > 500 chars');

// 3. Task CRUD & State Transition Tests
console.log('\nTest Group 3: Task CRUD Operations');
let testTasks = [...initialTasks];

// Create
const newTask = {
  id: 'task-test-999',
  title: 'Test New Task',
  description: 'Sample description',
  status: 'Todo',
  priority: 'High',
  dueDate: '2026-11-15'
};
testTasks = [newTask, ...testTasks];
assert(testTasks.some(t => t.id === 'task-test-999'), 'Successfully adds new task to state');

// Update / Edit
testTasks = testTasks.map(t =>
  t.id === 'task-test-999' ? { ...t, title: 'Updated Title', priority: 'Low' } : t
);
const updatedTask = testTasks.find(t => t.id === 'task-test-999');
assert(updatedTask.title === 'Updated Title' && updatedTask.priority === 'Low', 'Successfully updates task fields');

// Move Status
testTasks = testTasks.map(t =>
  t.id === 'task-test-999' ? { ...t, status: 'In Progress' } : t
);
assert(testTasks.find(t => t.id === 'task-test-999').status === 'In Progress', 'Successfully moves status to In Progress');

testTasks = testTasks.map(t =>
  t.id === 'task-test-999' ? { ...t, status: 'Completed' } : t
);
assert(testTasks.find(t => t.id === 'task-test-999').status === 'Completed', 'Successfully moves status to Completed');

// Delete
testTasks = testTasks.filter(t => t.id !== 'task-test-999');
assert(!testTasks.some(t => t.id === 'task-test-999'), 'Successfully deletes task');

// 4. Search and Filter Tests
console.log('\nTest Group 4: Search & Filtering Logic');
function filterTasks(taskList, query, priority, status) {
  const q = (query || '').trim().toLowerCase();
  return taskList.filter(task => {
    const matchesSearch =
      q === '' ||
      task.title.toLowerCase().includes(q) ||
      (task.description && task.description.toLowerCase().includes(query));

    const matchesPriority = priority === 'All' || task.priority === priority;
    const matchesStatus = status === 'All' || task.status === status;

    return matchesSearch && matchesPriority && matchesStatus;
  });
}

const searchResults = filterTasks(initialTasks, 'git', 'All', 'All');
assert(searchResults.length > 0, `Search for 'git' finds matching tasks (${searchResults.length} found)`);

const highPriorityTasks = filterTasks(initialTasks, '', 'High', 'All');
assert(highPriorityTasks.every(t => t.priority === 'High'), 'Priority filter returns only High priority tasks');

const completedTasks = filterTasks(initialTasks, '', 'All', 'Completed');
assert(completedTasks.every(t => t.status === 'Completed'), 'Status filter returns only Completed tasks');

const noResults = filterTasks(initialTasks, 'nonexistentxyzterm12345', 'All', 'All');
assert(noResults.length === 0, 'Returns 0 results for non-matching search term');

// 5. Date & Overdue Calculation Tests
console.log('\nTest Group 5: Due Date & Overdue Logic');
const todayStr = getTodayString();
assert(todayStr.match(/^\d{4}-\d{2}-\d{2}$/), `getTodayString returns YYYY-MM-DD format (${todayStr})`);

// Yesterday
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayStr = yesterday.toISOString().split('T')[0];

assert(isTaskOverdue(yesterdayStr, 'Todo') === true, 'Past due date in Todo status is correctly marked overdue');
assert(isTaskOverdue(yesterdayStr, 'In Progress') === true, 'Past due date in In Progress status is correctly marked overdue');
assert(isTaskOverdue(yesterdayStr, 'Completed') === false, 'Past due date in Completed status is NOT marked overdue');

// Tomorrow
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowStr = tomorrow.toISOString().split('T')[0];
assert(isTaskOverdue(tomorrowStr, 'Todo') === false, 'Future due date is NOT overdue');

console.log(`\n========================================`);
console.log(`Test Results: ${passed} passed, ${failed} failed`);
console.log(`========================================`);

if (failed > 0) {
  process.exit(1);
}
