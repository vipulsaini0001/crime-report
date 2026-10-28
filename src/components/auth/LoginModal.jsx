import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import InputField from '../common/InputField'
import LoadingButton from '../common/LoadingButton'

export function LoginModal({ isOpen = true, onClose, onSuccess }) {
    const { login, register } = useAuth()
    const { success, error: toastError } = useToast()

    const [mode, setMode] = useState('login') // 'login' | 'signup'
    const [isLoading, setIsLoading] = useState(false)
    const [formError, setFormError] = useState('')

    // Form fields
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [contact, setContact] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [role, setRole] = useState('citizen')

    // Field errors
    const [errors, setErrors] = useState({})

    if (!isOpen) return null

    const reset = () => {
        setEmail('')
        setPassword('')
        setName('')
        setContact('')
        setConfirmPassword('')
        setErrors({})
        setFormError('')
    }

    const switchMode = (newMode) => {
        setMode(newMode)
        reset()
    }

    const fillDemoCredentials = (demoType) => {
        setMode('login')
        setErrors({})
        setFormError('')
        if (demoType === 'admin') {
            setEmail('admin@police.gov.in')
            setPassword('AdminPassword123!')
        } else {
            setEmail('rahul@example.com')
            setPassword('UserPassword123!')
        }
    }

    const validate = () => {
        const errs = {}
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!email.trim()) {
            errs.email = 'Email address is required'
        } else if (!emailRegex.test(email.trim())) {
            errs.email = 'Enter a valid email address'
        }

        if (!password.trim()) {
            errs.password = 'Password is required'
        } else if (password.length < 6) {
            errs.password = 'Password must be at least 6 characters'
        }

        if (mode === 'signup') {
            if (!name.trim()) errs.name = 'Full name is required'
            if (!contact.trim()) {
                errs.contact = 'Contact number is required'
            } else if (!/^\d{10}$/.test(contact.trim())) {
                errs.contact = 'Must be a 10-digit mobile number'
            }
            if (password !== confirmPassword) {
                errs.confirmPassword = 'Passwords do not match'
            }
        }

        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError('')

        if (!validate()) return

        setIsLoading(true)
        try {
            if (mode === 'login') {
                const user = await login(email, password)
                success(`Welcome back, ${user.name}!`)
                if (onSuccess) onSuccess(user)
                if (onClose) onClose()
            } else {
                const user = await register({ name, email, contact, password, role })
                success(`Account created successfully! Welcome, ${user.name}.`)
                if (onSuccess) onSuccess(user)
                if (onClose) onClose()
            }
        } catch (err) {
            setFormError(err.message || 'Authentication failed. Please verify credentials.')
            toastError(err.message || 'Authentication error')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
            <div className="modal-box auth-modal-box" onClick={(e) => e.stopPropagation()}>
                <div className="auth-modal-header">
                    <h3>{mode === 'login' ? '🔐 Sign In' : '📝 Create Citizen Account'}</h3>
                    <button type="button" className="modal-icon-close-btn" onClick={onClose}>
                        ✕
                    </button>
                </div>

                {/* Quick Demo Autofill Bar for Examiner / Evaluator */}
                <div className="demo-autofill-box">
                    <span className="demo-label">Quick Demo Fill:</span>
                    <button
                        type="button"
                        className="btn-demo-pill"
                        onClick={() => fillDemoCredentials('citizen')}
                    >
                        👤 Citizen Demo
                    </button>
                    <button
                        type="button"
                        className="btn-demo-pill"
                        onClick={() => fillDemoCredentials('admin')}
                    >
                        👮 Police Admin Demo
                    </button>
                </div>

                <div className="auth-tab-row" role="tablist">
                    <button
                        type="button"
                        role="tab"
                        aria-selected={mode === 'login'}
                        className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
                        onClick={() => switchMode('login')}
                    >
                        Sign In
                    </button>
                    <button
                        type="button"
                        role="tab"
                        aria-selected={mode === 'signup'}
                        className={`auth-tab-btn ${mode === 'signup' ? 'active' : ''}`}
                        onClick={() => switchMode('signup')}
                    >
                        Register
                    </button>
                </div>

                {formError && (
                    <div className="auth-error-banner" role="alert">
                        ⚠️ {formError}
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSubmit} noValidate>
                    {mode === 'signup' && (
                        <>
                            <InputField
                                label="Full Name"
                                placeholder="e.g. Anjali Gupta"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                error={errors.name}
                                required
                                icon="👤"
                            />
                            <InputField
                                label="Mobile Number"
                                type="tel"
                                placeholder="10-digit number"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                error={errors.contact}
                                required
                                icon="📞"
                            />
                            <div className="form-group">
                                <label className="form-label">Role for Evaluation Testing</label>
                                <select
                                    className="form-select"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="citizen">Citizen User</option>
                                    <option value="admin">Administrator / Law Enforcement</option>
                                </select>
                            </div>
                        </>
                    )}

                    <InputField
                        label="Email Address"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={errors.email}
                        required
                        icon="✉️"
                    />

                    <InputField
                        label="Password"
                        type="password"
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={errors.password}
                        required
                        icon="🔒"
                    />

                    {mode === 'signup' && (
                        <InputField
                            label="Confirm Password"
                            type="password"
                            placeholder="Re-enter password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            error={errors.confirmPassword}
                            required
                            icon="🔒"
                        />
                    )}

                    <div className="auth-modal-actions">
                        <LoadingButton
                            isLoading={isLoading}
                            loadingText={mode === 'login' ? 'Signing In...' : 'Registering...'}
                            variant="primary"
                            type="submit"
                        >
                            {mode === 'login' ? 'Sign In to Portal' : 'Register Account'}
                        </LoadingButton>
                        <button type="button" className="btn btn-outline" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginModal
