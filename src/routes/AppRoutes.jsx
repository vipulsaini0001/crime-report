import { Routes, Route } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import GuestRoute from '../components/auth/GuestRoute'

// Pages
import LandingPage from '../pages/LandingPage'
import ReportsPage from '../pages/ReportsPage'
import NewReportPage from '../pages/NewReportPage'
import ReportDetailPage from '../pages/ReportDetailPage'
import EditReportPage from '../pages/EditReportPage'
import DashboardPage from '../pages/DashboardPage'
import ExternalLookupPage from '../pages/ExternalLookupPage'
import FeedbackPage from '../pages/FeedbackPage'
import ProfilePage from '../pages/ProfilePage'
import AdminPage from '../pages/AdminPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import NotFoundPage from '../pages/NotFoundPage'

export function AppRoutes() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                {/* Root — Protected: unauthenticated users are sent to /login */}
                <Route
                    index
                    element={
                        <ProtectedRoute>
                            <LandingPage />
                        </ProtectedRoute>
                    }
                />

                {/* Protected Routes */}
                <Route
                    path="reports"
                    element={
                        <ProtectedRoute>
                            <ReportsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="reports/new"
                    element={
                        <ProtectedRoute>
                            <NewReportPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="reports/:id"
                    element={
                        <ProtectedRoute>
                            <ReportDetailPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="reports/:id/edit"
                    element={
                        <ProtectedRoute>
                            <EditReportPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="external-lookup"
                    element={
                        <ProtectedRoute>
                            <ExternalLookupPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="profile"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />

                {/* Admin-Only Route */}
                <Route
                    path="admin"
                    element={
                        <ProtectedRoute requireAdmin>
                            <AdminPage />
                        </ProtectedRoute>
                    }
                />

                {/* Public Route — always accessible */}
                <Route path="feedback" element={<FeedbackPage />} />

                {/* Guest-Only Routes — authenticated users are redirected to / */}
                <Route
                    path="login"
                    element={
                        <GuestRoute>
                            <LoginPage />
                        </GuestRoute>
                    }
                />
                <Route
                    path="register"
                    element={
                        <GuestRoute>
                            <RegisterPage />
                        </GuestRoute>
                    }
                />

                {/* 404 Catch-All */}
                <Route path="not-found" element={<NotFoundPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    )
}

export default AppRoutes
