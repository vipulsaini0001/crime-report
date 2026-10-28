export function EmptyState({
    icon = '📋',
    title = 'No Records Found',
    description = 'There are no items matching your criteria at this moment.',
    actionLabel,
    onAction,
}) {
    return (
        <div className="empty-state-box" role="status">
            <div className="empty-state-icon" aria-hidden="true">{icon}</div>
            <h3 className="empty-state-title">{title}</h3>
            <p className="empty-state-desc">{description}</p>
            {actionLabel && onAction && (
                <button type="button" className="btn btn-primary empty-state-btn" onClick={onAction}>
                    {actionLabel}
                </button>
            )}
        </div>
    )
}

export default EmptyState
