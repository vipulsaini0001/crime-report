export function LoadingSpinner({ text = 'Loading...', size = 'medium' }) {
    return (
        <div className={`loading-spinner-wrapper size-${size}`} role="status" aria-live="polite">
            <div className="spinner-circle" aria-hidden="true" />
            {text && <p className="spinner-text">{text}</p>}
        </div>
    )
}

export default LoadingSpinner
