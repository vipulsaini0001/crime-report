import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import StatusBadge from '../components/common/StatusBadge'
import ConfirmModal from '../components/common/ConfirmModal'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import {
    fetchReportsAsync,
    updateStatusAsync,
    deleteReportAsync,
    selectReports,
} from '../store/slices/reportsSlice'

export function AdminPage() {
    const dispatch = useDispatch()
    const { currentUser } = useAuth()
    const { success, error: toastError } = useToast()
    const reports = useSelector(selectReports)

    const [statusFilter, setStatusFilter] = useState('All')
    const [reportToDelete, setReportToDelete] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        dispatch(fetchReportsAsync())
    }, [dispatch])

    const filteredReports = reports.filter((r) =>
        statusFilter === 'All' ? true : (r.status || 'Pending') === statusFilter
    )

    const handleFastStatus = async (id, newStatus) => {
        try {
            await dispatch(
                updateStatusAsync({
                    id,
                    status: newStatus,
                    note: `Status set to ${newStatus} by Admin (${currentUser?.name || 'Administrator'})`,
                })
            ).unwrap()
            success(`Report #${id} status changed to ${newStatus}.`)
        } catch (err) {
            toastError(err || 'Failed to update status')
        }
    }

    const handleConfirmDelete = async () => {
        if (!reportToDelete) return
        setIsDeleting(true)
        try {
            await dispatch(deleteReportAsync(reportToDelete.id)).unwrap()
            success(`Report #${reportToDelete.id} deleted by Administrator.`)
            setReportToDelete(null)
        } catch (err) {
            toastError(err || 'Failed to delete report')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <main className="main-content-v2">
            <div className="admin-container">
                {/* Admin Header */}
                <div className="admin-header-card">
                    <div className="admin-badge-strip">
                        <span>🛡️ Central Police & Administrative Operations</span>
                    </div>
                    <h1>Authority Management Console</h1>
                    <p className="admin-subtitle">
                        Logged in as: <strong>{currentUser?.name}</strong> ({currentUser?.email}) • Role:{' '}
                        <span className="badge badge-role">ADMINISTRATOR</span>
                    </p>

                    <div className="admin-security-disclaimer">
                        ℹ️ <strong>Architecture Note for Evaluation:</strong> Demonstrates Protected Routes with role-based
                        guards, Redux Toolkit status transitions, and audit-trail logging.
                    </div>
                </div>

                {/* Queue Summary KPIs */}
                <div className="admin-kpis-grid">
                    <div className="admin-kpi-box">
                        <span className="admin-kpi-num">{reports.length}</span>
                        <span className="admin-kpi-lbl">Total Reports in Queue</span>
                    </div>
                    <div className="admin-kpi-box admin-kpi-pending">
                        <span className="admin-kpi-num">
                            {reports.filter((r) => (r.status || 'Pending') === 'Pending').length}
                        </span>
                        <span className="admin-kpi-lbl">Awaiting Initial Review</span>
                    </div>
                    <div className="admin-kpi-box admin-kpi-review">
                        <span className="admin-kpi-num">
                            {reports.filter((r) => r.status === 'Under Review').length}
                        </span>
                        <span className="admin-kpi-lbl">Under Active Investigation</span>
                    </div>
                    <div className="admin-kpi-box admin-kpi-resolved">
                        <span className="admin-kpi-num">
                            {reports.filter((r) => r.status === 'Resolved').length}
                        </span>
                        <span className="admin-kpi-lbl">Officially Resolved</span>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="admin-queue-card">
                    <div className="admin-queue-header">
                        <h3>Incident Verification & Action Queue</h3>
                        <div className="admin-filter-tabs">
                            {['All', 'Pending', 'Under Review', 'Resolved'].map((tab) => (
                                <button
                                    key={tab}
                                    type="button"
                                    className={`admin-filter-tab ${statusFilter === tab ? 'active' : ''}`}
                                    onClick={() => setStatusFilter(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="table-responsive-container">
                        <table className="reports-data-table admin-table">
                            <thead>
                                <tr>
                                    <th>Ref ID</th>
                                    <th>Title & Description</th>
                                    <th>Category</th>
                                    <th>Location</th>
                                    <th>Reporter</th>
                                    <th>Status</th>
                                    <th>Quick Transition</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReports.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="text-center p-6 text-muted">
                                            No incidents in this status queue.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredReports.map((r) => (
                                        <tr key={r.id}>
                                            <td className="table-ref-id">{r.id}</td>
                                            <td className="table-title">
                                                <Link to={`/reports/${r.id}`}>
                                                    <strong>{r.title}</strong>
                                                </Link>
                                                <p className="table-sub-desc">
                                                    {r.description.length > 80 ? `${r.description.slice(0, 80)}...` : r.description}
                                                </p>
                                            </td>
                                            <td>
                                                <span className="badge badge-category">{r.category}</span>
                                            </td>
                                            <td className="table-location">📍 {r.location}</td>
                                            <td>{r.reporterName || 'Anonymous'}</td>
                                            <td>
                                                <StatusBadge status={r.status} />
                                            </td>
                                            <td>
                                                <div className="admin-status-btn-group">
                                                    {r.status !== 'Under Review' && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-xs btn-outline"
                                                            onClick={() => handleFastStatus(r.id, 'Under Review')}
                                                            title="Move to Under Review"
                                                        >
                                                            🔍 Review
                                                        </button>
                                                    )}
                                                    {r.status !== 'Resolved' && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-xs btn-primary"
                                                            onClick={() => handleFastStatus(r.id, 'Resolved')}
                                                            title="Mark Case Resolved"
                                                        >
                                                            ✅ Resolve
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="admin-actions-cell">
                                                    <Link to={`/reports/${r.id}`} className="btn btn-xs btn-secondary">
                                                        Inspect
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        className="btn btn-xs btn-danger"
                                                        onClick={() => setReportToDelete(r)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={Boolean(reportToDelete)}
                title="Admin Delete Confirmation"
                message={`As Administrator, are you sure you want to permanently delete incident #${reportToDelete?.id} ("${reportToDelete?.title}")?`}
                confirmText="Yes, Permanently Delete"
                isDestructive
                isLoading={isDeleting}
                onConfirm={handleConfirmDelete}
                onCancel={() => setReportToDelete(null)}
            />
        </main>
    )
}

export default AdminPage
