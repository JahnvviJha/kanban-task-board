import React, { useState } from 'react';
import { Calendar, AlertCircle, Edit2, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
import PriorityBadge from '../common/PriorityBadge';
import { isTaskOverdue, formatDueDateLabel } from '../../utils/dateHelpers';
import { COLUMNS } from '../../constants/kanbanConstants';

/**
 * Kanban Component: TaskCard
 * Individual draggable task card with quick-move controls and action triggers.
 */
export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onMoveStatus,
  onDragStart,
  onDragEnd
}) {
  const [isDragging, setIsDragging] = useState(false);

  const isOverdue = isTaskOverdue(task.dueDate, task.status);
  const formattedDueDate = formatDueDateLabel(task.dueDate);

  // Status progression map for directional move buttons
  const statusFlow = COLUMNS.map((col) => col.id);
  const currentIndex = statusFlow.indexOf(task.status);
  const prevStatus = currentIndex > 0 ? statusFlow[currentIndex - 1] : null;
  const nextStatus = currentIndex < statusFlow.length - 1 ? statusFlow[currentIndex + 1] : null;

  const handleDragStartInternal = (e) => {
    setIsDragging(true);
    if (onDragStart) {
      onDragStart(e, task.id);
    }
  };

  const handleDragEndInternal = (e) => {
    setIsDragging(false);
    if (onDragEnd) {
      onDragEnd(e);
    }
  };

  return (
    <div
      className={`task-card ${isDragging ? 'is-dragging' : ''} ${isOverdue ? 'card-overdue' : ''}`}
      draggable="true"
      onDragStart={handleDragStartInternal}
      onDragEnd={handleDragEndInternal}
      data-task-id={task.id}
    >
      {/* 1. Card Top Bar: Priority Badge & Action Buttons */}
      <div className="card-top-bar">
        <PriorityBadge priority={task.priority} />

        <div className="card-top-actions">
          <button
            type="button"
            className="card-action-btn edit-btn"
            onClick={() => onEdit(task)}
            title="Edit task"
            aria-label={`Edit task ${task.title}`}
          >
            <Edit2 size={14} />
          </button>
          <button
            type="button"
            className="card-action-btn delete-btn"
            onClick={() => onDelete(task)}
            title="Delete task"
            aria-label={`Delete task ${task.title}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* 2. Task Title */}
      <h3 className="card-title">{task.title}</h3>

      {/* 3. Task Description (if provided) */}
      {task.description && (
        <p className="card-description">{task.description}</p>
      )}

      {/* 4. Due Date & Overdue Indicator */}
      {task.dueDate && (
        <div className={`due-date-row ${isOverdue ? 'date-overdue' : ''}`}>
          {isOverdue ? (
            <AlertCircle size={14} className="text-danger" />
          ) : (
            <Calendar size={14} className="text-muted" />
          )}
          <span className="due-date-text">{formattedDueDate}</span>
        </div>
      )}

      {/* 5. Card Bottom: Quick-Move Controls (Essential for mobile and keyboard usability!) */}
      <div className="card-footer">
        <div className="quick-move-group">
          {prevStatus && (
            <button
              type="button"
              className="quick-move-btn"
              onClick={() => onMoveStatus(task.id, prevStatus)}
              title={`Move back to ${prevStatus}`}
            >
              <ArrowLeft size={13} />
              <span>{prevStatus}</span>
            </button>
          )}

          {nextStatus && (
            <button
              type="button"
              className="quick-move-btn btn-forward"
              onClick={() => onMoveStatus(task.id, nextStatus)}
              title={`Move forward to ${nextStatus}`}
            >
              <span>{nextStatus}</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>

        {/* Direct status selector dropdown for full mobile flexibility */}
        <select
          className="card-status-select"
          value={task.status}
          onChange={(e) => onMoveStatus(task.id, e.target.value)}
          aria-label="Change status"
        >
          {COLUMNS.map((col) => (
            <option key={col.id} value={col.id}>{col.title}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
