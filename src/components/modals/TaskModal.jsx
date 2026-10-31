import React, { useState, useEffect, useRef } from 'react';
import { X, Check } from 'lucide-react';
import { getTodayString } from '../../utils/dateHelpers';
import { VALIDATION_LIMITS, PRIORITIES, COLUMNS } from '../../constants/kanbanConstants';

/**
 * Modal Component: TaskModal
 * Add / Edit task modal dialog with robust form validation and keyboard navigation.
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
    } else if (trimmedTitle.length < VALIDATION_LIMITS.MIN_TITLE_LENGTH) {
      errs.title = `Title must be at least ${VALIDATION_LIMITS.MIN_TITLE_LENGTH} characters long.`;
    } else if (trimmedTitle.length > VALIDATION_LIMITS.MAX_TITLE_LENGTH) {
      errs.title = `Title cannot exceed ${VALIDATION_LIMITS.MAX_TITLE_LENGTH} characters.`;
    }

    if (formData.description && formData.description.length > VALIDATION_LIMITS.MAX_DESCRIPTION_LENGTH) {
      errs.description = `Description cannot exceed ${VALIDATION_LIMITS.MAX_DESCRIPTION_LENGTH} characters.`;
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
        onClick={(e) => e.stopPropagation()}
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
              maxLength={VALIDATION_LIMITS.MAX_TITLE_LENGTH + 5}
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
                {COLUMNS.map((col) => (
                  <option key={col.id} value={col.id}>{col.title}</option>
                ))}
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
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
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
              maxLength={VALIDATION_LIMITS.MAX_DESCRIPTION_LENGTH}
            />
            {errors.description && (
              <span className="field-error-msg">{errors.description}</span>
            )}
            <span className="form-help-text">
              {formData.description.length}/{VALIDATION_LIMITS.MAX_DESCRIPTION_LENGTH} characters
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
