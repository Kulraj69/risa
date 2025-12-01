import React from 'react';
import styles from './CasesTable.module.css';

export interface Case {
    id: string;
    patientName: string;
    diagnosis: string;
    stage: string;
    treatmentCode: string;
    payer: string;
    status: string;
    timeWaiting: string;
    clinicalNote?: string;
}

interface CasesTableProps {
    data: Case[];
    onViewCase: (caseItem: Case) => void;
}

const CasesTable = ({ data, onViewCase }: CasesTableProps) => {
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
                    {data.map((row) => (
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
                                    onClick={() => onViewCase(row)}
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
