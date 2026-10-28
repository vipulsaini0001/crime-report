import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import ToastContainer from '../common/ToastContainer'

export function MainLayout() {
    return (
        <div className="app-layout">
            <Navbar />
            <div className="app-main-viewport">
                <Outlet />
            </div>
            <Footer />
            <ToastContainer />
        </div>
    )
}

export default MainLayout
