/**
 * Reusable LoadingButton component.
 * Prevents double submission when async operation is running.
 * Fulfills syllabus Module C and Module E requirements.
 */
export function LoadingButton({
    children,
    isLoading = false,
    loadingText = 'Processing...',
    disabled = false,
    type = 'submit',
    variant = 'primary', // 'primary' | 'secondary' | 'danger' | 'outline'
    className = '',
    onClick,
    icon,
    ...props
}) {
    return (
        <button
            type={type}
            disabled={disabled || isLoading}
            onClick={onClick}
            aria-busy={isLoading}
            className={`btn btn-${variant} ${isLoading ? 'btn-loading' : ''} ${className}`}
            {...props}
        >
            {isLoading ? (
                <span className="btn-spinner-content">
                    <span className="spinner-icon mini" aria-hidden="true" />
                    <span>{loadingText}</span>
                </span>
            ) : (
                <span className="btn-content">
                    {icon && <span className="btn-icon" aria-hidden="true">{icon}</span>}
                    {children}
                </span>
            )}
        </button>
    )
}

export default LoadingButton
