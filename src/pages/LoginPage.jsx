import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import InputField from '../components/common/InputField'
import LoadingButton from '../components/common/LoadingButton'

export function LoginPage() {
    const { login } = useAuth()
    const { success, error: toastError } = useToast()
    const navigate = useNavigate()
    const location = useLocation()

    const from = location.state?.from?.pathname || '/'

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [authError, setAuthError] = useState('')

    const fillDemo = (role) => {
        setErrors({})
        setAuthError('')
        if (role === 'admin') {
            setEmail('admin@police.gov.in')
            setPassword('AdminPassword123!')
        } else {
            setEmail('rahul@example.com')
            setPassword('UserPassword123!')
        }
    }

    const validate = () => {
        const errs = {}
        if (!email.trim()) {
            errs.email = 'Email address is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            errs.email = 'Enter a valid email address'
        }
        if (!password.trim()) {
            errs.password = 'Password is required'
        }
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setAuthError('')
        if (!validate()) return

        setIsLoading(true)
        try {
            const user = await login(email, password)
            success(`Welcome back, ${user.name}!`)
            navigate(from, { replace: true })
        } catch (err) {
            setAuthError(err.message || 'Invalid credentials')
            toastError(err.message || 'Login failed')
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
                        Your voice matters. Help build safer communities.
                    </p>
                </div>

                {/* Quick Demo Credentials Autofill */}
                <div className="demo-autofill-box">
                    <span className="demo-label">Evaluation Demo One-Click:</span>
                    <button type="button" className="btn-demo-pill" onClick={() => fillDemo('citizen')}>
                        👤 Demo Citizen
                    </button>
                    <button type="button" className="btn-demo-pill" onClick={() => fillDemo('admin')}>
                        👮 Demo Admin Officer
                    </button>
                </div>

                {authError && (
                    <div className="auth-error-banner" role="alert">
                        ⚠️ {authError}
                    </div>
                )}

                <form className="auth-form-full" onSubmit={handleSubmit} noValidate>
                    <InputField
                        label="Email Address"
                        type="email"
                        placeholder="e.g. rahul@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={errors.email}
                        required
                        icon="✉️"
                    />

                    {/* Password field with visibility toggle */}
                    <div className={`form-group ${errors.password ? '' : ''}`}>
                        <label htmlFor="input-password" className="form-label">
                            Password
                            <span className="required-star" aria-hidden="true">*</span>
                        </label>
                        <div className="input-wrapper password-wrapper">
                            <span className="input-icon" aria-hidden="true">🔒</span>
                            <input
                                id="input-password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                required
                                autoComplete="current-password"
                                aria-invalid={Boolean(errors.password)}
                                aria-describedby={errors.password ? 'input-password-error' : undefined}
                                className={`form-input has-icon has-suffix ${errors.password ? 'input-error' : ''}`}
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowPassword((prev) => !prev)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                tabIndex={0}
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                        {errors.password && (
                            <span id="input-password-error" className="error-text" role="alert">
                                ⚠️ {errors.password}
                            </span>
                        )}
                    </div>

                    <LoadingButton
                        isLoading={isLoading}
                        loadingText="Authenticating..."
                        variant="primary"
                        type="submit"
                        className="w-full mt-2"
                    >
                        Sign In
                    </LoadingButton>

                    <p className="auth-switch-text">
                        Don't have an account?{' '}
                        <Link to="/register" className="auth-link">
                            Register as a new Citizen here →
                        </Link>
                    </p>
                </form>
            </div>
        </main>
    )
}

export default LoginPage
