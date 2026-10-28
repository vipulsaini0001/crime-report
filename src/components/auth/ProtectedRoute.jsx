import { Navigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function ProtectedRoute({ children, requireAdmin = false }) {
    const { isAuthenticated, isAdmin, currentUser } = useAuth()
    const location = useLocation()

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    if (requireAdmin && !isAdmin) {
        return (
            <main className="main-content single-column">
                <div className="access-denied-card" role="alert">
                    <div className="access-denied-icon" aria-hidden="true">🛡️🔒</div>
                    <h2>Administrator Access Required</h2>
                    <p>
                        This section requires administrative privileges. You are currently logged in as{' '}
                        <strong>{currentUser?.name || 'Citizen'}</strong> with role{' '}
                        <span className="badge badge-role">{currentUser?.role || 'citizen'}</span>.
                    </p>
                    <div className="demo-credentials-tip">
                        <p><strong>Evaluation Note:</strong> To test the Admin Panel, you can sign in with the pre-configured Demo Admin account:</p>
                        <code>Email: admin@police.gov.in | Password: AdminPassword123!</code>
                    </div>
                    <div className="access-denied-actions">
                        <Link to="/" className="btn btn-secondary">Return Home</Link>
                        <Link to="/login" className="btn btn-primary">Switch Account</Link>
                    </div>
                </div>
            </main>
        )
    }

    return children
}

export default ProtectedRoute
