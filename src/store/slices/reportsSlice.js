import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import reportService from '../../services/reportService'

// Async Thunks
export const fetchReportsAsync = createAsyncThunk(
    'reports/fetchReports',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { filters, pagination } = getState().reports
            const result = await reportService.fetchReports({
                category: filters.category,
                status: filters.status,
                search: filters.search,
                sortBy: filters.sortBy,
                page: pagination.page,
                limit: pagination.limit,
            })
            return result
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch reports')
        }
    }
)

export const fetchMoreReportsAsync = createAsyncThunk(
    'reports/fetchMoreReports',
    async (nextPage, { getState, rejectWithValue }) => {
        try {
            const { filters, pagination } = getState().reports
            const result = await reportService.fetchReports({
                category: filters.category,
                status: filters.status,
                search: filters.search,
                sortBy: filters.sortBy,
                page: nextPage,
                limit: pagination.limit,
            })
            return result
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to load more reports')
        }
    }
)

export const fetchReportByIdAsync = createAsyncThunk(
    'reports/fetchReportById',
    async (id, { rejectWithValue }) => {
        try {
            const report = await reportService.getReportById(id)
            return report
        } catch (error) {
            return rejectWithValue(error.message || `Could not find report ${id}`)
        }
    }
)

export const fetchStatsAsync = createAsyncThunk(
    'reports/fetchStats',
    async (_, { rejectWithValue }) => {
        try {
            const stats = await reportService.getStats()
            return stats
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to calculate statistics')
        }
    }
)

export const createReportAsync = createAsyncThunk(
    'reports/createReport',
    async (reportData, { rejectWithValue }) => {
        try {
            const newReport = await reportService.createReport(reportData)
            return newReport
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to create report')
        }
    }
)

export const updateReportAsync = createAsyncThunk(
    'reports/updateReport',
    async ({ id, updates }, { rejectWithValue }) => {
        try {
            const updated = await reportService.updateReport(id, updates)
            return updated
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to update report')
        }
    }
)

export const deleteReportAsync = createAsyncThunk(
    'reports/deleteReport',
    async (id, { rejectWithValue }) => {
        try {
            await reportService.deleteReport(id)
            return id
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to delete report')
        }
    }
)

export const updateStatusAsync = createAsyncThunk(
    'reports/updateStatus',
    async ({ id, status, note }, { rejectWithValue }) => {
        try {
            const updated = await reportService.updateStatus(id, status, note)
            return updated
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to update report status')
        }
    }
)

const initialState = {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    pagination: {
        page: 1,
        limit: 6,
        total: 0,
        totalPages: 1,
        hasMore: false,
    },
    filters: {
        category: 'All',
        status: 'All',
        search: '',
        sortBy: 'newest',
    },
    viewMode: 'grid', // 'grid' | 'table'
    displayMode: 'pagination', // 'pagination' | 'infinite'
    singleReport: {
        data: null,
        status: 'idle',
        error: null,
    },
    stats: {
        data: null,
        status: 'idle',
        error: null,
    },
    simulateFailure: false,
}

const reportsSlice = createSlice({
    name: 'reports',
    initialState,
    reducers: {
        setCategoryFilter(state, action) {
            state.filters.category = action.payload
            state.pagination.page = 1 // Reset to first page on filter change
        },
        setStatusFilter(state, action) {
            state.filters.status = action.payload
            state.pagination.page = 1
        },
        setSearchQuery(state, action) {
            state.filters.search = action.payload
            state.pagination.page = 1
        },
        setSortBy(state, action) {
            state.filters.sortBy = action.payload
            state.pagination.page = 1
        },
        setPage(state, action) {
            state.pagination.page = action.payload
        },
        setLimit(state, action) {
            state.pagination.limit = action.payload
            state.pagination.page = 1
        },
        setViewMode(state, action) {
            state.viewMode = action.payload
        },
        setDisplayMode(state, action) {
            state.displayMode = action.payload
            state.pagination.page = 1
        },
        resetFilters(state) {
            state.filters = {
                category: 'All',
                status: 'All',
                search: '',
                sortBy: 'newest',
            }
            state.pagination.page = 1
        },
        toggleSimulateFailure(state) {
            state.simulateFailure = !state.simulateFailure
            reportService.setSimulateFailure(state.simulateFailure)
        },
        clearSingleReport(state) {
            state.singleReport = { data: null, status: 'idle', error: null }
        },
    },
    extraReducers: (builder) => {
        // Fetch reports
        builder
            .addCase(fetchReportsAsync.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(fetchReportsAsync.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.items = action.payload.data
                state.pagination = action.payload.pagination
                state.error = null
            })
            .addCase(fetchReportsAsync.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload || 'Failed to load reports'
            })

        // Fetch more reports (Infinite Scrolling)
        builder
            .addCase(fetchMoreReportsAsync.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchMoreReportsAsync.fulfilled, (state, action) => {
                state.status = 'succeeded'
                // Append unique items
                const existingIds = new Set(state.items.map((r) => r.id))
                const newItems = action.payload.data.filter((r) => !existingIds.has(r.id))
                state.items = [...state.items, ...newItems]
                state.pagination = action.payload.pagination
            })
            .addCase(fetchMoreReportsAsync.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload || 'Failed to load more reports'
            })

        // Fetch single report
        builder
            .addCase(fetchReportByIdAsync.pending, (state) => {
                state.singleReport.status = 'loading'
                state.singleReport.error = null
            })
            .addCase(fetchReportByIdAsync.fulfilled, (state, action) => {
                state.singleReport.status = 'succeeded'
                state.singleReport.data = action.payload
                state.singleReport.error = null
            })
            .addCase(fetchReportByIdAsync.rejected, (state, action) => {
                state.singleReport.status = 'failed'
                state.singleReport.error = action.payload || 'Report not found'
            })

        // Fetch stats
        builder
            .addCase(fetchStatsAsync.pending, (state) => {
                state.stats.status = 'loading'
            })
            .addCase(fetchStatsAsync.fulfilled, (state, action) => {
                state.stats.status = 'succeeded'
                state.stats.data = action.payload
            })
            .addCase(fetchStatsAsync.rejected, (state, action) => {
                state.stats.status = 'failed'
                state.stats.error = action.payload
            })

        // Create report
        builder.addCase(createReportAsync.fulfilled, (state, action) => {
            state.items.unshift(action.payload)
            state.pagination.total += 1
        })

        // Update report
        builder.addCase(updateReportAsync.fulfilled, (state, action) => {
            const index = state.items.findIndex((r) => r.id === action.payload.id)
            if (index !== -1) {
                state.items[index] = action.payload
            }
            if (state.singleReport.data?.id === action.payload.id) {
                state.singleReport.data = action.payload
            }
        })

        // Delete report
        builder.addCase(deleteReportAsync.fulfilled, (state, action) => {
            state.items = state.items.filter((r) => r.id !== action.payload)
            state.pagination.total = Math.max(0, state.pagination.total - 1)
            if (state.singleReport.data?.id === action.payload) {
                state.singleReport.data = null
            }
        })

        // Update status
        builder.addCase(updateStatusAsync.fulfilled, (state, action) => {
            const index = state.items.findIndex((r) => r.id === action.payload.id)
            if (index !== -1) {
                state.items[index] = action.payload
            }
            if (state.singleReport.data?.id === action.payload.id) {
                state.singleReport.data = action.payload
            }
        })
    },
})

export const {
    setCategoryFilter,
    setStatusFilter,
    setSearchQuery,
    setSortBy,
    setPage,
    setLimit,
    setViewMode,
    setDisplayMode,
    resetFilters,
    toggleSimulateFailure,
    clearSingleReport,
} = reportsSlice.actions

// Selectors
export const selectReports = (state) => state.reports.items
export const selectReportsStatus = (state) => state.reports.status
export const selectReportsError = (state) => state.reports.error
export const selectPagination = (state) => state.reports.pagination
export const selectFilters = (state) => state.reports.filters
export const selectViewMode = (state) => state.reports.viewMode
export const selectDisplayMode = (state) => state.reports.displayMode
export const selectStats = (state) => state.reports.stats
export const selectSingleReport = (state) => state.reports.singleReport
export const selectSimulateFailure = (state) => state.reports.simulateFailure

export default reportsSlice.reducer
