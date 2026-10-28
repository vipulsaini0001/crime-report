import { useState, useEffect } from 'react'
import { ThemeContext } from './ThemeContextDef'

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        try {
            const saved = localStorage.getItem('theme')
            if (saved === 'dark' || saved === 'light') return saved
            return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light'
        } catch {
            return 'light'
        }
    })

    useEffect(() => {
        try {
            document.documentElement.setAttribute('data-theme', theme)
            localStorage.setItem('theme', theme)
        } catch (e) {
            console.error('Failed to persist theme:', e)
        }
    }, [theme])

    const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeProvider
