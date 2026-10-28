/**
 * Third-Party API Service
 * Integrates:
 * 1. GitHub Public REST API (Syllabus Mini-Project: GitHub Profile Viewer / Open-Source Security Analyst Lookup)
 * 2. OpenStreetMap Nominatim Geocoding API (Location search and auto-complete assistance for crime reporting)
 *
 * Makes genuine remote REST API calls with error handling, rate limiting detection, retry support, and pagination.
 */

import { apiClient, ApiError } from './apiClient'

const GITHUB_API_BASE = 'https://api.github.com'
const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org'

export const thirdPartyService = {
    /**
     * Fetch public user profile from GitHub API.
     * @param {string} username - GitHub handle
     * @param {Object} options - request options (signal, retry, etc.)
     */
    async getGitHubUser(username, options = {}) {
        if (!username || !username.trim()) {
            throw new Error('Please enter a GitHub username')
        }

        const cleanUser = encodeURIComponent(username.trim())
        const url = `${GITHUB_API_BASE}/users/${cleanUser}`

        try {
            const data = await apiClient.get(url, {
                ...options,
                headers: {
                    Accept: 'application/vnd.github.v3+json',
                    ...options.headers,
                },
            })

            return {
                username: data.login,
                name: data.name || data.login,
                avatarUrl: data.avatar_url,
                htmlUrl: data.html_url,
                bio: data.bio || 'No public biography provided.',
                publicRepos: data.public_repos,
                followers: data.followers,
                following: data.following,
                location: data.location || 'Unknown',
                company: data.company || 'Independent',
                blog: data.blog || null,
                createdAt: data.created_at,
            }
        } catch (error) {
            if (error.status === 404) {
                throw new ApiError(`GitHub user "${username}" was not found.`, 404)
            }
            if (error.status === 403) {
                throw new ApiError(
                    'GitHub API rate limit exceeded for your IP. Please wait a minute before retrying.',
                    403
                )
            }
            throw error
        }
    },

    /**
     * Fetch public repositories of a user with pagination.
     * @param {string} username - GitHub handle
     * @param {number} page - Page number (1-based)
     * @param {number} perPage - Repos per page (default: 6)
     */
    async getGitHubUserRepos(username, page = 1, perPage = 6, options = {}) {
        if (!username || !username.trim()) return []

        const cleanUser = encodeURIComponent(username.trim())
        const url = `${GITHUB_API_BASE}/users/${cleanUser}/repos?sort=updated&per_page=${perPage}&page=${page}`

        try {
            const repos = await apiClient.get(url, {
                ...options,
                headers: {
                    Accept: 'application/vnd.github.v3+json',
                    ...options.headers,
                },
            })

            return repos.map((repo) => ({
                id: repo.id,
                name: repo.name,
                fullName: repo.full_name,
                description: repo.description || 'No description provided.',
                htmlUrl: repo.html_url,
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                language: repo.language || 'Plain text',
                updatedAt: repo.updated_at,
            }))
        } catch (error) {
            if (error.status === 404) return []
            throw error
        }
    },

    /**
     * Search location using OpenStreetMap Nominatim REST API (Forward Geocoding).
     * @param {string} query - Location search term
     */
    async searchLocation(query, options = {}) {
        if (!query || query.trim().length < 3) return []

        const url = `${NOMINATIM_BASE}/search?format=json&q=${encodeURIComponent(
            query.trim()
        )}&limit=5&addressdetails=1`

        try {
            const results = await apiClient.get(url, {
                ...options,
                headers: {
                    'Accept-Language': 'en',
                    ...options.headers,
                },
            })

            return (results || []).map((item) => ({
                placeId: item.place_id,
                displayName: item.display_name,
                lat: item.lat,
                lon: item.lon,
                type: item.type,
            }))
        } catch (err) {
            console.warn('Geocoding API unavailable or throttled:', err.message)
            return []
        }
    },
}

export default thirdPartyService
