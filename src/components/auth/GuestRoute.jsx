import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

/**
 * GuestRoute — wraps pages that should only be visible to unauthenticated users.
 * If the user is already signed in, redirect them to the home page instead.
 */
export function GuestRoute({ children }) {
    const { isAuthenticated } = useAuth()

    if (isAuthenticated) {
        return <Navigate to="/" replace />
    }

    return children
}

export default GuestRoute
