export function ErrorMessage({
    title = 'Something went wrong',
    message = 'An unexpected error occurred while communicating with the service.',
    onRetry,
    retryText = 'Try Again',
}) {
    return (
        <div className="error-banner" role="alert">
            <div className="error-banner-content">
                <span className="error-banner-icon" aria-hidden="true">⚠️</span>
                <div>
                    <h4 className="error-banner-title">{title}</h4>
                    <p className="error-banner-message">{message}</p>
                </div>
            </div>
            {onRetry && (
                <button type="button" className="btn btn-secondary error-retry-btn" onClick={onRetry}>
                    🔄 {retryText}
                </button>
            )}
        </div>
    )
}

export default ErrorMessage
