import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import CrimeForm from '../components/reports/CrimeForm'
import { createReportAsync } from '../store/slices/reportsSlice'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'

export function NewReportPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { currentUser } = useAuth()
    const { success, error: toastError } = useToast()
    const [isLoading, setIsLoading] = useState(false)

    const initialData = currentUser
        ? {
              reporterName: currentUser.name,
              reporterEmail: currentUser.email,
              reporterContact: currentUser.contact || '',
          }
        : null

    const handleSubmit = async (formData) => {
        setIsLoading(true)
        try {
            const created = await dispatch(createReportAsync(formData)).unwrap()
            success(`Incident report #${created.id} submitted successfully!`)
            navigate(`/reports/${created.id}`, { state: { justCreated: true } })
        } catch (err) {
            toastError(err || 'Failed to submit report. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="main-content-v2 single-column-center">
            <div className="form-card-container">
                <CrimeForm
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    onCancel={() => navigate('/reports')}
                    submitButtonText="🚨 File Incident Report"
                />
            </div>
        </main>
    )
}

export default NewReportPage
