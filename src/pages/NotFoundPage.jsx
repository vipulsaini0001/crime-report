import { Link, useLocation } from 'react-router-dom'

export function NotFoundPage() {
    const location = useLocation()

    return (
        <main className="main-content-v2 single-column-center">
            <div className="not-found-card" role="region" aria-labelledby="not-found-heading">
                <div className="not-found-code">404</div>
                <div className="not-found-icon" aria-hidden="true">🚨🔍</div>
                <h1 id="not-found-heading">Page or Incident Not Found</h1>
                <p className="not-found-text">
                    The requested route <code>{location.pathname}</code> does not exist or may have been
                    moved, archived, or resolved.
                </p>
                <div className="not-found-actions">
                    <Link to="/" className="btn btn-primary">
                        Return to Safe Landing
                    </Link>
                    <Link to="/reports" className="btn btn-secondary">
                        Browse All Incidents
                    </Link>
                    <Link to="/reports/new" className="btn btn-outline">
                        Report an Incident
                    </Link>
                </div>
            </div>
        </main>
    )
}

export default NotFoundPage
