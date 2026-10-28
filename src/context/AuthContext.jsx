import { useState, useEffect } from 'react'
import { AuthContext } from './AuthContextDef'

// Seed demo users if empty
const DEFAULT_USERS = [
    {
        id: 'admin-1',
        name: 'Officer Sharma (Admin)',
        email: 'admin@police.gov.in',
        contact: '9876543210',
        role: 'admin',
        password: 'AdminPassword123!',
    },
    {
        id: 'user-1',
        name: 'Rahul Verma (Citizen)',
        email: 'rahul@example.com',
        contact: '9123456789',
        role: 'citizen',
        password: 'UserPassword123!',
    },
]

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const saved = localStorage.getItem('currentUser')
            return saved ? JSON.parse(saved) : null
        } catch {
            return null
        }
    })

    // Initialize default accounts in authUsers if not present
    useEffect(() => {
        try {
            const saved = localStorage.getItem('authUsers')
            if (!saved) {
                localStorage.setItem('authUsers', JSON.stringify(DEFAULT_USERS))
            } else {
                const users = JSON.parse(saved)
                // Ensure admin exists for evaluation
                if (!users.some((u) => u.role === 'admin')) {
                    users.push(DEFAULT_USERS[0])
                    localStorage.setItem('authUsers', JSON.stringify(users))
                }
            }
        } catch (e) {
            console.error('Error initializing authUsers:', e)
        }
    }, [])

    const getUsers = () => {
        try {
            const saved = localStorage.getItem('authUsers')
            return saved ? JSON.parse(saved) : DEFAULT_USERS
        } catch {
            return DEFAULT_USERS
        }
    }

    const login = async (email, password) => {
        await new Promise((resolve) => setTimeout(resolve, 350))

        const users = getUsers()
        const match = users.find(
            (u) =>
                u.email.toLowerCase() === email.trim().toLowerCase() &&
                u.password === password
        )

        if (!match) {
            throw new Error('Invalid email or password. Please check your credentials.')
        }

        const safeUser = {
            id: match.id,
            name: match.name,
            email: match.email,
            contact: match.contact,
            role: match.role || 'citizen',
        }

        setCurrentUser(safeUser)
        localStorage.setItem('currentUser', JSON.stringify(safeUser))
        return safeUser
    }

    const register = async (userData) => {
        await new Promise((resolve) => setTimeout(resolve, 400))

        const users = getUsers()
        const existing = users.find(
            (u) => u.email.toLowerCase() === userData.email.trim().toLowerCase()
        )

        if (existing) {
            throw new Error('An account with this email address already exists.')
        }

        const newUser = {
            id: `usr-${Date.now()}`,
            name: userData.name.trim(),
            email: userData.email.trim(),
            contact: userData.contact.trim(),
            role: userData.role || 'citizen',
            password: userData.password,
        }

        users.unshift(newUser)
        localStorage.setItem('authUsers', JSON.stringify(users))

        const safeUser = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            contact: newUser.contact,
            role: newUser.role,
        }

        setCurrentUser(safeUser)
        localStorage.setItem('currentUser', JSON.stringify(safeUser))
        return safeUser
    }

    const logout = () => {
        setCurrentUser(null)
        localStorage.removeItem('currentUser')
    }

    const updateProfile = async (updates) => {
        await new Promise((resolve) => setTimeout(resolve, 300))

        if (!currentUser) throw new Error('No user currently logged in')

        const updatedUser = { ...currentUser, ...updates }
        setCurrentUser(updatedUser)
        localStorage.setItem('currentUser', JSON.stringify(updatedUser))

        const users = getUsers()
        const index = users.findIndex((u) => u.id === currentUser.id)
        if (index !== -1) {
            users[index] = { ...users[index], ...updates }
            localStorage.setItem('authUsers', JSON.stringify(users))
        }

        return updatedUser
    }

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                isAuthenticated: Boolean(currentUser),
                isAdmin: currentUser?.role === 'admin',
                login,
                register,
                logout,
                updateProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
