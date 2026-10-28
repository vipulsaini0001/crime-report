import { Link } from 'react-router-dom'

export function Footer() {
    return (
        <footer className="footer-container" role="contentinfo">
            <div className="footer-content">
                <div className="footer-column">
                    <div className="footer-brand">
                        <span className="footer-shield" aria-hidden="true">🛡️</span>
                        <h3>CrimeShield</h3>
                    </div>
                    <p className="footer-desc">
                        CrimeShield — Smart Crime Reporting &amp; Safety Platform, built for
                        Front End Engineering II (Project Evaluation-II).
                    </p>
                    <div className="footer-disclaimer-badge">
                        ⚠️ <strong>Academic Project:</strong> For life-threatening emergencies, please dial{' '}
                        <strong>112 / 100</strong> or contact your local police station immediately.
                    </div>
                </div>

                <div className="footer-column">
                    <h4>Quick Navigation</h4>
                    <ul className="footer-links">
                        <li><Link to="/">Home Landing</Link></li>
                        <li><Link to="/reports">Browse Incidents</Link></li>
                        <li><Link to="/reports/new">Submit a Crime Report</Link></li>
                        <li><Link to="/dashboard">Analytics Dashboard</Link></li>
                        <li><Link to="/external-lookup">Investigator Lookup</Link></li>
                        <li><Link to="/feedback">Community Feedback</Link></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>Course Evaluation Features</h4>
                    <ul className="footer-feature-list">
                        <li>✅ React Router Multi-Page SPA</li>
                        <li>✅ Redux Toolkit &amp; Context API</li>
                        <li>✅ Validated Reusable Form Components</li>
                        <li>✅ Modals, Tabs, Dropdowns &amp; Toasts</li>
                        <li>✅ REST API Layer &amp; CRUD Simulation</li>
                        <li>✅ GitHub &amp; Nominatim Third-Party APIs</li>
                        <li>✅ Pagination, Infinite Scroll &amp; Debounce</li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>
                    CrimeShield &copy; {new Date().getFullYear()} | Smart Crime Reporting &amp; Safety Platform. Designed &amp; Architected for Front End Engineering-II Project Evaluation-II.
                </p>
            </div>
        </footer>
    )
}

export default Footer
