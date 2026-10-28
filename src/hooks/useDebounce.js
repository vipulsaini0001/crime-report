import { useState, useEffect } from 'react'

/**
 * Custom hook to debounce any rapidly changing value (e.g. search input).
 * Fulfills syllabus Module E requirement for debouncing API / filter requests.
 *
 * @param {*} value - The input value to debounce
 * @param {number} delay - Delay in milliseconds (default: 350ms)
 * @returns {*} debouncedValue
 */
export function useDebounce(value, delay = 350) {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}

export default useDebounce
