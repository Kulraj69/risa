import React from 'react';
import styles from './CasesTable.module.css';

interface Case {
    id: string;
    patientName: string;
    diagnosis: string;
    stage: string;
    treatmentCode: string;
    payer: string;
    status: 'Pending' | 'Approved' | 'Denied' | 'Missing Docs';
    timeWaiting: string;
}

const dummyData: Case[] = [
    { id: '1', patientName: 'Eleanor Rigby', diagnosis: 'NSCLC', stage: 'Stage III', treatmentCode: 'J9035 (Bevacizumab)', payer: 'BlueCross', status: 'Pending', timeWaiting: '2 days' },
    { id: '2', patientName: 'Jude Law', diagnosis: 'Melanoma', stage: 'Stage II', treatmentCode: 'J9271 (Pembrolizumab)', payer: 'UnitedHealth', status: 'Missing Docs', timeWaiting: '4 hours' },
    { id: '3', patientName: 'Penny Lane', diagnosis: 'Breast Cancer', stage: 'Stage IV', treatmentCode: 'J9355 (Trastuzumab)', payer: 'Aetna', status: 'Approved', timeWaiting: '-' },
    { id: '4', patientName: 'Desmond Jones', diagnosis: 'Colorectal', stage: 'Stage III', treatmentCode: 'J9041 (Bortezomib)', payer: 'Cigna', status: 'Denied', timeWaiting: '1 day' },
    { id: '5', patientName: 'Rita Meter', diagnosis: 'Lung Cancer', stage: 'Stage I', treatmentCode: 'J9299 (Nivolumab)', payer: 'Medicare', status: 'Pending', timeWaiting: '5 hours' },
];

interface CasesTableProps {
    onViewCase: (caseId: string) => void;
}

const CasesTable = ({ onViewCase }: CasesTableProps) => {
    const getStatusClass = (status: string) => {
        switch (status) {
            case 'Pending': return styles.statusPending;
            case 'Approved': return styles.statusApproved;
            case 'Denied': return styles.statusDenied;
            case 'Missing Docs': return styles.statusMissing;
            default: return styles.statusPending;
        }
    };

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.th}>Patient Name</th>
                        <th className={styles.th}>Diagnosis</th>
                        <th className={styles.th}>Treatment</th>
                        <th className={styles.th}>Payer</th>
                        <th className={styles.th}>Status</th>
                        <th className={styles.th}>Time Waiting</th>
                        <th className={styles.th}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {dummyData.map((row) => (
                        <tr key={row.id} className={styles.tr}>
                            <td className={styles.td}>
                                <div className={styles.patientName}>{row.patientName}</div>
                            </td>
                            <td className={styles.td}>
                                <div>{row.diagnosis}</div>
                                <div className={styles.secondaryText}>{row.stage}</div>
                            </td>
                            <td className={styles.td}>
                                <div className={styles.secondaryText}>{row.treatmentCode}</div>
                            </td>
                            <td className={styles.td}>{row.payer}</td>
                            <td className={styles.td}>
                                <span className={`${styles.statusChip} ${getStatusClass(row.status)}`}>
                                    {row.status}
                                </span>
                            </td>
                            <td className={styles.td}>{row.timeWaiting}</td>
                            <td className={styles.td}>
                                <button
                                    className={styles.actionBtn}
                                    onClick={() => onViewCase(row.id)}
                                >
                                    View Workflow
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CasesTable;
