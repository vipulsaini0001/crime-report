import { useToast } from '../../hooks/useToast'

export function ToastContainer() {
    const { toasts, removeToast } = useToast()

    if (!toasts || toasts.length === 0) return null

    const typeIcons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️',
    }

    return (
        <aside className="toast-container" aria-live="polite" aria-label="Notifications">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`toast-item toast-${toast.type}`}
                    role="alert"
                >
                    <span className="toast-icon" aria-hidden="true">
                        {typeIcons[toast.type] || 'ℹ️'}
                    </span>
                    <div className="toast-message">{toast.message}</div>
                    <button
                        type="button"
                        className="toast-close-btn"
                        onClick={() => removeToast(toast.id)}
                        aria-label="Dismiss notification"
                    >
                        ×
                    </button>
                </div>
            ))}
        </aside>
    )
}

export default ToastContainer
