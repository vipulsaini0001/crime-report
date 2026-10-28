/**
 * Reusable accessible InputField component.
 * Fulfills syllabus Module C requirement.
 */
export function InputField({
    id,
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    error,
    helperText,
    required = false,
    disabled = false,
    autoComplete,
    icon,
    className = '',
    min,
    max,
    step,
}) {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined)

    return (
        <div className={`form-group ${className}`}>
            {label && (
                <label htmlFor={inputId} className="form-label">
                    {label}
                    {required && <span className="required-star" aria-hidden="true">*</span>}
                </label>
            )}

            <div className="input-wrapper">
                {icon && <span className="input-icon" aria-hidden="true">{icon}</span>}
                <input
                    id={inputId}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    autoComplete={autoComplete}
                    min={min}
                    max={max}
                    step={step}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
                    className={`form-input ${icon ? 'has-icon' : ''} ${error ? 'input-error' : ''}`}
                />
            </div>

            {error && (
                <span id={`${inputId}-error`} className="error-text" role="alert">
                    ⚠️ {error}
                </span>
            )}
            {!error && helperText && (
                <span id={`${inputId}-helper`} className="helper-text">
                    {helperText}
                </span>
            )}
        </div>
    )
}

export default InputField
