import React from 'react';

/**
 * Reusable PriorityBadge component.
 * Displays styled badge for High, Medium, or Low priority.
 */
export default function PriorityBadge({ priority }) {
  const normalized = (priority || 'Medium').toLowerCase();

  return (
    <span className={`priority-pill priority-${normalized}`}>
      {priority} Priority
    </span>
  );
}
