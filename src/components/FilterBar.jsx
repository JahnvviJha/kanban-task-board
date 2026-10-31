import React from 'react';
import { Search, X, Filter } from 'lucide-react';

/**
 * FilterBar component.
 * Allows users to search tasks by keyword and filter by priority or column status.
 */
export default function FilterBar({
  searchQuery,
  onSearchChange,
  priorityFilter,
  onPriorityChange,
  statusFilter,
  onStatusChange,
  onResetFilters,
  totalMatching,
  totalTasks
}) {
  const hasActiveFilters = searchQuery.trim() !== '' || priorityFilter !== 'All' || statusFilter !== 'All';

  return (
    <div className="filter-bar">
      {/* 1. Search Box with clear icon */}
      <div className="search-input-wrapper">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          className="search-input"
          placeholder="Search tasks by title or description..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search tasks"
        />
        {searchQuery && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => onSearchChange('')}
            title="Clear search input"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* 2. Priority Filter Dropdown */}
      <div className="filter-select-group">
        <label htmlFor="priority-filter" className="filter-label">
          <Filter size={14} /> Priority:
        </label>
        <select
          id="priority-filter"
          className="filter-select"
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value)}
        >
          <option value="All">All Priorities</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>
      </div>

      {/* 3. Status / Column Filter Dropdown */}
      <div className="filter-select-group">
        <label htmlFor="status-filter" className="filter-label">
          Status:
        </label>
        <select
          id="status-filter"
          className="filter-select"
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Todo">Todo Only</option>
          <option value="In Progress">In Progress Only</option>
          <option value="Completed">Completed Only</option>
        </select>
      </div>

      {/* 4. Active Filters Reset & Count Display */}
      <div className="filter-summary">
        <span className="results-count">
          Showing <strong>{totalMatching}</strong> of {totalTasks}
        </span>
        {hasActiveFilters && (
          <button
            type="button"
            className="btn btn-subtle-reset"
            onClick={onResetFilters}
            title="Reset all search queries and dropdown filters"
          >
            <X size={14} />
            <span>Clear Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
