import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

/**
 * DeleteConfirmModal component.
 * Confirms before permanently deleting a task, avoiding accidental clicks.
 */
export default function DeleteConfirmModal({
  isOpen,
  task,
  onClose,
  onConfirm
}) {
  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !task) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-card modal-card-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="danger-modal-icon">
            <AlertTriangle size={20} className="text-danger" />
          </div>
          <h2 className="modal-title">Delete Task?</h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body-content">
          <p className="delete-warning-text">
            Are you sure you want to delete this task?
          </p>
          <div className="task-preview-box">
            <strong>{task.title}</strong>
            <span className="task-preview-status">Status: {task.status}</span>
          </div>
          <p className="delete-irreversible-hint">
            This action cannot be undone.
          </p>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onConfirm(task.id)}
          >
            <Trash2 size={16} />
            <span>Delete Permanently</span>
          </button>
        </div>
      </div>
    </div>
  );
}
