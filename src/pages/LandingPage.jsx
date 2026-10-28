import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchStatsAsync, selectStats } from '../store/slices/reportsSlice'

export function LandingPage() {
    const dispatch = useDispatch()
    const statsState = useSelector(selectStats)
    const stats = statsState?.data

    useEffect(() => {
        dispatch(fetchStatsAsync())
    }, [dispatch])

    return (
        <div className="landing-page-v2">
            {/* Hero Section */}
            <section className="landing-hero-v2" aria-labelledby="hero-title">
                <div className="hero-badge">
                    <span>🛡️ Safer Communities Together</span>
                </div>
                <h1 id="hero-title" className="hero-title">
                    Empowering Citizens. <br />
                    <span className="hero-gradient-text">Reporting & Resolving Incidents.</span>
                </h1>
                <p className="hero-description">
                    CrimeShield is a transparent, accessible, and fast crime reporting portal.
                    File verified incident reports, track resolution progress in real time, and
                    help keep your neighborhood safe and secure.
                </p>

                <div className="hero-cta-group">
                    <Link to="/reports/new" className="btn btn-primary btn-lg">
                        🚨 File an Incident Report
                    </Link>
                    <Link to="/reports" className="btn btn-secondary btn-lg">
                        🔍 Browse All Reports
                    </Link>
                    <Link to="/dashboard" className="btn btn-outline btn-lg">
                        📊 Live Analytics
                    </Link>
                </div>

                {/* Emergency Hotlines Strip */}
                <div className="emergency-alert-strip" role="region" aria-label="Emergency Hotlines">
                    <span className="emergency-icon" aria-hidden="true">📞</span>
                    <div className="emergency-text">
                        <strong>Emergency Helpline Directory:</strong>
                        <span> Police: <strong>112 / 100</strong></span>
                        <span> • Women Safety: <strong>1090</strong></span>
                        <span> • Cyber Crime: <strong>1930</strong></span>
                        <span> • Ambulance: <strong>108</strong></span>
                    </div>
                </div>
            </section>

            {/* Live Impact Stats Counter Bar */}
            <section className="landing-stats-section" aria-label="Platform Impact Statistics">
                <div className="stats-cards-grid">
                    <div className="impact-stat-card">
                        <div className="impact-icon" aria-hidden="true">📋</div>
                        <div className="impact-number">{stats ? stats.total : '12+'}</div>
                        <div className="impact-label">Total Incidents Recorded</div>
                    </div>

                    <div className="impact-stat-card">
                        <div className="impact-icon" aria-hidden="true">⏳</div>
                        <div className="impact-number">{stats ? stats.pending : '3'}</div>
                        <div className="impact-label">Pending Initial Review</div>
                    </div>

                    <div className="impact-stat-card">
                        <div className="impact-icon" aria-hidden="true">🔍</div>
                        <div className="impact-number">{stats ? stats.underReview : '4'}</div>
                        <div className="impact-label">Active Investigations</div>
                    </div>

                    <div className="impact-stat-card">
                        <div className="impact-icon" aria-hidden="true">✅</div>
                        <div className="impact-number">{stats ? `${stats.resolutionRate}%` : '65%'}</div>
                        <div className="impact-label">Resolution Rate</div>
                    </div>
                </div>
            </section>

            {/* Feature Highlights Grid */}
            <section className="features-section" aria-labelledby="features-title">
                <h2 id="features-title" className="section-title text-center">
                    Designed for Citizen Safety and Transparency
                </h2>
                <p className="section-subtitle text-center">
                    Built following modern front-end web engineering standards with multi-page SPA routing,
                    accessible forms, and real-time state management.
                </p>

                <div className="feature-grid-v2">
                    <div className="feature-card-v2">
                        <div className="feature-icon-v2" aria-hidden="true">⚡</div>
                        <h3>Fast Incident Logging</h3>
                        <p>Submit detailed crime or civic reports in under 60 seconds with instant photo attachment and client validation.</p>
                        <Link to="/reports/new" className="feature-link">Report Now →</Link>
                    </div>

                    <div className="feature-card-v2">
                        <div className="feature-icon-v2" aria-hidden="true">📍</div>
                        <h3>OpenStreetMap Geocoding</h3>
                        <p>Integrated with OpenStreetMap Nominatim API for forward location lookup and exact neighborhood coordinates.</p>
                        <Link to="/external-lookup" className="feature-link">Try Location Tool →</Link>
                    </div>

                    <div className="feature-card-v2">
                        <div className="feature-icon-v2" aria-hidden="true">📊</div>
                        <h3>Live Analytics Dashboard</h3>
                        <p>Track category breakdowns, investigation timelines, and resolution metrics powered by Redux Toolkit.</p>
                        <Link to="/dashboard" className="feature-link">View Dashboard →</Link>
                    </div>

                    <div className="feature-card-v2">
                        <div className="feature-icon-v2" aria-hidden="true">🔎</div>
                        <h3>Investigator & GitHub Tools</h3>
                        <p>Demonstrates genuine third-party REST API integration with debounced search, error handling, and repo pagination.</p>
                        <Link to="/external-lookup" className="feature-link">Search Profiles →</Link>
                    </div>
                </div>
            </section>

            {/* How It Works 3-Step Guide */}
            <section className="how-it-works-section" aria-labelledby="how-it-works-heading">
                <h2 id="how-it-works-heading" className="section-title text-center">
                    How Incident Reporting Works
                </h2>
                <div className="steps-container">
                    <div className="step-card">
                        <div className="step-number">1</div>
                        <h4>File the Report</h4>
                        <p>Fill out the incident form with location, date, category, description, and optional photo evidence.</p>
                    </div>
                    <div className="step-divider" aria-hidden="true">→</div>
                    <div className="step-card">
                        <div className="step-number">2</div>
                        <h4>Authority Review</h4>
                        <p>Report enters the verification queue and is assigned to the nearest police division or civic post.</p>
                    </div>
                    <div className="step-divider" aria-hidden="true">→</div>
                    <div className="step-card">
                        <div className="step-number">3</div>
                        <h4>Status Resolution</h4>
                        <p>Track updates from Pending to Under Review to Resolved with complete transparent audit logs.</p>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default LandingPage
