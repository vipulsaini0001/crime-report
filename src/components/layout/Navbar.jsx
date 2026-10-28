import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'
import { useToast } from '../../hooks/useToast'

export function Navbar() {
    const { currentUser, isAuthenticated, isAdmin, logout } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const { info } = useToast()
    const navigate = useNavigate()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [userDropdownOpen, setUserDropdownOpen] = useState(false)

    const handleLogout = () => {
        logout()
        setUserDropdownOpen(false)
        setMobileMenuOpen(false)
        info('You have logged out successfully.')
        navigate('/')
    }

    const closeMenus = () => {
        setMobileMenuOpen(false)
        setUserDropdownOpen(false)
    }

    const navLinkClass = ({ isActive }) =>
        `nav-link ${isActive ? 'nav-link-active' : ''}`

    return (
        <header className="navbar-container">
            <nav className="navbar" aria-label="Main Navigation">
                <div className="navbar-brand">
                    <Link to="/" className="brand-logo-link" onClick={closeMenus}>
                        <span className="brand-shield" aria-hidden="true">🛡️</span>
                        <div className="brand-text">
                            <span className="brand-title">CrimeShield</span>
                            <span className="brand-subtitle">Smart Crime Reporting &amp; Safety Platform</span>
                        </div>
                    </Link>
                </div>

                {/* Mobile Menu Hamburger Button */}
                <button
                    type="button"
                    className="mobile-menu-toggle"
                    aria-label="Toggle navigation menu"
                    aria-expanded={mobileMenuOpen}
                    onClick={() => setMobileMenuOpen((prev) => !prev)}
                >
                    <span className="hamburger-bar" />
                    <span className="hamburger-bar" />
                    <span className="hamburger-bar" />
                </button>

                {/* Navigation Links */}
                <div className={`navbar-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                    <NavLink to="/" end className={navLinkClass} onClick={closeMenus}>
                        Home
                    </NavLink>
                    <NavLink to="/reports" end className={navLinkClass} onClick={closeMenus}>
                        All Reports
                    </NavLink>
                    <NavLink to="/reports/new" className={navLinkClass} onClick={closeMenus}>
                        + Report Incident
                    </NavLink>
                    <NavLink to="/dashboard" className={navLinkClass} onClick={closeMenus}>
                        Dashboard
                    </NavLink>
                    <NavLink to="/external-lookup" className={navLinkClass} onClick={closeMenus}>
                        Investigator Lookup
                    </NavLink>
                    <NavLink to="/feedback" className={navLinkClass} onClick={closeMenus}>
                        Feedback
                    </NavLink>
                    {isAdmin && (
                        <NavLink to="/admin" className={navLinkClass} onClick={closeMenus}>
                            <span className="admin-nav-tag">Admin</span>
                        </NavLink>
                    )}
                </div>

                {/* Right Actions: Theme Toggle + User State */}
                <div className="navbar-actions">
                    <button
                        type="button"
                        className="theme-toggle-btn"
                        onClick={toggleTheme}
                        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        title={`Current theme: ${theme}`}
                    >
                        {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
                    </button>

                    {isAuthenticated ? (
                        <div className="user-menu-wrapper">
                            <button
                                type="button"
                                className="user-chip-btn"
                                onClick={() => setUserDropdownOpen((prev) => !prev)}
                                aria-expanded={userDropdownOpen}
                                aria-haspopup="true"
                            >
                                <span className="user-avatar-icon" aria-hidden="true">
                                    {isAdmin ? '👮' : '👤'}
                                </span>
                                <span className="user-chip-name">{currentUser.name}</span>
                                <span className="dropdown-arrow" aria-hidden="true">▾</span>
                            </button>

                            {userDropdownOpen && (
                                <div className="user-dropdown-menu" role="menu">
                                    <div className="dropdown-header">
                                        <p className="dropdown-user-name">{currentUser.name}</p>
                                        <p className="dropdown-user-email">{currentUser.email}</p>
                                        <span className="badge badge-role">{currentUser.role}</span>
                                    </div>
                                    <hr className="dropdown-divider" />
                                    <Link
                                        to="/profile"
                                        className="dropdown-item"
                                        role="menuitem"
                                        onClick={closeMenus}
                                    >
                                        👤 My Profile
                                    </Link>
                                    {isAdmin && (
                                        <Link
                                            to="/admin"
                                            className="dropdown-item"
                                            role="menuitem"
                                            onClick={closeMenus}
                                        >
                                            🛡️ Admin Center
                                        </Link>
                                    )}
                                    <button
                                        type="button"
                                        className="dropdown-item dropdown-logout-btn"
                                        role="menuitem"
                                        onClick={handleLogout}
                                    >
                                        🚪 Log Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="auth-buttons-group">
                            <Link to="/login" className="login-nav-link" onClick={closeMenus}>
                                Sign In
                            </Link>
                            <Link to="/register" className="register-nav-btn" onClick={closeMenus}>
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    )
}

export default Navbar
