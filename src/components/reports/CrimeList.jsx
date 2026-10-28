import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CrimeCard from './CrimeCard'
import SkeletonLoader from '../common/SkeletonLoader'
import EmptyState from '../common/EmptyState'
import ErrorMessage from '../common/ErrorMessage'
import ConfirmModal from '../common/ConfirmModal'
import StatusBadge from '../common/StatusBadge'
import useDebounce from '../../hooks/useDebounce'
import useIntersectionObserver from '../../hooks/useIntersectionObserver'
import { useToast } from '../../hooks/useToast'
import {
    fetchReportsAsync,
    fetchMoreReportsAsync,
    deleteReportAsync,
    updateStatusAsync,
    setCategoryFilter,
    setStatusFilter,
    setSearchQuery,
    setSortBy,
    setPage,
    setLimit,
    setViewMode,
    setDisplayMode,
    resetFilters,
    toggleSimulateFailure,
    selectReports,
    selectReportsStatus,
    selectReportsError,
    selectPagination,
    selectFilters,
    selectViewMode,
    selectDisplayMode,
    selectSimulateFailure,
} from '../../store/slices/reportsSlice'

const CATEGORIES = ['All', 'Theft', 'Assault', 'Vandalism', 'Fraud', 'Other']
const STATUS_TABS = ['All', 'Pending', 'Under Review', 'Resolved']
const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'title', label: 'Title (A-Z)' },
    { value: 'category', label: 'Category' },
    { value: 'status', label: 'Status' },
]

export function CrimeList({ onViewModal }) {
    const dispatch = useDispatch()
    const { success, error: toastError } = useToast()

    const reports = useSelector(selectReports)
    const status = useSelector(selectReportsStatus)
    const error = useSelector(selectReportsError)
    const pagination = useSelector(selectPagination)
    const filters = useSelector(selectFilters)
    const viewMode = useSelector(selectViewMode)
    const displayMode = useSelector(selectDisplayMode)
    const simulateFailure = useSelector(selectSimulateFailure)

    // Local search input for debouncing
    const [localSearch, setLocalSearch] = useState(filters.search)
    const debouncedSearch = useDebounce(localSearch, 350)

    // Delete modal confirmation state
    const [reportToDelete, setReportToDelete] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)

    // Sync debounced search to Redux
    useEffect(() => {
        if (debouncedSearch !== filters.search) {
            dispatch(setSearchQuery(debouncedSearch))
        }
    }, [debouncedSearch, dispatch, filters.search])

    // Trigger fetch when filters or page change
    useEffect(() => {
        dispatch(fetchReportsAsync())
    }, [dispatch, filters.category, filters.status, filters.search, filters.sortBy, pagination.page, pagination.limit])

    // Sentinel for Infinite Scrolling
    const handleIntersect = () => {
        if (displayMode === 'infinite' && pagination.hasMore && status !== 'loading') {
            dispatch(fetchMoreReportsAsync(pagination.page + 1))
        }
    }

    const sentinelRef = useIntersectionObserver({
        onIntersect: handleIntersect,
        enabled: displayMode === 'infinite',
        isLoading: status === 'loading',
        hasMore: pagination.hasMore,
    })

    const handleConfirmDelete = async () => {
        if (!reportToDelete) return
        setIsDeleting(true)
        try {
            await dispatch(deleteReportAsync(reportToDelete.id)).unwrap()
            success(`Incident report "${reportToDelete.title}" deleted successfully.`)
            setReportToDelete(null)
        } catch (err) {
            toastError(err || 'Failed to delete report')
        } finally {
            setIsDeleting(false)
        }
    }

    const handleStatusChange = async (id, newStatus) => {
        try {
            await dispatch(updateStatusAsync({ id, status: newStatus })).unwrap()
            success(`Status updated to "${newStatus}".`)
        } catch (err) {
            toastError(err || 'Failed to update status')
        }
    }

    const handleRetry = () => {
        dispatch(fetchReportsAsync())
    }

    const isFiltered =
        filters.category !== 'All' ||
        filters.status !== 'All' ||
        filters.search.trim() !== ''

    return (
        <section className="crime-list-section" aria-labelledby="reports-list-heading">
            {/* Header and Controls */}
            <div className="crime-list-header">
                <div>
                    <h2 id="reports-list-heading" className="section-title">
                        Incident Reports Database
                    </h2>
                    <p className="section-subtitle">
                        Explore, filter, and monitor community incident reports in real time.
                    </p>
                </div>

                {/* View Mode & Display Mode Toggles */}
                <div className="list-controls-group">
                    <div className="mode-toggle-pill" role="radiogroup" aria-label="Layout view mode">
                        <button
                            type="button"
                            className={`mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => dispatch(setViewMode('grid'))}
                            title="Grid Card View"
                        >
                            🔲 Grid
                        </button>
                        <button
                            type="button"
                            className={`mode-btn ${viewMode === 'table' ? 'active' : ''}`}
                            onClick={() => dispatch(setViewMode('table'))}
                            title="Table View"
                        >
                            📑 Table
                        </button>
                    </div>

                    <div className="mode-toggle-pill" role="radiogroup" aria-label="Pagination mode">
                        <button
                            type="button"
                            className={`mode-btn ${displayMode === 'pagination' ? 'active' : ''}`}
                            onClick={() => dispatch(setDisplayMode('pagination'))}
                            title="Traditional Pagination"
                        >
                            📄 Pages
                        </button>
                        <button
                            type="button"
                            className={`mode-btn ${displayMode === 'infinite' ? 'active' : ''}`}
                            onClick={() => dispatch(setDisplayMode('infinite'))}
                            title="Infinite Scrolling"
                        >
                            ♾️ Infinite
                        </button>
                    </div>
                </div>
            </div>

            {/* Simulated Error Test Bar (for syllabus evaluation of retry behavior) */}
            <div className="evaluation-helper-bar">
                <span className="evaluation-tag">Evaluation Tool:</span>
                <button
                    type="button"
                    className={`btn btn-sm ${simulateFailure ? 'btn-danger' : 'btn-outline'}`}
                    onClick={() => dispatch(toggleSimulateFailure())}
                    title="Simulate network failure to verify error state and retry logic"
                >
                    {simulateFailure ? '⚠️ Network Error Simulation: ON (Click to Disable)' : 'Simulate Network Failure'}
                </button>
                <span className="helper-hint">
                    Toggle to test API error banner, loading states, and bounded retry behavior.
                </span>
            </div>

            {/* Search and Filters Bar */}
            <div className="filters-card">
                <div className="search-row">
                    <div className="search-input-wrap">
                        <span className="search-icon" aria-hidden="true">🔍</span>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search by title, location, category, ID, reporter..."
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                        />
                        {localSearch && (
                            <button
                                type="button"
                                className="search-clear-btn"
                                onClick={() => setLocalSearch('')}
                                aria-label="Clear search"
                            >
                                ×
                            </button>
                        )}
                    </div>

                    <div className="sort-dropdown-wrap">
                        <label htmlFor="sort-by-select" className="filter-label">Sort:</label>
                        <select
                            id="sort-by-select"
                            className="filter-select"
                            value={filters.sortBy}
                            onChange={(e) => dispatch(setSortBy(e.target.value))}
                        >
                            {SORT_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="limit-dropdown-wrap">
                        <label htmlFor="limit-select" className="filter-label">Per Page:</label>
                        <select
                            id="limit-select"
                            className="filter-select"
                            value={pagination.limit}
                            onChange={(e) => dispatch(setLimit(Number(e.target.value)))}
                        >
                            <option value={4}>4</option>
                            <option value={6}>6</option>
                            <option value={12}>12</option>
                        </select>
                    </div>
                </div>

                {/* Status Tabs (Module D: Tabs Requirement) */}
                <div className="tabs-container" role="tablist" aria-label="Report Status Tabs">
                    {STATUS_TABS.map((tab) => (
                        <button
                            key={tab}
                            role="tab"
                            aria-selected={filters.status === tab}
                            className={`tab-btn ${filters.status === tab ? 'tab-btn-active' : ''}`}
                            onClick={() => dispatch(setStatusFilter(tab))}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Category Filter Pills (Module D: Filter Requirement) */}
                <div className="categories-pill-row">
                    <span className="pills-label">Category:</span>
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            className={`category-pill ${filters.category === cat ? 'active' : ''}`}
                            onClick={() => dispatch(setCategoryFilter(cat))}
                        >
                            {cat}
                        </button>
                    ))}
                    {isFiltered && (
                        <button
                            type="button"
                            className="clear-filters-link"
                            onClick={() => {
                                setLocalSearch('')
                                dispatch(resetFilters())
                            }}
                        >
                            ✕ Reset Filters
                        </button>
                    )}
                </div>
            </div>

            {/* Results Count & Active Filter Information */}
            <div className="results-summary-row">
                <p className="results-count-text">
                    {status === 'loading'
                        ? 'Fetching reports...'
                        : `Showing ${reports.length} of ${pagination.total} Incident Reports`}
                </p>
                {displayMode === 'infinite' && (
                    <span className="infinite-mode-indicator">
                        ⚡ Infinite Scroll Active (scroll down to load more)
                    </span>
                )}
            </div>

            {/* Error State with Retry Button */}
            {status === 'failed' && (
                <ErrorMessage
                    title="Unable to Load Reports"
                    message={error || 'A problem occurred while communicating with the reports service.'}
                    onRetry={handleRetry}
                    retryText="Retry Connection"
                />
            )}

            {/* Loading Skeleton */}
            {status === 'loading' && reports.length === 0 && (
                <SkeletonLoader count={pagination.limit || 6} type="card" />
            )}

            {/* Empty State */}
            {status !== 'loading' && status !== 'failed' && reports.length === 0 && (
                <EmptyState
                    icon="📋"
                    title={isFiltered ? 'No Matching Reports' : 'No Incident Reports Yet'}
                    description={
                        isFiltered
                            ? 'No reports matched your search filters. Try adjusting your query or resetting filters.'
                            : 'Be the first to report an incident in your neighborhood.'
                    }
                    actionLabel={isFiltered ? 'Reset All Filters' : undefined}
                    onAction={isFiltered ? () => {
                        setLocalSearch('')
                        dispatch(resetFilters())
                    } : undefined}
                />
            )}

            {/* Content: Grid Card View */}
            {viewMode === 'grid' && reports.length > 0 && (
                <div className="crime-grid">
                    {reports.map((report) => (
                        <CrimeCard
                            key={report.id}
                            report={report}
                            onDeleteClick={(r) => setReportToDelete(r)}
                            onStatusChange={handleStatusChange}
                            onViewClick={onViewModal}
                        />
                    ))}
                </div>
            )}

            {/* Content: Table View */}
            {viewMode === 'table' && reports.length > 0 && (
                <div className="table-responsive-container">
                    <table className="reports-data-table">
                        <thead>
                            <tr>
                                <th>Ref ID</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Location</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((r) => (
                                <tr key={r.id}>
                                    <td className="table-ref-id">{r.id}</td>
                                    <td className="table-title">
                                        <strong>{r.title}</strong>
                                    </td>
                                    <td>
                                        <span className="badge badge-category">{r.category}</span>
                                    </td>
                                    <td className="table-location">📍 {r.location}</td>
                                    <td>{r.date}</td>
                                    <td>
                                        <StatusBadge status={r.status} />
                                    </td>
                                    <td className="table-actions-cell">
                                        <button
                                            type="button"
                                            className="btn btn-xs btn-outline"
                                            onClick={() => onViewModal && onViewModal(r)}
                                        >
                                            View
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-xs btn-danger"
                                            onClick={() => setReportToDelete(r)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Traditional Pagination Controls (Module E: Pagination) */}
            {displayMode === 'pagination' && pagination.totalPages > 1 && (
                <nav className="pagination-nav" aria-label="Reports Pagination">
                    <button
                        type="button"
                        className="pagination-btn"
                        onClick={() => dispatch(setPage(pagination.page - 1))}
                        disabled={pagination.page <= 1 || status === 'loading'}
                    >
                        ← Previous
                    </button>

                    <div className="pagination-numbers">
                        {Array.from({ length: pagination.totalPages }).map((_, i) => {
                            const pageNum = i + 1
                            return (
                                <button
                                    key={pageNum}
                                    type="button"
                                    className={`page-number-btn ${pagination.page === pageNum ? 'active' : ''}`}
                                    onClick={() => dispatch(setPage(pageNum))}
                                    disabled={status === 'loading'}
                                >
                                    {pageNum}
                                </button>
                            )
                        })}
                    </div>

                    <button
                        type="button"
                        className="pagination-btn"
                        onClick={() => dispatch(setPage(pagination.page + 1))}
                        disabled={pagination.page >= pagination.totalPages || status === 'loading'}
                    >
                        Next →
                    </button>
                </nav>
            )}

            {/* Infinite Scroll Sentinel and Indicator (Module E: Infinite Scrolling) */}
            {displayMode === 'infinite' && (
                <div ref={sentinelRef} className="infinite-scroll-sentinel">
                    {status === 'loading' && (
                        <div className="infinite-loading-indicator">
                            <span className="spinner-icon mini" aria-hidden="true" />
                            <span>Loading more incidents...</span>
                        </div>
                    )}
                    {!pagination.hasMore && reports.length > 0 && (
                        <p className="end-of-results-text">
                            ✓ You have viewed all {pagination.total} incident reports.
                        </p>
                    )}
                </div>
            )}

            {/* Delete Confirmation Modal (Module D: Modal & Accidental Deletion Protection) */}
            <ConfirmModal
                isOpen={Boolean(reportToDelete)}
                title="Confirm Report Deletion"
                message={`Are you sure you want to permanently delete incident "${reportToDelete?.title}" (ID: ${reportToDelete?.id})? This cannot be undone.`}
                confirmText="Yes, Delete Report"
                isDestructive
                isLoading={isDeleting}
                onConfirm={handleConfirmDelete}
                onCancel={() => setReportToDelete(null)}
            />
        </section>
    )
}

export default CrimeList
