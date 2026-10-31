import React from 'react';
import { CheckCircle2, Clock, ListTodo, AlertTriangle } from 'lucide-react';

/**
 * Layout Component: MetricsBar
 * Displays sprint progress percentage and task category badges.
 */
export default function MetricsBar({ metrics }) {
  const {
    total = 0,
    todoCount = 0,
    inProgressCount = 0,
    completedCount = 0,
    overdueCount = 0,
    percentComplete = 0
  } = metrics || {};

  return (
    <section className="metrics-card" aria-label="Task progress summary">
      <div className="metrics-top-row">
        <div className="metrics-progress-label">
          <span className="metrics-title">Sprint Completion</span>
          <span className="metrics-percentage">{percentComplete}%</span>
        </div>
        <div className="progress-track" role="progressbar" aria-valuenow={percentComplete} aria-valuemin="0" aria-valuemax="100">
          <div
            className="progress-fill"
            style={{ width: `${percentComplete}%` }}
          />
        </div>
      </div>

      <div className="metrics-badges-grid">
        <div className="metric-badge">
          <ListTodo size={16} className="text-muted" />
          <span>Total: <strong>{total}</strong></span>
        </div>

        <div className="metric-badge status-todo-badge">
          <span className="status-dot dot-todo"></span>
          <span>Todo: <strong>{todoCount}</strong></span>
        </div>

        <div className="metric-badge status-progress-badge">
          <Clock size={16} className="text-warning" />
          <span>In Progress: <strong>{inProgressCount}</strong></span>
        </div>

        <div className="metric-badge status-completed-badge">
          <CheckCircle2 size={16} className="text-success" />
          <span>Completed: <strong>{completedCount}</strong></span>
        </div>

        {overdueCount > 0 && (
          <div className="metric-badge status-overdue-badge" title="Tasks past due date that are not completed">
            <AlertTriangle size={16} className="text-danger" />
            <span>Overdue: <strong>{overdueCount}</strong></span>
          </div>
        )}
      </div>
    </section>
  );
}
