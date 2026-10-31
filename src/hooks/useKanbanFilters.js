import { useState, useMemo, useCallback } from 'react';

/**
 * Custom Hook: useKanbanFilters
 *
 * Encapsulates search and multi-parameter filtering logic.
 * Keeps our App component clean and focused purely on view composition!
 */
export function useKanbanFilters(tasks = []) {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Filter tasks in real time based on active criteria
  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return tasks.filter((task) => {
      // 1. Text search on title and description
      const matchesSearch =
        query === '' ||
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query));

      // 2. Priority dropdown
      const matchesPriority =
        priorityFilter === 'All' || task.priority === priorityFilter;

      // 3. Status dropdown
      const matchesStatus =
        statusFilter === 'All' || task.status === statusFilter;

      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [tasks, searchQuery, priorityFilter, statusFilter]);

  // Reset all filters to default state
  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setPriorityFilter('All');
    setStatusFilter('All');
  }, []);

  const hasActiveFilters =
    searchQuery.trim() !== '' || priorityFilter !== 'All' || statusFilter !== 'All';

  return {
    searchQuery,
    setSearchQuery,
    priorityFilter,
    setPriorityFilter,
    statusFilter,
    setStatusFilter,
    filteredTasks,
    resetFilters,
    hasActiveFilters
  };
}
