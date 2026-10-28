import { useState } from 'react'
import InputField from '../common/InputField'
import SelectField from '../common/SelectField'
import TextAreaField from '../common/TextAreaField'
import LoadingButton from '../common/LoadingButton'
import thirdPartyService from '../../services/thirdPartyService'

const CATEGORIES = [
    { value: 'Theft', label: 'Theft / Burglary' },
    { value: 'Assault', label: 'Physical Assault' },
    { value: 'Vandalism', label: 'Vandalism / Public Damage' },
    { value: 'Fraud', label: 'Online / Financial Fraud' },
    { value: 'Other', label: 'Other Incident' },
]

const SEVERITIES = [
    { value: 'Low', label: 'Low (Non-urgent civic issue)' },
    { value: 'Medium', label: 'Medium (Standard incident)' },
    { value: 'High', label: 'High (Immediate security risk)' },
    { value: 'Critical', label: 'Critical (Severe / Life-threatening)' },
]

export function CrimeForm({
    initialData = null,
    onSubmit,
    isLoading = false,
    onCancel,
    submitButtonText = 'Submit Incident Report',
}) {
    const isEdit = Boolean(initialData)

    const [formData, setFormData] = useState(() => {
        const today = new Date().toISOString().split('T')[0]
        const nowTime = new Date().toTimeString().slice(0, 5)

        if (initialData) {
            return {
                title: initialData.title || '',
                category: initialData.category || 'Theft',
                severity: initialData.severity || 'Medium',
                location: initialData.location || '',
                description: initialData.description || '',
                date: initialData.date || today,
                time: initialData.time || nowTime,
                reporterName: initialData.reporterName || '',
                reporterContact: initialData.reporterContact || '',
                reporterEmail: initialData.reporterEmail || '',
                image: initialData.image || null,
            }
        }
        return {
            title: '',
            category: 'Theft',
            severity: 'Medium',
            location: '',
            description: '',
            date: today,
            time: nowTime,
            reporterName: '',
            reporterContact: '',
            reporterEmail: '',
            image: null,
        }
    })

    const [errors, setErrors] = useState({})
    const [touched, setTouched] = useState({})

    // Geocoding assistance state
    const [geoQuery, setGeoQuery] = useState('')
    const [geoSuggestions, setGeoSuggestions] = useState([])
    const [isSearchingLocation, setIsSearchingLocation] = useState(false)
    const [showLocationPicker, setShowLocationPicker] = useState(false)

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors((prev) => {
                const next = { ...prev }
                delete next[field]
                return next
            })
        }
    }

    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }))
        validateField(field, formData[field])
    }

    const validateField = (field, value) => {
        let error = ''
        switch (field) {
            case 'title':
                if (!value || !value.trim()) {
                    error = 'Incident title is required'
                } else if (value.trim().length < 5) {
                    error = 'Title must be at least 5 characters long'
                } else if (value.trim().length > 100) {
                    error = 'Title must not exceed 100 characters'
                }
                break

            case 'location':
                if (!value || !value.trim()) {
                    error = 'Incident location is required'
                } else if (value.trim().length < 3) {
                    error = 'Location must be at least 3 characters long'
                }
                break

            case 'description':
                if (!value || !value.trim()) {
                    error = 'Detailed description is required'
                } else if (value.trim().length < 15) {
                    error = 'Please provide at least 15 characters describing what happened'
                }
                break

            case 'reporterEmail':
                if (value && value.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    if (!emailRegex.test(value.trim())) {
                        error = 'Please enter a valid email address (e.g. name@domain.com)'
                    }
                }
                break

            case 'reporterContact':
                if (value && value.trim()) {
                    const phoneRegex = /^\d{10}$/
                    if (!phoneRegex.test(value.trim())) {
                        error = 'Contact number must be exactly 10 digits'
                    }
                }
                break

            case 'date':
                if (!value) {
                    error = 'Incident date is required'
                }
                break

            default:
                break
        }

        setErrors((prev) => {
            if (error) {
                return { ...prev, [field]: error }
            }
            const next = { ...prev }
            delete next[field]
            return next
        })

        return error
    }

    const validateAll = () => {
        const fields = ['title', 'location', 'description', 'reporterEmail', 'reporterContact', 'date']
        const newErrors = {}

        fields.forEach((field) => {
            const err = validateField(field, formData[field])
            if (err) newErrors[field] = err
        })

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            setErrors((prev) => ({ ...prev, image: 'Only image files (JPG, PNG, WebP) are accepted' }))
            return
        }

        if (file.size > 2.5 * 1024 * 1024) {
            setErrors((prev) => ({ ...prev, image: 'Image size exceeds maximum limit of 2.5MB' }))
            return
        }

        setErrors((prev) => {
            const next = { ...prev }
            delete next.image
            return next
        })

        const reader = new FileReader()
        reader.onload = () => {
            handleChange('image', reader.result)
        }
        reader.readAsDataURL(file)
    }

    const handleSearchLocation = async () => {
        if (!geoQuery || geoQuery.trim().length < 3) return
        setIsSearchingLocation(true)
        try {
            const results = await thirdPartyService.searchLocation(geoQuery)
            setGeoSuggestions(results)
        } catch {
            setGeoSuggestions([])
        } finally {
            setIsSearchingLocation(false)
        }
    }

    const handleSelectLocation = (loc) => {
        handleChange('location', loc.displayName)
        setGeoSuggestions([])
        setShowLocationPicker(false)
        setGeoQuery('')
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // Mark all as touched
        setTouched({
            title: true,
            location: true,
            description: true,
            reporterEmail: true,
            reporterContact: true,
            date: true,
        })

        const isValid = validateAll()
        if (!isValid) return

        onSubmit(formData)
    }

    return (
        <form className="crime-form-v2" onSubmit={handleSubmit} noValidate>
            <div className="form-header">
                <h2>{isEdit ? '✏️ Edit Incident Report' : '🚨 Report an Incident'}</h2>
                <p className="form-subtitle">
                    Provide accurate details to assist authorities and community members.
                </p>
            </div>

            {/* Title */}
            <InputField
                label="Incident Title"
                placeholder="e.g. Stolen bicycle near railway station"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                onBlur={() => handleBlur('title')}
                error={touched.title ? errors.title : ''}
                required
                icon="📝"
            />

            {/* Category & Severity Grid */}
            <div className="form-row-2">
                <SelectField
                    label="Incident Category"
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    options={CATEGORIES}
                    required
                />

                <SelectField
                    label="Estimated Severity"
                    value={formData.severity}
                    onChange={(e) => handleChange('severity', e.target.value)}
                    options={SEVERITIES}
                    required
                />
            </div>

            {/* Date & Time Grid */}
            <div className="form-row-2">
                <InputField
                    label="Incident Date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    onBlur={() => handleBlur('date')}
                    error={touched.date ? errors.date : ''}
                    required
                    icon="📅"
                />

                <InputField
                    label="Approximate Time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleChange('time', e.target.value)}
                    icon="⏰"
                />
            </div>

            {/* Location with OpenStreetMap Assistance */}
            <div className="location-field-wrapper">
                <InputField
                    label="Incident Location"
                    placeholder="e.g. MG Road Sector 14, Near Metro Pillar 124"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    onBlur={() => handleBlur('location')}
                    error={touched.location ? errors.location : ''}
                    required
                    icon="📍"
                    helperText="Specify landmark, street name, and city."
                />

                <div className="location-assistant-trigger">
                    <button
                        type="button"
                        className="btn-link-action"
                        onClick={() => setShowLocationPicker((prev) => !prev)}
                    >
                        🔍 {showLocationPicker ? 'Hide Address Lookup' : 'Verify address with OpenStreetMap'}
                    </button>
                </div>

                {showLocationPicker && (
                    <div className="geocoding-helper-box">
                        <div className="geocoding-search-row">
                            <input
                                type="text"
                                placeholder="Type city or landmark to lookup..."
                                value={geoQuery}
                                onChange={(e) => setGeoQuery(e.target.value)}
                                className="form-input"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        handleSearchLocation()
                                    }
                                }}
                            />
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={handleSearchLocation}
                                disabled={isSearchingLocation}
                            >
                                {isSearchingLocation ? 'Searching...' : 'Lookup'}
                            </button>
                        </div>

                        {geoSuggestions.length > 0 && (
                            <ul className="geo-suggestions-list" role="listbox">
                                {geoSuggestions.map((item) => (
                                    <li
                                        key={item.placeId}
                                        onClick={() => handleSelectLocation(item)}
                                        className="geo-suggestion-item"
                                    >
                                        📍 {item.displayName}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>

            {/* Description */}
            <TextAreaField
                label="Incident Description"
                placeholder="Describe what occurred, people involved, vehicle details, direction of travel, etc..."
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                onBlur={() => handleBlur('description')}
                error={touched.description ? errors.description : ''}
                rows={4}
                maxLength={1000}
                showCount
                required
            />

            {/* Evidence Photo Upload */}
            <div className="form-group">
                <label className="form-label">
                    Evidence Photograph (Optional)
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input-custom"
                />
                {errors.image && <span className="error-text">⚠️ {errors.image}</span>}

                {formData.image && (
                    <div className="image-preview-v2">
                        <img src={formData.image} alt="Uploaded evidence preview" />
                        <button
                            type="button"
                            className="btn btn-sm btn-danger remove-preview-btn"
                            onClick={() => handleChange('image', null)}
                        >
                            🗑️ Remove Photo
                        </button>
                    </div>
                )}
            </div>

            {/* Reporter Contact Information Section */}
            <fieldset className="form-fieldset">
                <legend className="fieldset-legend">Reporter Contact (Optional / Kept Confidential)</legend>
                <div className="form-row-2">
                    <InputField
                        label="Your Name"
                        placeholder="Leave blank to report anonymously"
                        value={formData.reporterName}
                        onChange={(e) => handleChange('reporterName', e.target.value)}
                        icon="👤"
                    />

                    <InputField
                        label="Mobile Number (10 digits)"
                        type="tel"
                        placeholder="e.g. 9876543210"
                        value={formData.reporterContact}
                        onChange={(e) => handleChange('reporterContact', e.target.value)}
                        onBlur={() => handleBlur('reporterContact')}
                        error={touched.reporterContact ? errors.reporterContact : ''}
                        icon="📞"
                    />
                </div>

                <InputField
                    label="Email Address"
                    type="email"
                    placeholder="e.g. citizen@example.com"
                    value={formData.reporterEmail}
                    onChange={(e) => handleChange('reporterEmail', e.target.value)}
                    onBlur={() => handleBlur('reporterEmail')}
                    error={touched.reporterEmail ? errors.reporterEmail : ''}
                    icon="✉️"
                />
            </fieldset>

            {/* Submit & Cancel Buttons */}
            <div className="crime-form-actions">
                <LoadingButton
                    isLoading={isLoading}
                    loadingText={isEdit ? 'Saving Changes...' : 'Submitting Report...'}
                    variant="primary"
                    type="submit"
                >
                    {isEdit ? 'Save Report Changes' : submitButtonText}
                </LoadingButton>

                {onCancel && (
                    <button
                        type="button"
                        className="btn btn-outline"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    )
}

export default CrimeForm
