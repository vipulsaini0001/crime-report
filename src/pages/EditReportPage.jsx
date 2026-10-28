import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import CrimeForm from '../components/reports/CrimeForm'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import { useToast } from '../hooks/useToast'
import {
    fetchReportByIdAsync,
    updateReportAsync,
    selectSingleReport,
} from '../store/slices/reportsSlice'

export function EditReportPage() {
    const { id } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { success, error: toastError } = useToast()

    const { data: report, status, error } = useSelector(selectSingleReport)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        if (id) {
            dispatch(fetchReportByIdAsync(id))
        }
    }, [dispatch, id])

    const handleSubmit = async (formData) => {
        setIsSaving(true)
        try {
            await dispatch(
                updateReportAsync({
                    id,
                    updates: formData,
                })
            ).unwrap()

            success(`Incident report #${id} updated successfully!`)
            navigate(`/reports/${id}`)
        } catch (err) {
            toastError(err || 'Failed to update report')
        } finally {
            setIsSaving(false)
        }
    }

    if (status === 'loading') {
        return (
            <main className="main-content-v2 single-column-center">
                <LoadingSpinner text={`Loading report #${id} for editing...`} />
            </main>
        )
    }

    if (status === 'failed' || !report) {
        return (
            <main className="main-content-v2 single-column-center">
                <div className="detail-error-wrapper">
                    <ErrorMessage
                        title="Unable to Load Report"
                        message={error || `Report #${id} could not be retrieved.`}
                        onRetry={() => dispatch(fetchReportByIdAsync(id))}
                    />
                    <div className="text-center mt-4">
                        <Link to="/reports" className="btn btn-primary">
                            ← Return to Reports
                        </Link>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="main-content-v2 single-column-center">
            <div className="form-card-container">
                <CrimeForm
                    initialData={report}
                    onSubmit={handleSubmit}
                    isLoading={isSaving}
                    onCancel={() => navigate(`/reports/${id}`)}
                    submitButtonText="Save Updated Report"
                />
            </div>
        </main>
    )
}

export default EditReportPage
