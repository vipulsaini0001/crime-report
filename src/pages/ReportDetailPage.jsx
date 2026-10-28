import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import StatusBadge from '../components/common/StatusBadge'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import ConfirmModal from '../components/common/ConfirmModal'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import {
    fetchReportByIdAsync,
    deleteReportAsync,
    updateStatusAsync,
    selectSingleReport,
} from '../store/slices/reportsSlice'

export function ReportDetailPage() {
    const { id } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const { isAdmin } = useAuth()
    const { success, error: toastError } = useToast()

    const { data: report, status, error } = useSelector(selectSingleReport)

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [userSelectedStatus, setUserSelectedStatus] = useState(null)
    const newStatus = userSelectedStatus ?? (report?.status || 'Pending')
    const [statusNote, setStatusNote] = useState('')
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

    useEffect(() => {
        if (id) {
            dispatch(fetchReportByIdAsync(id))
        }
    }, [dispatch, id])

    const handleDelete = async () => {
        if (!report) return
        setIsDeleting(true)
        try {
            await dispatch(deleteReportAsync(report.id)).unwrap()
            success(`Incident report #${report.id} deleted.`)
            navigate('/reports')
        } catch (err) {
            toastError(err || 'Failed to delete report')
        } finally {
            setIsDeleting(false)
        }
    }

    const handleUpdateStatus = async (e) => {
        e.preventDefault()
        if (!report || newStatus === report.status) return

        setIsUpdatingStatus(true)
        try {
            await dispatch(
                updateStatusAsync({
                    id: report.id,
                    status: newStatus,
                    note: statusNote || `Status updated to ${newStatus} by authority`,
                })
            ).unwrap()
            success(`Status updated to "${newStatus}" with investigation note.`)
            setStatusNote('')
        } catch (err) {
            toastError(err || 'Failed to update status')
        } finally {
            setIsUpdatingStatus(false)
        }
    }

    const handlePrint = () => {
        window.print()
    }

    if (status === 'loading') {
        return (
            <main className="main-content-v2 single-column-center">
                <LoadingSpinner text={`Retrieving incident report #${id}...`} size="large" />
            </main>
        )
    }

    if (status === 'failed' || !report) {
        return (
            <main className="main-content-v2 single-column-center">
                <div className="detail-error-wrapper">
                    <ErrorMessage
                        title="Report Not Found"
                        message={error || `No crime report found with reference ID "${id}".`}
                        onRetry={() => dispatch(fetchReportByIdAsync(id))}
                        retryText="Reload Report"
                    />
                    <div className="text-center mt-4">
                        <Link to="/reports" className="btn btn-primary">
                            ← Return to All Reports
                        </Link>
                    </div>
                </div>
            </main>
        )
    }

    const justCreated = location.state?.justCreated

    return (
        <main className="main-content-v2 single-column-center">
            {justCreated && (
                <div className="banner-success-created" role="status">
                    <span className="banner-icon" aria-hidden="true">🎉</span>
                    <div>
                        <strong>Report Created Successfully!</strong> Reference code: <code>{report.id}</code>.
                        Keep this ID handy to track investigation updates.
                    </div>
                </div>
            )}

            <div className="report-detail-card" id="printable-report">
                {/* Header Strip */}
                <div className="detail-card-header">
                    <div className="detail-badges-wrap">
                        <span className="badge badge-category">{report.category}</span>
                        <StatusBadge status={report.status} />
                        {report.severity && (
                            <span className="badge severity-badge">{report.severity} Priority</span>
                        )}
                    </div>
                    <div className="detail-ref-id">
                        Ref: <strong>#{report.id}</strong>
                    </div>
                </div>

                {/* Title */}
                <h1 className="detail-title">{report.title}</h1>

                {/* Metadata Row */}
                <div className="detail-meta-grid">
                    <div className="meta-item">
                        <span className="meta-icon" aria-hidden="true">📅</span>
                        <div>
                            <span className="meta-label">Date & Time</span>
                            <span className="meta-value">{report.date} {report.time ? `• ${report.time}` : ''}</span>
                        </div>
                    </div>

                    <div className="meta-item">
                        <span className="meta-icon" aria-hidden="true">📍</span>
                        <div>
                            <span className="meta-label">Location</span>
                            <span className="meta-value">{report.location}</span>
                        </div>
                    </div>

                    <div className="meta-item">
                        <span className="meta-icon" aria-hidden="true">👤</span>
                        <div>
                            <span className="meta-label">Reporter</span>
                            <span className="meta-value">{report.reporterName || 'Anonymous Citizen'}</span>
                        </div>
                    </div>

                    {report.reporterContact && (
                        <div className="meta-item">
                            <span className="meta-icon" aria-hidden="true">📞</span>
                            <div>
                                <span className="meta-label">Contact</span>
                                <span className="meta-value">{report.reporterContact}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Evidence Image */}
                {report.image && (
                    <div className="detail-evidence-box">
                        <h3 className="section-small-title">Attached Evidence Photograph</h3>
                        <img
                            src={report.image}
                            alt={`Evidence photograph for incident ${report.id}`}
                            className="detail-evidence-image"
                        />
                    </div>
                )}

                {/* Description */}
                <div className="detail-description-box">
                    <h3 className="section-small-title">Incident Description</h3>
                    <p className="detail-description-text">{report.description}</p>
                </div>

                {/* Timeline */}
                <div className="detail-timeline-box">
                    <h3 className="section-small-title">Investigation & Audit Timeline</h3>
                    <div className="detail-timeline-flow">
                        {report.timeline && report.timeline.length > 0 ? (
                            report.timeline.map((entry, idx) => (
                                <div key={idx} className="timeline-card">
                                    <div className="timeline-card-header">
                                        <span className="timeline-action">{entry.action}</span>
                                        <time className="timeline-time">{entry.date}</time>
                                    </div>
                                    <p className="timeline-note">{entry.note}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-muted">No timeline entries recorded yet.</p>
                        )}
                    </div>
                </div>

                {/* Authority Status Update Controls (Admin or Quick Demo Update) */}
                <div className="detail-status-update-box">
                    <h3 className="section-small-title">
                        {isAdmin ? '🛡️ Administrator Resolution Controls' : '📝 Investigation Status Workflow'}
                    </h3>
                    <p className="status-box-subtitle">
                        Transition case state and log official investigative remarks.
                    </p>
                    <form className="status-update-form" onSubmit={handleUpdateStatus}>
                        <div className="status-form-inputs">
                            <select
                                className="form-select status-change-select"
                                value={newStatus}
                                onChange={(e) => setUserSelectedStatus(e.target.value)}
                            >
                                <option value="Pending">Pending Review</option>
                                <option value="Under Review">Under Active Review</option>
                                <option value="Resolved">Case Resolved</option>
                            </select>

                            <input
                                type="text"
                                className="form-input status-note-input"
                                placeholder="Add official remark / investigation update..."
                                value={statusNote}
                                onChange={(e) => setStatusNote(e.target.value)}
                            />

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isUpdatingStatus || newStatus === report.status}
                            >
                                {isUpdatingStatus ? 'Saving...' : 'Update Status'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer Action Buttons */}
                <div className="detail-action-buttons">
                    <Link to="/reports" className="btn btn-outline">
                        ← Back to Reports
                    </Link>
                    <button type="button" className="btn btn-secondary" onClick={handlePrint}>
                        🖨️ Print / Save PDF
                    </button>
                    <Link to={`/reports/${report.id}/edit`} className="btn btn-secondary">
                        ✏️ Edit Report
                    </Link>
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => setShowDeleteModal(true)}
                    >
                        🗑️ Delete Report
                    </button>
                </div>
            </div>

            {/* Delete Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                title="Delete Crime Report"
                message={`Are you sure you want to delete incident report #${report.id} ("${report.title}")? This action cannot be reverted.`}
                confirmText="Yes, Delete"
                isDestructive
                isLoading={isDeleting}
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
        </main>
    )
}

export default ReportDetailPage
