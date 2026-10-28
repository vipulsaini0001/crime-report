import { useState } from 'react'
import InputField from '../components/common/InputField'
import TextAreaField from '../components/common/TextAreaField'
import SelectField from '../components/common/SelectField'
import LoadingButton from '../components/common/LoadingButton'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'

const FEEDBACK_CATEGORIES = [
    { value: 'General', label: 'General Experience' },
    { value: 'Suggestion', label: 'Platform Improvement Suggestion' },
    { value: 'Appreciation', label: 'Law Enforcement / Authority Appreciation' },
    { value: 'Issue', label: 'Reported an Issue or Bug' },
]

export function FeedbackPage() {
    const { currentUser } = useAuth()
    const { success } = useToast()

    const [name, setName] = useState(currentUser?.name || '')
    const [email, setEmail] = useState(currentUser?.email || '')
    const [category, setCategory] = useState('General')
    const [rating, setRating] = useState(5)
    const [message, setMessage] = useState('')
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [feedbackHistory, setFeedbackHistory] = useState(() => {
        try {
            const saved = localStorage.getItem('feedbackList')
            if (saved) {
                return JSON.parse(saved)
            }
            const initialFeedback = [
                {
                    id: 1,
                    name: 'Rohan Joshi',
                    category: 'Appreciation',
                    rating: 5,
                    message: 'Filing a stolen wallet report was straightforward. The local police post acknowledged it within 2 hours.',
                    date: '2026-10-23',
                },
                {
                    id: 2,
                    name: 'Meera Sen',
                    category: 'Suggestion',
                    rating: 4,
                    message: 'The map coordinates assistant makes pinning the exact streetlight vandalized very helpful.',
                    date: '2026-10-24',
                },
            ]
            localStorage.setItem('feedbackList', JSON.stringify(initialFeedback))
            return initialFeedback
        } catch {
            return []
        }
    })

    const validate = () => {
        const errs = {}
        if (!name.trim()) errs.name = 'Please provide your name'
        if (!email.trim()) {
            errs.email = 'Email address is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            errs.email = 'Please enter a valid email address'
        }
        if (!message.trim()) {
            errs.message = 'Feedback message is required'
        } else if (message.trim().length < 15) {
            errs.message = 'Please share at least 15 characters of feedback'
        }
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return

        setIsSubmitting(true)
        await new Promise((res) => setTimeout(res, 400))

        const newFeedback = {
            id: Date.now(),
            name: name.trim(),
            email: email.trim(),
            category,
            rating,
            message: message.trim(),
            date: new Date().toISOString().split('T')[0],
        }

        const updated = [newFeedback, ...feedbackHistory]
        setFeedbackHistory(updated)
        localStorage.setItem('feedbackList', JSON.stringify(updated))

        success('Thank you! Your feedback has been recorded.')
        setIsSubmitting(false)
        setSubmitted(true)
    }

    const handleReset = () => {
        setName(currentUser?.name || '')
        setEmail(currentUser?.email || '')
        setCategory('General')
        setRating(5)
        setMessage('')
        setErrors({})
        setSubmitted(false)
    }

    return (
        <main className="main-content-v2">
            <div className="feedback-layout">
                {/* Left: Feedback Form */}
                <div className="feedback-form-container">
                    {submitted ? (
                        <div className="feedback-success-card" role="status">
                            <div className="success-icon" aria-hidden="true">🎉</div>
                            <h2>Thank You for Your Feedback!</h2>
                            <p>
                                Your insights help us improve response times and refine the CrimeShield
                                incident resolution experience.
                            </p>
                            <button type="button" className="btn btn-primary mt-4" onClick={handleReset}>
                                Submit Another Response
                            </button>
                        </div>
                    ) : (
                        <form className="crime-form-v2" onSubmit={handleSubmit} noValidate>
                            <div className="form-header">
                                <h2>💬 Share Your Feedback</h2>
                                <p className="form-subtitle">
                                    Help us build a more responsive and secure crime reporting experience.
                                </p>
                            </div>

                            <InputField
                                label="Your Name"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                error={errors.name}
                                required
                                icon="👤"
                            />

                            <InputField
                                label="Email Address"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={errors.email}
                                required
                                icon="✉️"
                            />

                            <SelectField
                                label="Feedback Category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                options={FEEDBACK_CATEGORIES}
                            />

                            {/* Rating Stars */}
                            <div className="form-group">
                                <label className="form-label">Platform Rating</label>
                                <div className="rating-stars-row" role="radiogroup" aria-label="Rating out of 5 stars">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            className={`star-btn ${star <= rating ? 'filled' : ''}`}
                                            onClick={() => setRating(star)}
                                            aria-label={`${star} Star`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                    <span className="rating-text">({rating} of 5 Stars)</span>
                                </div>
                            </div>

                            <TextAreaField
                                label="Your Detailed Feedback"
                                placeholder="Tell us what worked well or what features would make reporting safer..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                error={errors.message}
                                rows={4}
                                maxLength={600}
                                showCount
                                required
                            />

                            <div className="crime-form-actions">
                                <LoadingButton
                                    isLoading={isSubmitting}
                                    loadingText="Submitting..."
                                    variant="primary"
                                    type="submit"
                                >
                                    Submit Community Feedback
                                </LoadingButton>
                            </div>
                        </form>
                    )}
                </div>

                {/* Right: Recent Community Feedback */}
                <div className="feedback-testimonials-container">
                    <h3 className="section-small-title">Recent Citizen Experiences ({feedbackHistory.length})</h3>
                    <div className="testimonials-stack">
                        {feedbackHistory.map((item) => (
                            <div key={item.id} className="testimonial-card">
                                <div className="testimonial-header">
                                    <div>
                                        <strong>{item.name}</strong>
                                        <span className="badge badge-category ml-2">{item.category}</span>
                                    </div>
                                    <div className="stars-display" aria-label={`${item.rating} stars`}>
                                        {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                                    </div>
                                </div>
                                <p className="testimonial-text">"{item.message}"</p>
                                <time className="testimonial-date">📅 {item.date}</time>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    )
}

export default FeedbackPage
