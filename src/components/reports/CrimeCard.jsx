import { Link } from 'react-router-dom'
import StatusBadge from '../common/StatusBadge'

export function CrimeCard({ report, onDeleteClick, onStatusChange, onViewClick }) {
    const { id, title, category, location, description, date, time, status, image, severity } = report

    const severityBadges = {
        Low: 'severity-low',
        Medium: 'severity-medium',
        High: 'severity-high',
        Critical: 'severity-critical',
    }

    return (
        <article className="crime-card" aria-labelledby={`card-title-${id}`}>
            {image && (
                <div className="crime-card-image-wrap">
                    <img
                        className="crime-card-image"
                        src={image}
                        alt={`Evidence for incident ${id}: ${title}`}
                        loading="lazy"
                    />
                </div>
            )}

            <div className="crime-card-header">
                <div className="card-tags">
                    <span className="badge badge-category">{category}</span>
                    {severity && (
                        <span className={`badge ${severityBadges[severity] || ''}`}>
                            {severity}
                        </span>
                    )}
                </div>
                <time className="date" dateTime={date}>
                    📅 {date} {time ? `• ${time}` : ''}
                </time>
            </div>

            <h3 id={`card-title-${id}`} className="crime-card-title">
                {title}
            </h3>

            <p className="location">
                <span className="location-pin" aria-hidden="true">📍</span> {location}
            </p>

            <p className="description">
                {description.length > 130 ? `${description.slice(0, 130)}...` : description}
            </p>

            <div className="status-row">
                <StatusBadge status={status} />

                {onStatusChange && (
                    <div className="status-change-control">
                        <label htmlFor={`status-select-${id}`} className="visually-hidden">
                            Change status for report {id}
                        </label>
                        <select
                            id={`status-select-${id}`}
                            className="status-select"
                            value={status || 'Pending'}
                            onChange={(e) => onStatusChange(id, e.target.value)}
                            title="Quickly change investigation status"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Resolved">Resolved</option>
                        </select>
                    </div>
                )}
            </div>

            <div className="card-buttons">
                {onViewClick ? (
                    <button
                        type="button"
                        className="btn btn-sm btn-outline"
                        onClick={() => onViewClick(report)}
                    >
                        Quick View
                    </button>
                ) : (
                    <Link to={`/reports/${id}`} className="btn btn-sm btn-outline">
                        Details
                    </Link>
                )}

                <Link to={`/reports/${id}/edit`} className="btn btn-sm btn-secondary">
                    Edit
                </Link>

                <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => onDeleteClick(report)}
                    aria-label={`Delete report ${title}`}
                >
                    Delete
                </button>
            </div>
        </article>
    )
}

export default CrimeCard
