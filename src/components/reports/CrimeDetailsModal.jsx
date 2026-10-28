import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import StatusBadge from '../common/StatusBadge'

export function CrimeDetailsModal({ report, onClose }) {
    useEffect(() => {
        if (!report) return

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [report, onClose])

    if (!report) return null

    const { id, title, category, location, description, date, time, status, image, severity, reporterName, timeline } = report

    return (
        <div
            className="modal-overlay"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-incident-title"
        >
            <div className="modal-box modal-details-box" onClick={(e) => e.stopPropagation()}>
                <div className="modal-details-header">
                    <div>
                        <span className="badge badge-category">{category}</span>
                        <span className="modal-ref-id">Ref #{id}</span>
                    </div>
                    <button
                        type="button"
                        className="modal-icon-close-btn"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </div>

                <h2 id="modal-incident-title" className="modal-title">
                    {title}
                </h2>

                {image && (
                    <div className="modal-image-container">
                        <img className="modal-image" src={image} alt={`Evidence for ${title}`} />
                    </div>
                )}

                <div className="modal-details-grid">
                    <div className="modal-detail-item">
                        <span className="modal-label">Status</span>
                        <div className="modal-value">
                            <StatusBadge status={status} />
                        </div>
                    </div>

                    <div className="modal-detail-item">
                        <span className="modal-label">Severity Level</span>
                        <div className="modal-value font-semibold">{severity || 'Medium'}</div>
                    </div>

                    <div className="modal-detail-item">
                        <span className="modal-label">Incident Date & Time</span>
                        <div className="modal-value">
                            📅 {date} {time ? `at ${time}` : ''}
                        </div>
                    </div>

                    <div className="modal-detail-item">
                        <span className="modal-label">Incident Location</span>
                        <div className="modal-value">📍 {location}</div>
                    </div>

                    <div className="modal-detail-item">
                        <span className="modal-label">Reported By</span>
                        <div className="modal-value">👤 {reporterName || 'Anonymous Citizen'}</div>
                    </div>
                </div>

                <div className="modal-description-section">
                    <h4 className="modal-section-title">Incident Description</h4>
                    <p className="modal-description-text">{description}</p>
                </div>

                {/* Timeline */}
                {timeline && timeline.length > 0 && (
                    <div className="modal-timeline-section">
                        <h4 className="modal-section-title">Investigation Timeline</h4>
                        <div className="timeline-flow">
                            {timeline.map((entry, idx) => (
                                <div key={idx} className="timeline-item">
                                    <div className="timeline-dot" />
                                    <div className="timeline-content">
                                        <div className="timeline-meta">
                                            <strong>{entry.action}</strong>
                                            <time>{entry.date}</time>
                                        </div>
                                        <p className="timeline-note">{entry.note}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="modal-footer-actions">
                    <Link to={`/reports/${id}`} className="btn btn-primary" onClick={onClose}>
                        Full Report Page ↗
                    </Link>
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CrimeDetailsModal
