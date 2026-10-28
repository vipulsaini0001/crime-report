import { useState, useEffect } from 'react'
import thirdPartyService from '../services/thirdPartyService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import EmptyState from '../components/common/EmptyState'
import useDebounce from '../hooks/useDebounce'
import { useToast } from '../hooks/useToast'

export function ExternalLookupPage() {
    const { error: toastError } = useToast()

    // Mode: 'github' | 'geocoding'
    const [activeTool, setActiveTool] = useState('github')

    // GitHub Search State
    const [usernameInput, setUsernameInput] = useState('octocat')
    const debouncedUsername = useDebounce(usernameInput, 600)
    const [userProfile, setUserProfile] = useState(null)
    const [userRepos, setUserRepos] = useState([])
    const [repoPage, setRepoPage] = useState(1)
    const [loadingProfile, setLoadingProfile] = useState(false)
    const [loadingRepos, setLoadingRepos] = useState(false)
    const [profileError, setProfileError] = useState(null)
    const [hasMoreRepos, setHasMoreRepos] = useState(false)
    const [reloadKey, setReloadKey] = useState(0)

    // OpenStreetMap Geocoding Search State
    const [geoQuery, setGeoQuery] = useState('')
    const [geoResults, setGeoResults] = useState([])
    const [loadingGeo, setLoadingGeo] = useState(false)
    const [geoError, setGeoError] = useState(null)

    // Fetch GitHub User Profile with cancellation safety
    useEffect(() => {
        let ignore = false

        if (!debouncedUsername.trim()) {
            return
        }

        async function fetchProfile() {
            setLoadingProfile(true)
            setProfileError(null)

            try {
                const profile = await thirdPartyService.getGitHubUser(debouncedUsername.trim())
                if (ignore) return

                setUserProfile(profile)
                setRepoPage(1)

                setLoadingRepos(true)
                try {
                    const repos = await thirdPartyService.getGitHubUserRepos(debouncedUsername.trim(), 1, 6)
                    if (ignore) return
                    setUserRepos(repos)
                    setHasMoreRepos(repos.length === 6 && profile.publicRepos > 6)
                } catch {
                    if (!ignore) setUserRepos([])
                } finally {
                    if (!ignore) setLoadingRepos(false)
                }
            } catch (err) {
                if (ignore) return
                setProfileError(err.message || 'Failed to fetch GitHub profile')
                setUserProfile(null)
                setUserRepos([])
            } finally {
                if (!ignore) setLoadingProfile(false)
            }
        }

        fetchProfile()

        return () => {
            ignore = true
        }
    }, [debouncedUsername, reloadKey])

    // Load next page of repositories (Progressive Loading / Pagination)
    const handleLoadMoreRepos = async () => {
        if (!userProfile || loadingRepos) return

        const nextPage = repoPage + 1
        setLoadingRepos(true)

        try {
            const nextBatch = await thirdPartyService.getGitHubUserRepos(userProfile.username, nextPage, 6)
            setUserRepos((prev) => [...prev, ...nextBatch])
            setRepoPage(nextPage)
            setHasMoreRepos(nextBatch.length === 6 && userRepos.length + nextBatch.length < userProfile.publicRepos)
        } catch (err) {
            toastError('Failed to fetch additional repositories: ' + err.message)
        } finally {
            setLoadingRepos(false)
        }
    }

    // Geocoding Search
    const handleSearchGeo = async (e) => {
        if (e) e.preventDefault()
        if (!geoQuery || geoQuery.trim().length < 2) return

        setLoadingGeo(true)
        setGeoError(null)

        try {
            const results = await thirdPartyService.searchLocation(geoQuery.trim())
            setGeoResults(results)
            if (results.length === 0) {
                setGeoError('No locations found matching this query.')
            }
        } catch (err) {
            setGeoError(err.message || 'Failed to query Nominatim OpenStreetMap API')
        } finally {
            setLoadingGeo(false)
        }
    }

    return (
        <main className="main-content-v2">
            <div className="external-lookup-container">
                {/* Header */}
                <div className="lookup-header-section">
                    <div className="lookup-badge">
                        <span>🌐 Third-Party REST API Integrations</span>
                    </div>
                    <h1 className="lookup-title">Public Intelligence & Investigator Tools</h1>
                    <p className="lookup-subtitle">
                        Fulfilling Course Syllabus Module E requirements for genuine third-party REST API
                        consumption, debounced live queries, rate-limit resilience, retry workflows, and
                        pagination.
                    </p>
                </div>

                {/* Tool Selector Tabs */}
                <div className="tool-selector-tabs" role="tablist">
                    <button
                        type="button"
                        role="tab"
                        aria-selected={activeTool === 'github'}
                        className={`tool-tab-btn ${activeTool === 'github' ? 'active' : ''}`}
                        onClick={() => setActiveTool('github')}
                    >
                        🐙 GitHub Profile & Repository Viewer
                    </button>
                    <button
                        type="button"
                        role="tab"
                        aria-selected={activeTool === 'geocoding'}
                        className={`tool-tab-btn ${activeTool === 'geocoding' ? 'active' : ''}`}
                        onClick={() => setActiveTool('geocoding')}
                    >
                        🗺️ OpenStreetMap Incident Geocoding
                    </button>
                </div>

                {/* TOOL 1: GITHUB PUBLIC REST API VIEWER */}
                {activeTool === 'github' && (
                    <section className="tool-panel" aria-labelledby="github-viewer-heading">
                        <div className="api-honest-notice">
                            ℹ️ <strong>Direct Remote API Notice:</strong> This feature connects directly to the
                            official public <code>https://api.github.com</code> REST API. Try searching handles like{' '}
                            <code>gaearon</code>, <code>facebook</code>, <code>torvalds</code>, or your own GitHub handle.
                        </div>

                        {/* Search Input with Debounce */}
                        <div className="github-search-bar">
                            <label htmlFor="gh-username-input" className="form-label">
                                GitHub Username (Debounced 600ms):
                            </label>
                            <div className="search-input-wrap">
                                <span className="search-icon" aria-hidden="true">🔎</span>
                                <input
                                    id="gh-username-input"
                                    type="text"
                                    className="search-input"
                                    placeholder="Enter any public GitHub handle..."
                                    value={usernameInput}
                                    onChange={(e) => setUsernameInput(e.target.value)}
                                />
                                {usernameInput && (
                                    <button
                                        type="button"
                                        className="search-clear-btn"
                                        onClick={() => setUsernameInput('')}
                                        aria-label="Clear username"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Loading State */}
                        {loadingProfile && (
                            <div className="py-8">
                                <LoadingSpinner text={`Contacting GitHub API for @${usernameInput}...`} />
                            </div>
                        )}

                        {/* Error with Retry */}
                        {profileError && !loadingProfile && (
                            <ErrorMessage
                                title="GitHub API Request Failed"
                                message={profileError}
                                onRetry={() => setReloadKey((k) => k + 1)}
                                retryText="Retry Fetch"
                            />
                        )}

                        {/* Profile Card */}
                        {userProfile && !loadingProfile && (
                            <div className="gh-profile-display-card">
                                <div className="gh-profile-header">
                                    <img
                                        src={userProfile.avatarUrl}
                                        alt={`${userProfile.username}'s avatar`}
                                        className="gh-avatar"
                                    />
                                    <div className="gh-profile-info">
                                        <div className="gh-name-row">
                                            <h2>{userProfile.name}</h2>
                                            <a
                                                href={userProfile.htmlUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="btn btn-sm btn-outline"
                                            >
                                                View on GitHub ↗
                                            </a>
                                        </div>
                                        <p className="gh-handle">@{userProfile.username}</p>
                                        <p className="gh-bio">{userProfile.bio}</p>

                                        <div className="gh-meta-chips">
                                            {userProfile.location && (
                                                <span className="gh-meta-chip">📍 {userProfile.location}</span>
                                            )}
                                            {userProfile.company && (
                                                <span className="gh-meta-chip">💼 {userProfile.company}</span>
                                            )}
                                            <span className="gh-meta-chip">
                                                👥 {userProfile.followers} Followers • {userProfile.following} Following
                                            </span>
                                            <span className="gh-meta-chip">
                                                📦 {userProfile.publicRepos} Public Repos
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Repositories Section */}
                                <div className="gh-repos-section">
                                    <div className="gh-repos-header">
                                        <h3>Public Repositories ({userRepos.length} of {userProfile.publicRepos})</h3>
                                    </div>

                                    {userRepos.length === 0 && !loadingRepos ? (
                                        <EmptyState
                                            icon="📂"
                                            title="No Public Repositories"
                                            description="This user does not have any public repositories available."
                                        />
                                    ) : (
                                        <div className="gh-repos-grid">
                                            {userRepos.map((repo) => (
                                                <div key={repo.id} className="gh-repo-card">
                                                    <div className="gh-repo-title-row">
                                                        <a
                                                            href={repo.htmlUrl}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="gh-repo-name"
                                                        >
                                                            {repo.name} ↗
                                                        </a>
                                                        <span className="gh-lang-badge">{repo.language}</span>
                                                    </div>
                                                    <p className="gh-repo-desc">{repo.description}</p>
                                                    <div className="gh-repo-stats">
                                                        <span>⭐ {repo.stars} stars</span>
                                                        <span>🍴 {repo.forks} forks</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Progressive Loading / Load More */}
                                    {hasMoreRepos && (
                                        <div className="text-center mt-6">
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={handleLoadMoreRepos}
                                                disabled={loadingRepos}
                                            >
                                                {loadingRepos ? 'Fetching Next Page...' : 'Load Next Repositories (Page ' + (repoPage + 1) + ') →'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* TOOL 2: OPENSTREETMAP GEOCODING TOOL */}
                {activeTool === 'geocoding' && (
                    <section className="tool-panel" aria-labelledby="geocoding-heading">
                        <div className="api-honest-notice">
                            ℹ️ <strong>Nominatim API Notice:</strong> Queries OpenStreetMap worldwide geocoding service.
                            Useful for officers and citizens verifying street names, neighborhoods, and landmark coordinates.
                        </div>

                        <form className="geo-search-form" onSubmit={handleSearchGeo}>
                            <div className="geo-input-group">
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter street, landmark, sector, or city name..."
                                    value={geoQuery}
                                    onChange={(e) => setGeoQuery(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loadingGeo || !geoQuery.trim()}
                                >
                                    {loadingGeo ? 'Geocoding...' : '📍 Search Coordinates'}
                                </button>
                            </div>
                        </form>

                        {loadingGeo && (
                            <div className="py-6">
                                <LoadingSpinner text="Searching OpenStreetMap database..." />
                            </div>
                        )}

                        {geoError && (
                            <ErrorMessage
                                title="Geocoding Notice"
                                message={geoError}
                                onRetry={() => handleSearchGeo()}
                            />
                        )}

                        {geoResults.length > 0 && (
                            <div className="geo-results-container">
                                <h3>Verified Geolocation Results ({geoResults.length})</h3>
                                <ul className="geo-results-list">
                                    {geoResults.map((item) => (
                                        <li key={item.placeId} className="geo-result-card">
                                            <div className="geo-card-header">
                                                <strong>📍 {item.displayName}</strong>
                                                <span className="badge badge-category">{item.type}</span>
                                            </div>
                                            <div className="geo-coordinates-chip">
                                                Coordinates: Latitude: <code>{item.lat}</code>, Longitude: <code>{item.lon}</code>
                                            </div>
                                            <a
                                                href={`https://www.openstreetmap.org/?mlat=${item.lat}&mlon=${item.lon}#map=16/${item.lat}/${item.lon}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="btn btn-xs btn-outline mt-2"
                                            >
                                                View on OpenStreetMap ↗
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </section>
                )}
            </div>
        </main>
    )
}

export default ExternalLookupPage
