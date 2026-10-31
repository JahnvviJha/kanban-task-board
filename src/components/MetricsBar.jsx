import React from 'react';
import { CheckCircle2, Clock, ListTodo, AlertTriangle } from 'lucide-react';

/**
 * MetricsBar component.
 * Gives the user a quick statistical overview of sprint progress:
 * - Total tasks & completion percentage
 * - Count of Todo, In Progress, Completed
 * - Alert badge if any tasks are overdue!
 */
export default function MetricsBar({ tasks, overdueCount }) {
  const total = tasks.length;
  const todoCount = tasks.filter((t) => t.status === 'Todo').length;
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;

  const percentComplete = total > 0 ? Math.round((completedCount / total) * 100) : 0;

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
