import React, { useState } from 'react';
// 1. Custom Hooks (Separation of Concerns: Data & Filters)
import { useTasks } from './hooks/useTasks';
import { useKanbanFilters } from './hooks/useKanbanFilters';

// 2. Categorized Components
import Header from './components/layout/Header';
import MetricsBar from './components/layout/MetricsBar';
import FilterBar from './components/layout/FilterBar';
import KanbanBoard from './components/kanban/KanbanBoard';
import TaskModal from './components/modals/TaskModal';
import DeleteConfirmModal from './components/modals/DeleteConfirmModal';

/**
 * Main Application Component: App
 *
 * Architecture Highlights:
 * - Business logic and data storage are encapsulated inside custom hooks (`useTasks`, `useKanbanFilters`).
 * - UI components are organized into categorized domain folders (`layout/`, `kanban/`, `modals/`, `common/`).
 * - App.jsx acts as a clean orchestrator, handling modal states and drag-and-drop events.
 */
export default function App() {
  // -------------------------------------------------------------
  // 1. Data & State Management via Custom Hooks
  // -------------------------------------------------------------
  const {
    tasks,
    metrics,
    addTask,
    updateTask,
    deleteTask,
    moveTaskStatus,
    resetTasksToDemo
  } = useTasks();

  const {
    searchQuery,
    setSearchQuery,
    priorityFilter,
    setPriorityFilter,
    statusFilter,
    setStatusFilter,
    filteredTasks,
    resetFilters,
    hasActiveFilters
  } = useKanbanFilters(tasks);

  // -------------------------------------------------------------
  // 2. Modal Dialog States
  // -------------------------------------------------------------
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [defaultModalStatus, setDefaultModalStatus] = useState('Todo');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Drag-and-drop tracking state
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  // -------------------------------------------------------------
  // 3. Modal Handlers
  // -------------------------------------------------------------
  const handleOpenNewTaskModal = (status = 'Todo') => {
    setTaskToEdit(null);
    setDefaultModalStatus(status);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTaskModal = (task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (formData) => {
    if (taskToEdit) {
      updateTask(taskToEdit.id, formData);
    } else {
      addTask(formData);
    }
  };

  const handleOpenDeleteModal = (task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = (taskId) => {
    deleteTask(taskId);
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  // -------------------------------------------------------------
  // 4. Drag and Drop Handlers (HTML5 DnD API)
  // -------------------------------------------------------------
  const handleDragStartTask = (e, taskId) => {
    setDraggedTaskId(taskId);
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
      moveTaskStatus(taskId, targetStatus);
    }
    setDraggedTaskId(null);
  };

  // -------------------------------------------------------------
  // 5. Reset Helpers
  // -------------------------------------------------------------
  const handleResetDemoData = () => {
    if (window.confirm('Reset all tasks back to default demo items?')) {
      resetTasksToDemo();
      resetFilters();
    }
  };

  // -------------------------------------------------------------
  // 6. View Rendering
  // -------------------------------------------------------------
  return (
    <div className="app-container">
      {/* App Header with branding & primary action buttons */}
      <Header
        onOpenNewTaskModal={handleOpenNewTaskModal}
        onResetDemoData={handleResetDemoData}
      />

      {/* Metrics Bar with sprint progress bar & counters */}
      <MetricsBar metrics={metrics} />

      {/* Filter Bar with search box and priority/status dropdowns */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onResetFilters={resetFilters}
        totalMatching={filteredTasks.length}
        totalTasks={tasks.length}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Kanban Board Grid (Todo / In Progress / Completed) */}
      <main className="main-content">
        <KanbanBoard
          filteredTasks={filteredTasks}
          onOpenNewTaskModal={handleOpenNewTaskModal}
          onEditTask={handleOpenEditTaskModal}
          onDeleteTask={handleOpenDeleteModal}
          onMoveStatus={moveTaskStatus}
          onDragStartTask={handleDragStartTask}
          onDragEndTask={handleDragEndTask}
          onDropTask={handleDropTask}
          onResetFilters={resetFilters}
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
