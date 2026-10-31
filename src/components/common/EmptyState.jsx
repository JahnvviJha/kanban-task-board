import React from 'react';
import { SearchX, Inbox, Plus } from 'lucide-react';

/**
 * Reusable EmptyState component.
 * Handles two key UX states:
 * 1. "no-results": Search or filter found zero matching tasks.
 * 2. "empty-column": A Kanban column has no tasks currently.
 */
export default function EmptyState({
  type = 'empty-column',
  columnName = '',
  onAction,
  actionLabel = 'Add Task'
}) {
  if (type === 'no-results') {
    return (
      <div className="empty-state no-results-state">
        <div className="empty-icon-wrapper">
          <SearchX size={36} className="empty-icon text-muted" />
        </div>
        <h4 className="empty-title">No matching tasks found</h4>
        <p className="empty-description">
          We couldn't find any tasks matching your active search or filter criteria.
        </p>
        {onAction && (
          <button
            type="button"
            className="btn btn-secondary mt-2"
            onClick={onAction}
          >
            Clear Filters
          </button>
        )}
      </div>
    );
  }

  // Default: Column is empty
  return (
    <div className="empty-state column-empty-state">
      <div className="empty-icon-wrapper-small">
        <Inbox size={24} className="text-muted" />
      </div>
      <p className="empty-column-title">No tasks in {columnName}</p>
      <p className="empty-column-desc">
        Drag a task here or click below to create one.
      </p>
      {onAction && (
        <button
          type="button"
          className="btn-add-inline"
          onClick={onAction}
          title={`Add task directly to ${columnName}`}
        >
          <Plus size={14} />
          <span>Add Task</span>
        </button>
      )}
    </div>
  );
}
