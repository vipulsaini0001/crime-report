export function SkeletonCard() {
    return (
        <div className="skeleton-card" aria-hidden="true">
            <div className="skeleton-line skeleton-header" />
            <div className="skeleton-line skeleton-title" />
            <div className="skeleton-line skeleton-sub" />
            <div className="skeleton-line skeleton-text" />
            <div className="skeleton-line skeleton-text short" />
            <div className="skeleton-actions">
                <div className="skeleton-btn" />
                <div className="skeleton-btn" />
            </div>
        </div>
    )
}

export function SkeletonLoader({ count = 3, type = 'card' }) {
    return (
        <div className={`skeleton-container skeleton-${type}`} aria-label="Loading content" role="status">
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonCard key={index} />
            ))}
        </div>
    )
}

export default SkeletonLoader
