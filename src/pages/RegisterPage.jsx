import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import InputField from '../components/common/InputField'
import SelectField from '../components/common/SelectField'
import LoadingButton from '../components/common/LoadingButton'

export function RegisterPage() {
    const { register } = useAuth()
    const { success, error: toastError } = useToast()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contact: '',
        role: 'citizen',
        password: '',
        confirmPassword: '',
    })

    const [errors, setErrors] = useState({})
    const [touched, setTouched] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [registerError, setRegisterError] = useState('')

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
        let err = ''
        switch (field) {
            case 'name':
                if (!value || !value.trim()) {
                    err = 'Full name is required'
                } else if (value.trim().length < 3) {
                    err = 'Name must be at least 3 characters'
                }
                break

            case 'email':
                if (!value || !value.trim()) {
                    err = 'Email address is required'
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
                    err = 'Enter a valid email address (e.g. user@example.com)'
                }
                break

            case 'contact':
                if (!value || !value.trim()) {
                    err = 'Mobile contact is required'
                } else if (!/^\d{10}$/.test(value.trim())) {
                    err = 'Contact number must be exactly 10 digits'
                }
                break

            case 'password':
                if (!value) {
                    err = 'Password is required'
                } else if (value.length < 6) {
                    err = 'Password must be at least 6 characters long'
                } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
                    err = 'Include at least one uppercase letter and one number'
                }
                break

            case 'confirmPassword':
                if (!value) {
                    err = 'Please confirm your password'
                } else if (value !== formData.password) {
                    err = 'Passwords do not match'
                }
                break

            default:
                break
        }

        setErrors((prev) => {
            if (err) return { ...prev, [field]: err }
            const next = { ...prev }
            delete next[field]
            return next
        })

        return err
    }

    const validateAll = () => {
        const fields = ['name', 'email', 'contact', 'password', 'confirmPassword']
        const newErrors = {}

        fields.forEach((f) => {
            const err = validateField(f, formData[f])
            if (err) newErrors[f] = err
        })

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setRegisterError('')

        setTouched({
            name: true,
            email: true,
            contact: true,
            password: true,
            confirmPassword: true,
        })

        if (!validateAll()) return

        setIsLoading(true)
        try {
            const user = await register(formData)
            success(`Account created successfully! Welcome, ${user.name}.`)
            navigate('/reports')
        } catch (err) {
            setRegisterError(err.message || 'Registration failed')
            toastError(err.message || 'Registration error')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="main-content-v2 single-column-center">
            <div className="auth-card-container">
                <div className="auth-header">
                    <span className="auth-icon" aria-hidden="true">🛡️</span>
                    <h2>CrimeShield</h2>
                    <p className="auth-brand-tagline">Smart Crime Reporting &amp; Safety Platform</p>
                    <p className="auth-subtitle">
                        Create your citizen account to report incidents and track case resolutions.
                    </p>
                </div>

                {registerError && (
                    <div className="auth-error-banner" role="alert">
                        ⚠️ {registerError}
                    </div>
                )}

                <form className="auth-form-full" onSubmit={handleSubmit} noValidate>
                    <InputField
                        label="Full Name"
                        placeholder="e.g. Sneha Sharma"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        onBlur={() => handleBlur('name')}
                        error={touched.name ? errors.name : ''}
                        required
                        icon="👤"
                    />

                    <InputField
                        label="Email Address"
                        type="email"
                        placeholder="e.g. sneha@example.com"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        onBlur={() => handleBlur('email')}
                        error={touched.email ? errors.email : ''}
                        required
                        icon="✉️"
                    />

                    <InputField
                        label="10-Digit Mobile Contact"
                        type="tel"
                        placeholder="e.g. 9812345678"
                        value={formData.contact}
                        onChange={(e) => handleChange('contact', e.target.value)}
                        onBlur={() => handleBlur('contact')}
                        error={touched.contact ? errors.contact : ''}
                        required
                        icon="📞"
                    />

                    <SelectField
                        label="Account Role for Evaluation Testing"
                        value={formData.role}
                        onChange={(e) => handleChange('role', e.target.value)}
                        options={[
                            { value: 'citizen', label: 'Citizen (Standard Reporting Access)' },
                            { value: 'admin', label: 'Police Administrator (Full Queue & Moderation Access)' },
                        ]}
                    />

                    <InputField
                        label="Create Password"
                        type="password"
                        placeholder="Min 6 characters, uppercase & number"
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        onBlur={() => handleBlur('password')}
                        error={touched.password ? errors.password : ''}
                        required
                        icon="🔒"
                        helperText="Must contain at least 6 characters, including uppercase and a number."
                    />

                    <InputField
                        label="Confirm Password"
                        type="password"
                        placeholder="Re-enter password to confirm"
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                        onBlur={() => handleBlur('confirmPassword')}
                        error={touched.confirmPassword ? errors.confirmPassword : ''}
                        required
                        icon="🔒"
                    />

                    <LoadingButton
                        isLoading={isLoading}
                        loadingText="Creating Account..."
                        variant="primary"
                        type="submit"
                        className="w-full mt-2"
                    >
                        Complete Registration
                    </LoadingButton>

                    <p className="auth-switch-text">
                        Already have an account?{' '}
                        <Link to="/login" className="auth-link">
                            Sign in here →
                        </Link>
                    </p>
                </form>
            </div>
        </main>
    )
}

export default RegisterPage
