export function StatusBadge({ status = 'Pending', className = '' }) {
    const normalized = (status || 'Pending').toLowerCase().replace(/\s+/g, '-')

    const icons = {
        pending: '⏳',
        'under-review': '🔍',
        resolved: '✅',
    }

    const icon = icons[normalized] || '📌'

    return (
        <span className={`status-badge status-${normalized} ${className}`}>
            <span className="status-badge-icon" aria-hidden="true">{icon}</span>
            <span>{status || 'Pending'}</span>
        </span>
    )
}

export default StatusBadge
