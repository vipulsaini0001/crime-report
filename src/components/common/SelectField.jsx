/**
 * Reusable accessible SelectField component.
 * Fulfills syllabus Module C requirement.
 */
export function SelectField({
    id,
    label,
    value,
    onChange,
    options = [],
    error,
    helperText,
    required = false,
    disabled = false,
    placeholder,
    className = '',
}) {
    const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined)

    return (
        <div className={`form-group ${className}`}>
            {label && (
                <label htmlFor={selectId} className="form-label">
                    {label}
                    {required && <span className="required-star" aria-hidden="true">*</span>}
                </label>
            )}

            <select
                id={selectId}
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
                className={`form-select ${error ? 'input-error' : ''}`}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((opt) => {
                    const optValue = typeof opt === 'object' ? opt.value : opt
                    const optLabel = typeof opt === 'object' ? opt.label : opt
                    return (
                        <option key={optValue} value={optValue}>
                            {optLabel}
                        </option>
                    )
                })}
            </select>

            {error && (
                <span id={`${selectId}-error`} className="error-text" role="alert">
                    ⚠️ {error}
                </span>
            )}
            {!error && helperText && (
                <span id={`${selectId}-helper`} className="helper-text">
                    {helperText}
                </span>
            )}
        </div>
    )
}

export default SelectField
