import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import MetricsBar from './components/MetricsBar';
import FilterBar from './components/FilterBar';
import KanbanBoard from './components/KanbanBoard';
import TaskModal from './components/TaskModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { initialTasks } from './data/initialTasks';
import { loadTasksFromStorage, saveTasksToStorage } from './utils/storage';
import { isTaskOverdue } from './utils/dateHelpers';

export default function App() {
  // -------------------------------------------------------------
  // 1. Task State (Initialized from LocalStorage with fallback)
  // -------------------------------------------------------------
  // We use a lazy initializer function inside useState so that
  // localStorage is read only once when the page initially mounts!
  const [tasks, setTasks] = useState(() => {
    return loadTasksFromStorage(initialTasks);
  });

  // -------------------------------------------------------------
  // 2. Search & Filter State
  // -------------------------------------------------------------
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // -------------------------------------------------------------
  // 3. Modal Dialog States
  // -------------------------------------------------------------
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [defaultModalStatus, setDefaultModalStatus] = useState('Todo');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Drag-and-drop tracking state
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  // -------------------------------------------------------------
  // 4. Persistence Effect
  // -------------------------------------------------------------
  // Whenever the `tasks` state changes (add, edit, delete, status move),
  // automatically synchronize the array into LocalStorage.
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  // -------------------------------------------------------------
  // 5. Computed Derived Data (useMemo)
  // -------------------------------------------------------------
  // We compute filtered tasks using useMemo so we don't recalculate
  // filtering on unrelated component renders.
  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return tasks.filter((task) => {
      // 1. Search Query filter (matches title OR description)
      const matchesSearch =
        query === '' ||
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query));

      // 2. Priority filter ('All' matches everything)
      const matchesPriority =
        priorityFilter === 'All' || task.priority === priorityFilter;

      // 3. Status filter ('All' matches everything)
      const matchesStatus =
        statusFilter === 'All' || task.status === statusFilter;

      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [tasks, searchQuery, priorityFilter, statusFilter]);

  // Count overdue incomplete tasks
  const overdueCount = useMemo(() => {
    return tasks.filter((t) => isTaskOverdue(t.dueDate, t.status)).length;
  }, [tasks]);

  // -------------------------------------------------------------
  // 6. Task Management Handlers (CRUD)
  // -------------------------------------------------------------

  // Open modal to create a new task in a specific column
  const handleOpenNewTaskModal = (status = 'Todo') => {
    setTaskToEdit(null);
    setDefaultModalStatus(status);
    setIsTaskModalOpen(true);
  };

  // Open modal to edit an existing task
  const handleOpenEditTaskModal = (task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  // Save task (handles both Create and Update)
  const handleSaveTask = (formData) => {
    if (taskToEdit) {
      // Updating an existing task
      setTasks((prev) =>
        prev.map((t) => (t.id === taskToEdit.id ? { ...t, ...formData } : t))
      );
    } else {
      // Creating a brand new task
      const newTask = {
        id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        ...formData,
        createdAt: new Date().toISOString()
      };
      setTasks((prev) => [newTask, ...prev]);
    }
  };

  // Open delete confirmation modal
  const handleOpenDeleteModal = (task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  // Confirm permanent deletion of a task
  const handleConfirmDelete = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  // Move status directly (via arrows or select dropdown)
  const handleMoveStatus = useCallback((taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  }, []);

  // -------------------------------------------------------------
  // 7. Drag and Drop Handlers (HTML5 DnD API)
  // -------------------------------------------------------------
  const handleDragStartTask = (e, taskId) => {
    setDraggedTaskId(taskId);
    // Setting data in dataTransfer is required for cross-browser DnD support
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEndTask = () => {
    setDraggedTaskId(null);
  };

  const handleDropTask = (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;

    if (taskId) {
      handleMoveStatus(taskId, targetStatus);
    }
    setDraggedTaskId(null);
  };

  // -------------------------------------------------------------
  // 8. Reset Helpers
  // -------------------------------------------------------------
  const handleResetDemoData = () => {
    if (window.confirm('Reset all tasks back to default demo items?')) {
      setTasks(initialTasks);
      setSearchQuery('');
      setPriorityFilter('All');
      setStatusFilter('All');
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setPriorityFilter('All');
    setStatusFilter('All');
  };

  // -------------------------------------------------------------
  // 9. Render Application Layout
  // -------------------------------------------------------------
  return (
    <div className="app-container">
      {/* App Header with branding & primary actions */}
      <Header
        onOpenNewTaskModal={handleOpenNewTaskModal}
        onResetDemoData={handleResetDemoData}
      />

      {/* Metrics Bar with sprint progress bar & status counters */}
      <MetricsBar
        tasks={tasks}
        overdueCount={overdueCount}
      />

      {/* Toolbar: Search input, priority filter, column filter */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onResetFilters={handleResetFilters}
        totalMatching={filteredTasks.length}
        totalTasks={tasks.length}
      />

      {/* Kanban Board Grid (Todo / In Progress / Completed) */}
      <main className="main-content">
        <KanbanBoard
          filteredTasks={filteredTasks}
          onOpenNewTaskModal={handleOpenNewTaskModal}
          onEditTask={handleOpenEditTaskModal}
          onDeleteTask={handleOpenDeleteModal}
          onMoveStatus={handleMoveStatus}
          onDragStartTask={handleDragStartTask}
          onDragEndTask={handleDragEndTask}
          onDropTask={handleDropTask}
          onResetFilters={handleResetFilters}
          totalMatching={filteredTasks.length}
        />
      </main>

      {/* Create / Edit Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        initialData={taskToEdit}
        defaultStatus={defaultModalStatus}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        task={taskToDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
