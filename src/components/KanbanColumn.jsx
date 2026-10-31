import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';
import EmptyState from './EmptyState';

/**
 * KanbanColumn component.
 * Acts as the container and drop target for one of the three statuses:
 * - Todo
 * - In Progress
 * - Completed
 */
export default function KanbanColumn({
  status,
  title,
  tasks,
  onOpenNewTaskModal,
  onEditTask,
  onDeleteTask,
  onMoveStatus,
  onDragStartTask,
  onDragEndTask,
  onDropTask
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  // When a card is dragged over this column, prevent default to allow drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    // Check if the drag is actually leaving the column container
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (onDropTask) {
      onDropTask(e, status);
    }
  };

  const getStatusColorClass = () => {
    switch (status) {
      case 'Todo':
        return 'col-theme-todo';
      case 'In Progress':
        return 'col-theme-progress';
      case 'Completed':
        return 'col-theme-completed';
      default:
        return '';
    }
  };

  return (
    <div
      className={`kanban-column ${getStatusColorClass()} ${isDragOver ? 'column-drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-column-status={status}
    >
      {/* 1. Column Header */}
      <div className="column-header">
        <div className="column-header-left">
          <span className="column-status-indicator"></span>
          <h2 className="column-title">{title}</h2>
          <span className="column-count-badge" aria-label={`${tasks.length} tasks`}>
            {tasks.length}
          </span>
        </div>

        <button
          type="button"
          className="btn-column-add"
          onClick={() => onOpenNewTaskModal(status)}
          title={`Add new task to ${title}`}
          aria-label={`Add task to ${title}`}
        >
          <Plus size={16} />
        </button>
      </div>

      {/* 2. Tasks Container / Drop Zone */}
      <div className="column-cards-container">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onMoveStatus={onMoveStatus}
              onDragStart={onDragStartTask}
              onDragEnd={onDragEndTask}
            />
          ))
        ) : (
          <EmptyState
            type="empty-column"
            columnName={title}
            onAction={() => onOpenNewTaskModal(status)}
          />
        )}
      </div>
    </div>
  );
}
