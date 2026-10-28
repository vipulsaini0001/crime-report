/**
 * Core API Client with Fetch, timeout handling, retry logic, and error normalization.
 * Fulfills syllabus Module E requirement for REST API architecture.
 */

const DEFAULT_TIMEOUT = 10000 // 10 seconds

export class ApiError extends Error {
    constructor(message, status = 500, data = null) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.data = data
    }
}

/**
 * Execute a fetch request with timeout support via AbortController.
 */
export async function request(url, options = {}) {
    const {
        timeout = DEFAULT_TIMEOUT,
        headers = {},
        retries = 0,
        retryDelay = 1000,
        signal,
        ...customConfig
    } = options

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    // Chain external signal if provided
    if (signal) {
        signal.addEventListener('abort', () => controller.abort())
    }

    const config = {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...headers,
        },
        signal: controller.signal,
        ...customConfig,
    }

    try {
        const response = await fetch(url, config)
        clearTimeout(timeoutId)

        let data = null
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
            data = await response.json()
        } else {
            data = await response.text()
        }

        if (!response.ok) {
            const errorMessage =
                (data && data.message) ||
                `HTTP error ${response.status}: ${response.statusText || 'Request failed'}`
            throw new ApiError(errorMessage, response.status, data)
        }

        return data
    } catch (err) {
        clearTimeout(timeoutId)

        // Handle retry for transient network errors (if retries configured and not user-aborted)
        if (retries > 0 && err.name !== 'AbortError') {
            await new Promise((res) => setTimeout(res, retryDelay))
            return request(url, {
                ...options,
                retries: retries - 1,
                retryDelay: retryDelay * 1.5,
            })
        }

        if (err.name === 'AbortError') {
            throw new ApiError('Request timed out or was cancelled by user', 408)
        }

        if (err instanceof ApiError) {
            throw err
        }

        throw new ApiError(err.message || 'Network request failed', 0, null)
    }
}

export const apiClient = {
    get: (url, options) => request(url, { method: 'GET', ...options }),
    post: (url, body, options) =>
        request(url, { method: 'POST', body: JSON.stringify(body), ...options }),
    put: (url, body, options) =>
        request(url, { method: 'PUT', body: JSON.stringify(body), ...options }),
    patch: (url, body, options) =>
        request(url, { method: 'PATCH', body: JSON.stringify(body), ...options }),
    delete: (url, options) => request(url, { method: 'DELETE', ...options }),
}

export default apiClient
