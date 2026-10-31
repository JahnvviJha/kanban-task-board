import React, { useState, useEffect, useRef } from 'react';
import { X, Check } from 'lucide-react';
import { getTodayString } from '../utils/dateHelpers';

/**
 * TaskModal component.
 * Provides a clean, accessible dialog to create or edit a task with validation.
 */
export default function TaskModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  defaultStatus = 'Todo'
}) {
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: defaultStatus,
    priority: 'Medium',
    dueDate: getTodayString()
  });

  const [errors, setErrors] = useState({});
  const titleInputRef = useRef(null);

  // Sync state whenever modal opens or initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || 'Todo',
        priority: initialData.priority || 'Medium',
        dueDate: initialData.dueDate || getTodayString()
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: defaultStatus,
        priority: 'Medium',
        dueDate: getTodayString()
      });
    }
    setErrors({});
  }, [initialData, defaultStatus, isOpen]);

  // Handle ESC key and focus management
  useEffect(() => {
    if (isOpen) {
      // Focus the title input when modal opens
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 50);

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Validation function
  const validate = () => {
    const errs = {};
    const trimmedTitle = formData.title.trim();

    if (!trimmedTitle) {
      errs.title = 'Task title is required.';
    } else if (trimmedTitle.length < 2) {
      errs.title = 'Title must be at least 2 characters long.';
    } else if (trimmedTitle.length > 80) {
      errs.title = 'Title cannot exceed 80 characters.';
    }

    if (formData.description && formData.description.length > 500) {
      errs.description = 'Description cannot exceed 500 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim()
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()} /* Prevents closing when clicking inside */
      >
        {/* Modal Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          {/* Title Input */}
          <div className="form-group">
            <label htmlFor="task-title" className="form-label">
              Task Title <span className="text-danger">*</span>
            </label>
            <input
              id="task-title"
              ref={titleInputRef}
              type="text"
              className={`form-input ${errors.title ? 'input-error' : ''}`}
              placeholder="e.g. Implement drag and drop handlers"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: null });
              }}
              maxLength={85}
              required
            />
            {errors.title && <span className="field-error-msg">{errors.title}</span>}
          </div>

          {/* Status & Priority Row */}
          <div className="form-row">
            <div className="form-group form-col">
              <label htmlFor="task-status" className="form-label">
                Column / Status
              </label>
              <select
                id="task-status"
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="form-group form-col">
              <label htmlFor="task-priority" className="form-label">
                Priority
              </label>
              <select
                id="task-priority"
                className="form-select"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Due Date Input */}
          <div className="form-group">
            <label htmlFor="task-due-date" className="form-label">
              Due Date
            </label>
            <input
              id="task-due-date"
              type="date"
              className="form-input"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          {/* Description Textarea */}
          <div className="form-group">
            <label htmlFor="task-desc" className="form-label">
              Description <span className="text-muted">(Optional)</span>
            </label>
            <textarea
              id="task-desc"
              rows={3}
              className={`form-textarea ${errors.description ? 'input-error' : ''}`}
              placeholder="Add key notes, steps, or acceptance criteria..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              maxLength={500}
            />
            {errors.description && (
              <span className="field-error-msg">{errors.description}</span>
            )}
            <span className="form-help-text">
              {formData.description.length}/500 characters
            </span>
          </div>

          {/* Modal Actions */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              <Check size={16} />
              <span>{isEditing ? 'Save Changes' : 'Create Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
