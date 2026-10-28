/**
 * Reusable accessible TextAreaField component with character count indicator.
 * Fulfills syllabus Module C requirement.
 */
export function TextAreaField({
    id,
    label,
    value,
    onChange,
    placeholder,
    error,
    helperText,
    required = false,
    disabled = false,
    rows = 4,
    maxLength,
    showCount = false,
    className = '',
}) {
    const textId = id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined)
    const currentLength = value ? value.length : 0

    return (
        <div className={`form-group ${className}`}>
            <div className="label-row">
                {label && (
                    <label htmlFor={textId} className="form-label">
                        {label}
                        {required && <span className="required-star" aria-hidden="true">*</span>}
                    </label>
                )}
                {showCount && maxLength && (
                    <span className="char-count">
                        {currentLength}/{maxLength}
                    </span>
                )}
            </div>

            <textarea
                id={textId}
                rows={rows}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                maxLength={maxLength}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${textId}-error` : helperText ? `${textId}-helper` : undefined}
                className={`form-textarea ${error ? 'input-error' : ''}`}
            />

            {error && (
                <span id={`${textId}-error`} className="error-text" role="alert">
                    ⚠️ {error}
                </span>
            )}
            {!error && helperText && (
                <span id={`${textId}-helper`} className="helper-text">
                    {helperText}
                </span>
            )}
        </div>
    )
}

export default TextAreaField
