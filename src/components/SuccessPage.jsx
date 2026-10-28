import { Link } from 'react-router-dom'

export function SuccessPage({ totalReports = 0, onGoToReports }) {
    return (
        <div className="feedback-success-card" role="status">
            <div className="success-icon" aria-hidden="true">✅</div>
            <h2>Incident Reported Successfully</h2>
            <p>Your incident has been received and added to the official review queue.</p>
            {totalReports > 0 && (
                <div className="my-4">
                    <strong>{totalReports}</strong> Total Reports Recorded in System
                </div>
            )}
            <div className="mt-4 flex gap-3 justify-center">
                {onGoToReports ? (
                    <button type="button" className="btn btn-primary" onClick={onGoToReports}>
                        View All Reports
                    </button>
                ) : (
                    <Link to="/reports" className="btn btn-primary">
                        View All Reports
                    </Link>
                )}
                <Link to="/" className="btn btn-secondary">
                    Return Home
                </Link>
            </div>
        </div>
    )
}

export default SuccessPage
