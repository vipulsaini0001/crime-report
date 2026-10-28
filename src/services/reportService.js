/**
 * Crime Reports Service Layer
 * Demonstrates CRUD REST architecture with honest local persistence and realistic network simulation.
 * Fulfills syllabus Module E CRUD, loading, error handling, pagination, and retry requirements.
 */

const STORAGE_KEY = 'crimeReports'

// Comprehensive realistic seed data for college evaluation demonstration
const SEED_REPORTS = [
    {
        id: 'CR-1001',
        title: 'Two-wheeler stolen outside metro station',
        category: 'Theft',
        location: 'Rajiv Chowk Metro Gate 2, New Delhi',
        description: 'Black Honda Activa (DL-4S-AB-1234) parked near the designated cycle stand was found missing between 4 PM and 7 PM. CCTV footage request submitted.',
        status: 'Under Review',
        severity: 'Medium',
        date: '2026-10-20',
        time: '18:30',
        reporterName: 'Amit Sharma',
        reporterContact: '9811223344',
        reporterEmail: 'amit.s@example.com',
        image: null,
        timeline: [
            { date: '2026-10-20 18:45', action: 'Report Filed', note: 'Initial citizen complaint received.' },
            { date: '2026-10-21 10:15', action: 'Under Review', note: 'Assigned to Sector 18 Police Post for CCTV verification.' },
        ],
    },
    {
        id: 'CR-1002',
        title: 'Credit card OTP phishing incident',
        category: 'Fraud',
        location: 'Cyber City Sector 24, Gurugram',
        description: 'Victim received a call claiming to be bank KYC support. A fake link was sent and ₹45,000 was debited in three transactions within 5 minutes.',
        status: 'Resolved',
        severity: 'High',
        date: '2026-10-21',
        time: '14:15',
        reporterName: 'Priya Narang',
        reporterContact: '9822334455',
        reporterEmail: 'priya.n@example.com',
        image: null,
        timeline: [
            { date: '2026-10-21 14:30', action: 'Report Filed', note: 'Cyber fraud reported.' },
            { date: '2026-10-21 16:00', action: 'Under Review', note: 'Transaction freeze request initiated with merchant gateway.' },
            { date: '2026-10-23 11:30', action: 'Resolved', note: 'Disputed amount refunded by payment gateway. Ticket closed.' },
        ],
    },
    {
        id: 'CR-1003',
        title: 'Graffiti and broken streetlights near community park',
        category: 'Vandalism',
        location: 'Central Park Avenue, Block C, Noida',
        description: 'Public benches vandalized and solar streetlight covers smashed with blunt objects. Area becomes dark and unsafe after 8 PM.',
        status: 'Pending',
        severity: 'Low',
        date: '2026-10-22',
        time: '21:00',
        reporterName: 'Vikram Sethi',
        reporterContact: '9833445566',
        reporterEmail: 'vikram.sethi@example.com',
        image: null,
        timeline: [
            { date: '2026-10-22 21:15', action: 'Report Filed', note: 'Civic report forwarded to municipal maintenance division.' },
        ],
    },
    {
        id: 'CR-1004',
        title: 'Physical altercation outside restaurant',
        category: 'Assault',
        location: 'MG Road Brigade Market, Bengaluru',
        description: 'Group of three youths started an unprovoked argument with a delivery rider and physically assaulted him before patrons intervened.',
        status: 'Under Review',
        severity: 'High',
        date: '2026-10-23',
        time: '22:40',
        reporterName: 'Deepak Reddy',
        reporterContact: '9844556677',
        reporterEmail: 'deepak.r@example.com',
        image: null,
        timeline: [
            { date: '2026-10-23 23:00', action: 'Report Filed', note: 'Police patrol car dispatched to scene.' },
            { date: '2026-10-24 09:30', action: 'Under Review', note: 'Victim statement recorded, medical examination completed.' },
        ],
    },
    {
        id: 'CR-1005',
        title: 'Stolen smartphone snatched on pedestrian walkway',
        category: 'Theft',
        location: 'Koramangala 5th Block, 80 Feet Road, Bengaluru',
        description: 'Two riders on a black motorbike without number plates snatched a Samsung S23 Ultra while the victim was walking on the sidewalk.',
        status: 'Pending',
        severity: 'Medium',
        date: '2026-10-24',
        time: '19:10',
        reporterName: 'Ananya Roy',
        reporterContact: '9855667788',
        reporterEmail: 'ananya.roy@example.com',
        image: null,
        timeline: [
            { date: '2026-10-24 19:30', action: 'Report Filed', note: 'IMEI number flagged on CEIR portal.' },
        ],
    },
    {
        id: 'CR-1006',
        title: 'Unauthorized demolition of private boundary wall',
        category: 'Vandalism',
        location: 'Banjara Hills Road No. 12, Hyderabad',
        description: 'Heavy machinery used during early morning hours to damage a boundary wall on disputed plot. Formal trespass complaint.',
        status: 'Under Review',
        severity: 'Medium',
        date: '2026-10-24',
        time: '05:30',
        reporterName: 'Suresh Rao',
        reporterContact: '9866778899',
        reporterEmail: 'suresh.rao@example.com',
        image: null,
        timeline: [
            { date: '2026-10-24 07:00', action: 'Report Filed', note: 'Notice issued to stop work.' },
        ],
    },
    {
        id: 'CR-1007',
        title: 'Job consultancy recruitment scam',
        category: 'Fraud',
        location: 'Salt Lake Sector V, Kolkata',
        description: 'Candidate was promised overseas software role and charged ₹30,000 for verification fees. Agency office locked and phones switched off.',
        status: 'Resolved',
        severity: 'High',
        date: '2026-10-22',
        time: '11:00',
        reporterName: 'Sourav Mukherjee',
        reporterContact: '9877889900',
        reporterEmail: 'sourav.m@example.com',
        image: null,
        timeline: [
            { date: '2026-10-22 11:30', action: 'Report Filed', note: 'Complaint registered.' },
            { date: '2026-10-23 15:00', action: 'Under Review', note: 'Accused identified and summoned.' },
            { date: '2026-10-25 10:00', action: 'Resolved', note: 'Refund settlement completed; firm blacklisted.' },
        ],
    },
    {
        id: 'CR-1008',
        title: 'Suspicious drone activity over residential complex',
        category: 'Other',
        location: 'Powai Lake Promenade, Mumbai',
        description: 'Unidentified drone flying at balcony height past midnight near residential towers. Possible privacy violation.',
        status: 'Pending',
        severity: 'Low',
        date: '2026-10-25',
        time: '01:15',
        reporterName: 'Kunal Kapoor',
        reporterContact: '9888990011',
        reporterEmail: 'kunal.k@example.com',
        image: null,
        timeline: [
            { date: '2026-10-25 01:45', action: 'Report Filed', note: 'Patrol alerted.' },
        ],
    },
]

// Simulate realistic network delay (ms)
const SIMULATED_LATENCY = 350

// Helper to load reports from storage with seed fallback
function getStoredReports() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_REPORTS))
            return [...SEED_REPORTS]
        }
        const parsed = JSON.parse(raw)
        if (!Array.isArray(parsed) || parsed.length === 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_REPORTS))
            return [...SEED_REPORTS]
        }
        return parsed
    } catch (e) {
        console.error('Storage reading error, falling back to seed data:', e)
        return [...SEED_REPORTS]
    }
}

function saveReports(reports) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reports))
    } catch (e) {
        console.error('Failed to save reports to localStorage:', e)
        throw new Error('Storage write failed. Please check storage permissions or free space.')
    }
}

// Global flag to simulate network error for testing retry behavior
let simulateFailure = false

export const reportService = {
    setSimulateFailure(value) {
        simulateFailure = Boolean(value)
    },
    getSimulateFailure() {
        return simulateFailure
    },

    /**
     * Fetch reports with filtering, searching, sorting, and pagination.
     */
    async fetchReports({
        category = 'All',
        status = 'All',
        search = '',
        page = 1,
        limit = 6,
        sortBy = 'newest',
    } = {}) {
        await new Promise((res) => setTimeout(res, SIMULATED_LATENCY))

        if (simulateFailure) {
            throw new Error('Simulated Network Error: Failed to reach crime reporting service. Click Retry to reconnect.')
        }

        let reports = getStoredReports()

        // 1. Filtering by Category
        if (category && category !== 'All') {
            reports = reports.filter((r) => r.category === category)
        }

        // 2. Filtering by Status
        if (status && status !== 'All') {
            reports = reports.filter((r) => (r.status || 'Pending') === status)
        }

        // 3. Search matching (Title, Description, Location, ID, Reporter)
        if (search && search.trim() !== '') {
            const term = search.trim().toLowerCase()
            reports = reports.filter((r) => {
                return (
                    (r.title && r.title.toLowerCase().includes(term)) ||
                    (r.location && r.location.toLowerCase().includes(term)) ||
                    (r.description && r.description.toLowerCase().includes(term)) ||
                    (r.category && r.category.toLowerCase().includes(term)) ||
                    (r.id && String(r.id).toLowerCase().includes(term)) ||
                    (r.reporterName && r.reporterName.toLowerCase().includes(term))
                )
            })
        }

        // 4. Sorting
        reports.sort((a, b) => {
            if (sortBy === 'newest') {
                return new Date(b.date || 0) - new Date(a.date || 0) || String(b.id).localeCompare(String(a.id))
            }
            if (sortBy === 'oldest') {
                return new Date(a.date || 0) - new Date(b.date || 0) || String(a.id).localeCompare(String(b.id))
            }
            if (sortBy === 'title') {
                return (a.title || '').localeCompare(b.title || '')
            }
            if (sortBy === 'category') {
                return (a.category || '').localeCompare(b.category || '')
            }
            if (sortBy === 'status') {
                return (a.status || 'Pending').localeCompare(b.status || 'Pending')
            }
            return 0
        })

        const total = reports.length
        const totalPages = Math.max(1, Math.ceil(total / limit))
        const currentPage = Math.min(Math.max(1, page), totalPages)
        const startIndex = (currentPage - 1) * limit
        const paginatedItems = reports.slice(startIndex, startIndex + limit)

        return {
            data: paginatedItems,
            pagination: {
                page: currentPage,
                limit,
                total,
                totalPages,
                hasMore: currentPage < totalPages,
            },
        }
    },

    /**
     * Get a single report by ID.
     */
    async getReportById(id) {
        await new Promise((res) => setTimeout(res, 250))
        const reports = getStoredReports()
        const report = reports.find((r) => String(r.id) === String(id))
        if (!report) {
            throw new Error(`Report with reference ID "${id}" was not found.`)
        }
        return report
    },

    /**
     * Create a new report (CREATE).
     */
    async createReport(reportData) {
        await new Promise((res) => setTimeout(res, 450))

        const reports = getStoredReports()
        const newId = `CR-${Math.floor(1000 + Math.random() * 9000)}`
        const now = new Date()

        const newReport = {
            id: newId,
            title: reportData.title.trim(),
            category: reportData.category || 'Other',
            location: reportData.location.trim(),
            description: reportData.description.trim(),
            status: 'Pending',
            severity: reportData.severity || 'Medium',
            date: reportData.date || now.toISOString().split('T')[0],
            time: reportData.time || now.toTimeString().slice(0, 5),
            reporterName: reportData.reporterName ? reportData.reporterName.trim() : 'Anonymous Citizen',
            reporterContact: reportData.reporterContact ? reportData.reporterContact.trim() : '',
            reporterEmail: reportData.reporterEmail ? reportData.reporterEmail.trim() : '',
            image: reportData.image || null,
            timeline: [
                {
                    date: `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`,
                    action: 'Report Submitted',
                    note: 'Incident successfully recorded in system.',
                },
            ],
        }

        const updated = [newReport, ...reports]
        saveReports(updated)
        return newReport
    },

    /**
     * Update an existing report (UPDATE).
     */
    async updateReport(id, updates) {
        await new Promise((res) => setTimeout(res, 400))

        const reports = getStoredReports()
        const index = reports.findIndex((r) => String(r.id) === String(id))

        if (index === -1) {
            throw new Error(`Report "${id}" could not be found to update.`)
        }

        const existing = reports[index]
        const now = new Date()

        const updatedReport = {
            ...existing,
            ...updates,
            id: existing.id, // Preserve ID
            timeline: [
                ...(existing.timeline || []),
                {
                    date: `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`,
                    action: 'Report Edited',
                    note: updates.editNote || 'Report details updated by user/admin.',
                },
            ],
        }

        reports[index] = updatedReport
        saveReports(reports)
        return updatedReport
    },

    /**
     * Delete a report by ID (DELETE).
     */
    async deleteReport(id) {
        await new Promise((res) => setTimeout(res, 350))

        const reports = getStoredReports()
        const exists = reports.some((r) => String(r.id) === String(id))

        if (!exists) {
            throw new Error(`Report "${id}" does not exist.`)
        }

        const filtered = reports.filter((r) => String(r.id) !== String(id))
        saveReports(filtered)
        return { success: true, id }
    },

    /**
     * Update report status (e.g. Pending -> Under Review -> Resolved).
     */
    async updateStatus(id, newStatus, note = '') {
        await new Promise((res) => setTimeout(res, 300))

        const reports = getStoredReports()
        const index = reports.findIndex((r) => String(r.id) === String(id))

        if (index === -1) {
            throw new Error(`Report "${id}" not found.`)
        }

        const now = new Date()
        const report = reports[index]

        report.status = newStatus
        report.timeline = [
            ...(report.timeline || []),
            {
                date: `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`,
                action: `Status: ${newStatus}`,
                note: note || `Investigation status updated to ${newStatus}.`,
            },
        ]

        saveReports(reports)
        return report
    },

    /**
     * Calculate global analytics stats.
     */
    async getStats() {
        const reports = getStoredReports()
        const total = reports.length
        const pending = reports.filter((r) => (r.status || 'Pending') === 'Pending').length
        const underReview = reports.filter((r) => r.status === 'Under Review').length
        const resolved = reports.filter((r) => r.status === 'Resolved').length
        const uniqueLocations = new Set(reports.map((r) => r.location)).size
        const withImages = reports.filter((r) => r.image).length
        const resolutionRate = total === 0 ? 0 : Math.round((resolved / total) * 100)

        const categoryCounts = {
            Theft: reports.filter((r) => r.category === 'Theft').length,
            Assault: reports.filter((r) => r.category === 'Assault').length,
            Vandalism: reports.filter((r) => r.category === 'Vandalism').length,
            Fraud: reports.filter((r) => r.category === 'Fraud').length,
            Other: reports.filter((r) => r.category === 'Other').length,
        }

        return {
            total,
            pending,
            underReview,
            resolved,
            uniqueLocations,
            withImages,
            resolutionRate,
            categoryCounts,
        }
    },
}

export default reportService
