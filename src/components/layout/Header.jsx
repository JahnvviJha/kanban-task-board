import React from 'react';
import { Kanban, Plus, RotateCcw } from 'lucide-react';

/**
 * Layout Component: Header
 * Displays the Kanban branding, sprint title, and primary actions.
 */
export default function Header({ onOpenNewTaskModal, onResetDemoData }) {
  return (
    <header className="kanban-header">
      <div className="header-brand">
        <div className="logo-icon-wrapper">
          <Kanban className="logo-icon" size={28} />
        </div>
        <div>
          <h1 className="header-title">Kanban Task Board</h1>
          <p className="header-subtitle">
            Sprint & task management across Todo, In Progress, and Completed
          </p>
        </div>
      </div>

      <div className="header-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onResetDemoData}
          title="Restore starter demo tasks"
        >
          <RotateCcw size={16} />
          <span>Reset Demo</span>
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => onOpenNewTaskModal('Todo')}
          title="Add a new task"
        >
          <Plus size={18} />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
}
