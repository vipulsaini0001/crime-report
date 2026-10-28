import { useState } from 'react'
import CrimeList from '../components/reports/CrimeList'
import CrimeDetailsModal from '../components/reports/CrimeDetailsModal'

export function ReportsPage() {
    const [selectedModalReport, setSelectedModalReport] = useState(null)

    return (
        <main className="main-content-v2">
            <CrimeList onViewModal={(report) => setSelectedModalReport(report)} />

            {selectedModalReport && (
                <CrimeDetailsModal
                    report={selectedModalReport}
                    onClose={() => setSelectedModalReport(null)}
                />
            )}
        </main>
    )
}

export default ReportsPage
