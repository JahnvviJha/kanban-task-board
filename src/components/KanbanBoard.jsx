import React, { useState } from 'react';
import KanbanColumn from './KanbanColumn';
import EmptyState from './EmptyState';

const COLUMNS = [
  { id: 'Todo', title: 'Todo' },
  { id: 'In Progress', title: 'In Progress' },
  { id: 'Completed', title: 'Completed' }
];

/**
 * KanbanBoard component.
 * Lays out the columns and provides responsive tabs on mobile devices.
 */
export default function KanbanBoard({
  filteredTasks,
  onOpenNewTaskModal,
  onEditTask,
  onDeleteTask,
  onMoveStatus,
  onDragStartTask,
  onDragEndTask,
  onDropTask,
  onResetFilters,
  totalMatching
}) {
  // Mobile active tab view ('All', 'Todo', 'In Progress', 'Completed')
  const [mobileTab, setMobileTab] = useState('All');

  // If user searched/filtered and nothing matched at all across all 3 columns
  if (totalMatching === 0) {
    return (
      <EmptyState
        type="no-results"
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="kanban-board-wrapper">
      {/* Mobile Column Navigation Tabs (visible on mobile screens <= 768px) */}
      <div className="mobile-tabs-bar" role="tablist" aria-label="Select column view">
        <button
          type="button"
          className={`mobile-tab-btn ${mobileTab === 'All' ? 'active' : ''}`}
          onClick={() => setMobileTab('All')}
        >
          All Columns
        </button>
        {COLUMNS.map((col) => {
          const count = filteredTasks.filter((t) => t.status === col.id).length;
          return (
            <button
              key={col.id}
              type="button"
              className={`mobile-tab-btn ${mobileTab === col.id ? 'active' : ''}`}
              onClick={() => setMobileTab(col.id)}
            >
              {col.title} ({count})
            </button>
          );
        })}
      </div>

      {/* Main Kanban Grid */}
      <div className="kanban-grid">
        {COLUMNS.map((col) => {
          // If on mobile and a specific tab is selected, hide other columns
          if (mobileTab !== 'All' && mobileTab !== col.id) {
            return null;
          }

          const columnTasks = filteredTasks.filter((t) => t.status === col.id);

          return (
            <KanbanColumn
              key={col.id}
              status={col.id}
              title={col.title}
              tasks={columnTasks}
              onOpenNewTaskModal={onOpenNewTaskModal}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onMoveStatus={onMoveStatus}
              onDragStartTask={onDragStartTask}
              onDragEndTask={onDragEndTask}
              onDropTask={onDropTask}
            />
          );
        })}
      </div>
    </div>
  );
}
