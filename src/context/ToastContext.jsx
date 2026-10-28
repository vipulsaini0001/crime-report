import { useState, useCallback } from 'react'
import { ToastContext } from './ToastContextDef'

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, [])

    const showToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const newToast = { id, message, type, duration }

        setToasts((prev) => [...prev, newToast])

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id)
            }, duration)
        }
        return id
    }, [removeToast])

    const success = useCallback((message, duration) => showToast(message, 'success', duration), [showToast])
    const error = useCallback((message, duration) => showToast(message, 'error', duration), [showToast])
    const warning = useCallback((message, duration) => showToast(message, 'warning', duration), [showToast])
    const info = useCallback((message, duration) => showToast(message, 'info', duration), [showToast])

    return (
        <ToastContext.Provider value={{ toasts, showToast, removeToast, success, error, warning, info }}>
            {children}
        </ToastContext.Provider>
    )
}

export default ToastProvider
