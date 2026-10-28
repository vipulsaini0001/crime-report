import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import StatusBadge from '../components/common/StatusBadge'
import LoadingSpinner from '../components/common/LoadingSpinner'
import {
    fetchReportsAsync,
    fetchStatsAsync,
    selectReports,
    selectStats,
} from '../store/slices/reportsSlice'

const CATEGORY_COLORS = {
    Theft: '#dc2626',
    Assault: '#ea580c',
    Vandalism: '#d97706',
    Fraud: '#7c3aed',
    Other: '#0891b2',
}

const STATUS_COLORS = {
    Pending: '#f59e0b',
    'Under Review': '#2563eb',
    Resolved: '#16a34a',
}

function MetricBarRow({ label, count, total, color }) {
    const pct = total === 0 ? 0 : Math.round((count / total) * 100)
    return (
        <div className="metric-bar-row">
            <div className="metric-bar-header">
                <span className="metric-label">{label}</span>
                <span className="metric-values">
                    <strong>{count}</strong> <span className="metric-pct">({pct}%)</span>
                </span>
            </div>
            <div className="metric-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                <div
                    className="metric-fill"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                />
            </div>
        </div>
    )
}

export function DashboardPage() {
    const dispatch = useDispatch()
    const reports = useSelector(selectReports)
    const statsState = useSelector(selectStats)
    const stats = statsState?.data

    const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'categories' | 'pipeline'

    useEffect(() => {
        dispatch(fetchReportsAsync())
        dispatch(fetchStatsAsync())
    }, [dispatch])

    if (!stats && statsState.status === 'loading') {
        return (
            <main className="main-content-v2 single-column-center">
                <LoadingSpinner text="Generating Analytics Intelligence..." size="large" />
            </main>
        )
    }

    const total = stats ? stats.total : reports.length
    const pending = stats ? stats.pending : reports.filter((r) => (r.status || 'Pending') === 'Pending').length
    const underReview = stats ? stats.underReview : reports.filter((r) => r.status === 'Under Review').length
    const resolved = stats ? stats.resolved : reports.filter((r) => r.status === 'Resolved').length
    const resolutionRate = stats ? stats.resolutionRate : total > 0 ? Math.round((resolved / total) * 100) : 0
    const uniqueLocations = stats ? stats.uniqueLocations : new Set(reports.map((r) => r.location)).size
    const withImages = stats ? stats.withImages : reports.filter((r) => r.image).length

    const categories = ['Theft', 'Assault', 'Vandalism', 'Fraud', 'Other']
    const categoryCounts = categories.map((cat) => ({
        label: cat,
        count: stats?.categoryCounts?.[cat] ?? reports.filter((r) => r.category === cat).length,
        color: CATEGORY_COLORS[cat],
    }))

    const statuses = ['Pending', 'Under Review', 'Resolved']
    const statusCounts = statuses.map((s) => ({
        label: s,
        count: s === 'Pending' ? pending : s === 'Under Review' ? underReview : resolved,
        color: STATUS_COLORS[s],
    }))

    const recentReports = [...reports]
        .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
        .slice(0, 5)

    return (
        <main className="main-content-v2">
            <div className="dashboard-container">
                {/* Header */}
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">📊 CrimeShield — Crime &amp; Safety Analytics</h1>
                        <p className="dashboard-subtitle">
                            Real-time intelligence on neighborhood crime trends, resolution pipeline, and coverage.
                        </p>
                    </div>
                    <Link to="/reports/new" className="btn btn-primary">
                        + Report New Incident
                    </Link>
                </div>

                {/* KPI Metric Cards Grid */}
                <div className="dashboard-metrics-grid">
                    <div className="kpi-card">
                        <div className="kpi-icon" aria-hidden="true">📋</div>
                        <div className="kpi-content">
                            <span className="kpi-label">Total Incidents</span>
                            <span className="kpi-number">{total}</span>
                        </div>
                    </div>

                    <div className="kpi-card kpi-pending">
                        <div className="kpi-icon" aria-hidden="true">⏳</div>
                        <div className="kpi-content">
                            <span className="kpi-label">Pending Review</span>
                            <span className="kpi-number">{pending}</span>
                        </div>
                    </div>

                    <div className="kpi-card kpi-review">
                        <div className="kpi-icon" aria-hidden="true">🔍</div>
                        <div className="kpi-content">
                            <span className="kpi-label">Under Investigation</span>
                            <span className="kpi-number">{underReview}</span>
                        </div>
                    </div>

                    <div className="kpi-card kpi-resolved">
                        <div className="kpi-icon" aria-hidden="true">✅</div>
                        <div className="kpi-content">
                            <span className="kpi-label">Resolution Rate</span>
                            <span className="kpi-number">{resolutionRate}%</span>
                        </div>
                    </div>

                    <div className="kpi-card">
                        <div className="kpi-icon" aria-hidden="true">📍</div>
                        <div className="kpi-content">
                            <span className="kpi-label">Covered Locations</span>
                            <span className="kpi-number">{uniqueLocations}</span>
                        </div>
                    </div>

                    <div className="kpi-card">
                        <div className="kpi-icon" aria-hidden="true">📷</div>
                        <div className="kpi-content">
                            <span className="kpi-label">With Evidence Photo</span>
                            <span className="kpi-number">{withImages}</span>
                        </div>
                    </div>
                </div>

                {/* Analytics Tabs (Module D: Tabs Requirement) */}
                <div className="dashboard-tab-bar" role="tablist">
                    <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === 'overview'}
                        className={`dash-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Combined Overview
                    </button>
                    <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === 'categories'}
                        className={`dash-tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
                        onClick={() => setActiveTab('categories')}
                    >
                        Category Breakdown
                    </button>
                    <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === 'pipeline'}
                        className={`dash-tab-btn ${activeTab === 'pipeline' ? 'active' : ''}`}
                        onClick={() => setActiveTab('pipeline')}
                    >
                        Investigation Pipeline
                    </button>
                </div>

                {/* Charts Area */}
                <div className="charts-grid-layout">
                    {(activeTab === 'overview' || activeTab === 'categories') && (
                        <div className="chart-panel-card">
                            <div className="chart-panel-header">
                                <h3>Incidents by Crime Category</h3>
                                <span className="chart-badge">Total: {total}</span>
                            </div>
                            <div className="metric-bars-stack">
                                {categoryCounts.map((cat) => (
                                    <MetricBarRow
                                        key={cat.label}
                                        label={cat.label}
                                        count={cat.count}
                                        total={total}
                                        color={cat.color}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {(activeTab === 'overview' || activeTab === 'pipeline') && (
                        <div className="chart-panel-card">
                            <div className="chart-panel-header">
                                <h3>Investigation Pipeline Status</h3>
                                <span className="chart-badge">Active: {pending + underReview}</span>
                            </div>
                            <div className="metric-bars-stack">
                                {statusCounts.map((st) => (
                                    <MetricBarRow
                                        key={st.label}
                                        label={st.label}
                                        count={st.count}
                                        total={total}
                                        color={st.color}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Recent Incidents Table */}
                <div className="dashboard-recent-card">
                    <div className="dashboard-recent-header">
                        <h3>🕒 Most Recent Community Reports</h3>
                        <Link to="/reports" className="view-all-link">
                            View All {total} Reports →
                        </Link>
                    </div>

                    {recentReports.length === 0 ? (
                        <p className="p-4 text-muted">No incidents registered in database yet.</p>
                    ) : (
                        <div className="table-responsive-container">
                            <table className="reports-data-table">
                                <thead>
                                    <tr>
                                        <th>Ref ID</th>
                                        <th>Title</th>
                                        <th>Category</th>
                                        <th>Location</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentReports.map((r) => (
                                        <tr key={r.id}>
                                            <td className="table-ref-id">{r.id}</td>
                                            <td className="table-title">
                                                <Link to={`/reports/${r.id}`}>{r.title}</Link>
                                            </td>
                                            <td>
                                                <span className="badge badge-category">{r.category}</span>
                                            </td>
                                            <td className="table-location">📍 {r.location}</td>
                                            <td>
                                                <StatusBadge status={r.status} />
                                            </td>
                                            <td>
                                                <Link to={`/reports/${r.id}`} className="btn btn-xs btn-outline">
                                                    Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}

export default DashboardPage
