import { useEffect, useRef } from 'react'

/**
 * Custom hook for infinite scrolling using IntersectionObserver.
 * Fulfills syllabus Module E requirement.
 *
 * @param {Function} onIntersect - Callback to fire when sentinel enters viewport
 * @param {Object} options - IntersectionObserver options and flags
 * @param {boolean} options.enabled - Whether observer should be active
 * @param {boolean} options.isLoading - Whether a load operation is currently in progress
 * @param {boolean} options.hasMore - Whether more items remain to be loaded
 * @returns {React.RefObject} ref to attach to the sentinel element
 */
export function useIntersectionObserver({
    onIntersect,
    enabled = true,
    isLoading = false,
    hasMore = true,
    rootMargin = '100px',
}) {
    const sentinelRef = useRef(null)

    useEffect(() => {
        if (!enabled || isLoading || !hasMore) return

        const target = sentinelRef.current
        if (!target) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    onIntersect()
                }
            },
            {
                rootMargin,
                threshold: 0.1,
            }
        )

        observer.observe(target)

        return () => {
            if (target) {
                observer.unobserve(target)
            }
            observer.disconnect()
        }
    }, [enabled, isLoading, hasMore, onIntersect, rootMargin])

    return sentinelRef
}

export default useIntersectionObserver
