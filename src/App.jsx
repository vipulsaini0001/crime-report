import { BrowserRouter } from 'react-router-dom'
import { Provider as ReduxProvider } from 'react-redux'
import store from './store/store'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import AppRoutes from './routes/AppRoutes'
import './index.css'

function App() {
    return (
        <ReduxProvider store={store}>
            <ThemeProvider>
                <AuthProvider>
                    <ToastProvider>
                        <BrowserRouter>
                            <AppRoutes />
                        </BrowserRouter>
                    </ToastProvider>
                </AuthProvider>
            </ThemeProvider>
        </ReduxProvider>
    )
}

export default App
