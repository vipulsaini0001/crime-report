import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { selectReports } from '../store/slices/reportsSlice'
import InputField from '../components/common/InputField'
import LoadingButton from '../components/common/LoadingButton'
import StatusBadge from '../components/common/StatusBadge'
import EmptyState from '../components/common/EmptyState'

export function ProfilePage() {
    const { currentUser, updateProfile } = useAuth()
    const { success, error: toastError } = useToast()
    const allReports = useSelector(selectReports)

    const [isEditing, setIsEditing] = useState(false)
    const [name, setName] = useState(currentUser?.name || '')
    const [contact, setContact] = useState(currentUser?.contact || '')
    const [errors, setErrors] = useState({})
    const [isSaving, setIsSaving] = useState(false)

    // Filter reports filed by current user
    const myReports = allReports.filter(
        (r) =>
            (r.reporterEmail && r.reporterEmail.toLowerCase() === currentUser?.email?.toLowerCase()) ||
            (r.reporterName && r.reporterName.toLowerCase() === currentUser?.name?.toLowerCase())
    )

    const validate = () => {
        const errs = {}
        if (!name.trim()) errs.name = 'Name cannot be empty'
        if (contact.trim() && !/^\d{10}$/.test(contact.trim())) {
            errs.contact = 'Contact must be a 10-digit number'
        }
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const handleSave = async (e) => {
        e.preventDefault()
        if (!validate()) return

        setIsSaving(true)
        try {
            await updateProfile({ name: name.trim(), contact: contact.trim() })
            success('Profile updated successfully!')
            setIsEditing(false)
        } catch (err) {
            toastError(err.message || 'Failed to update profile')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <main className="main-content-v2">
            <div className="profile-container">
                {/* Profile Overview Card */}
                <div className="profile-card">
                    <div className="profile-card-header">
                        <div className="profile-avatar" aria-hidden="true">
                            {currentUser?.role === 'admin' ? '👮' : '👤'}
                        </div>
                        <div>
                            <h2 className="profile-name">{currentUser?.name}</h2>
                            <p className="profile-email">{currentUser?.email}</p>
                            <span className="badge badge-role mt-1">{currentUser?.role || 'citizen'}</span>
                        </div>
                    </div>

                    {!isEditing ? (
                        <div className="profile-details-list">
                            <div className="profile-detail-row">
                                <span className="detail-key">Registered Email</span>
                                <span className="detail-val">{currentUser?.email}</span>
                            </div>
                            <div className="profile-detail-row">
                                <span className="detail-key">Contact Phone</span>
                                <span className="detail-val">{currentUser?.contact || 'Not provided'}</span>
                            </div>
                            <div className="profile-detail-row">
                                <span className="detail-key">Account Type</span>
                                <span className="detail-val text-capitalize">{currentUser?.role || 'Citizen'}</span>
                            </div>

                            <button
                                type="button"
                                className="btn btn-secondary mt-4"
                                onClick={() => setIsEditing(true)}
                            >
                                ✏️ Edit Profile Details
                            </button>
                        </div>
                    ) : (
                        <form className="profile-edit-form" onSubmit={handleSave}>
                            <InputField
                                label="Display Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                error={errors.name}
                                required
                            />
                            <InputField
                                label="10-Digit Mobile Number"
                                type="tel"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                error={errors.contact}
                            />
                            <div className="profile-form-buttons">
                                <LoadingButton
                                    isLoading={isSaving}
                                    loadingText="Saving..."
                                    variant="primary"
                                    type="submit"
                                >
                                    Save Changes
                                </LoadingButton>
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => {
                                        setName(currentUser?.name || '')
                                        setContact(currentUser?.contact || '')
                                        setErrors({})
                                        setIsEditing(false)
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* User's Submitted Reports History */}
                <div className="profile-reports-history">
                    <div className="history-header">
                        <h3>My Incident Report History ({myReports.length})</h3>
                        <Link to="/reports/new" className="btn btn-sm btn-primary">
                            + File New Incident
                        </Link>
                    </div>

                    {myReports.length === 0 ? (
                        <EmptyState
                            icon="📂"
                            title="No Incidents Filed Yet"
                            description="You haven't reported any incidents with this account yet."
                            actionLabel="File an Incident Report"
                            onAction={() => window.location.assign('/reports/new')}
                        />
                    ) : (
                        <div className="table-responsive-container">
                            <table className="reports-data-table">
                                <thead>
                                    <tr>
                                        <th>Ref ID</th>
                                        <th>Title</th>
                                        <th>Category</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myReports.map((r) => (
                                        <tr key={r.id}>
                                            <td className="table-ref-id">{r.id}</td>
                                            <td className="table-title">
                                                <Link to={`/reports/${r.id}`}>{r.title}</Link>
                                            </td>
                                            <td>
                                                <span className="badge badge-category">{r.category}</span>
                                            </td>
                                            <td>{r.date}</td>
                                            <td>
                                                <StatusBadge status={r.status} />
                                            </td>
                                            <td>
                                                <Link to={`/reports/${r.id}`} className="btn btn-xs btn-outline">
                                                    View Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}

export default ProfilePage
