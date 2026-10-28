import { useEffect } from 'react'

export function ConfirmModal({
    isOpen,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed? This action cannot be undone.',
    confirmText = 'Delete',
    cancelText = 'Cancel',
    isDestructive = true,
    isLoading = false,
    onConfirm,
    onCancel,
}) {
    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && !isLoading) {
                onCancel()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, isLoading, onCancel])

    if (!isOpen) return null

    return (
        <div
            className="modal-overlay"
            onClick={isLoading ? undefined : onCancel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
        >
            <div
                className="modal-box confirm-dialog-box"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="confirm-icon-wrapper" aria-hidden="true">
                    {isDestructive ? '🗑️' : '❓'}
                </div>
                <h3 id="confirm-modal-title" className="confirm-dialog-title">
                    {title}
                </h3>
                <p className="confirm-dialog-message">{message}</p>

                <div className="confirm-dialog-actions">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        className={`btn ${isDestructive ? 'btn-danger' : 'btn-primary'}`}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal
