import React, { useState } from 'react';
import styles from './CaseDrawer.module.css';
import { IconX, IconCheck, IconClock } from '../ui/Icons';

interface CaseDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    caseId: string | null;
}

const CaseDrawer = ({ isOpen, onClose, caseId }: CaseDrawerProps) => {
    const [checklist, setChecklist] = useState([
        { id: 1, text: 'Patient Consent Form', completed: true },
        { id: 2, text: 'Pathology Report (Confirmed Diagnosis)', completed: true },
        { id: 3, text: 'Previous Therapy History', completed: false },
        { id: 4, text: 'Genetic Testing Results (BRAF/EGFR)', completed: false },
    ]);

    if (!isOpen) return null;

    const toggleCheck = (id: number) => {
        setChecklist(checklist.map(item =>
            item.id === id ? { ...item, completed: !item.completed } : item
        ));
    };

    return (
        <>
            <div className={styles.overlay} onClick={onClose} />
            <div className={styles.drawer}>
                <div className={styles.header}>
                    <div>
                        <div className="text-h2">Case #{caseId || '001'}</div>
                        <div className="text-body">Eleanor Rigby • NSCLC • Stage III</div>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <IconX size={24} />
                    </button>
                </div>

                <div className={styles.content}>
                    {/* Summary Card */}
                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>Therapy Plan</div>
                        <div className={styles.card}>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-body-strong">J9035 (Bevacizumab)</span>
                                <span className="badge badge-gray">Pending Auth</span>
                            </div>
                            <div className="text-body">
                                Requested for 6 cycles. First line treatment in combination with chemotherapy.
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>Workflow Timeline</div>
                        <div className={styles.timeline}>
                            <div className={styles.timelineItem}>
                                <div className={`${styles.timelineDot} ${styles.timelineDotActive}`}></div>
                                <div className={styles.timelineContent}>
                                    <div className="text-body-strong">Case Initiated</div>
                                    <div className={styles.timelineTime}>Dec 01, 09:00 AM</div>
                                </div>
                            </div>
                            <div className={styles.timelineItem}>
                                <div className={`${styles.timelineDot} ${styles.timelineDotActive}`}></div>
                                <div className={styles.timelineContent}>
                                    <div className="text-body-strong">Documents Uploaded</div>
                                    <div className={styles.timelineTime}>Dec 01, 09:15 AM</div>
                                </div>
                            </div>
                            <div className={styles.timelineItem}>
                                <div className={styles.timelineDot}></div>
                                <div className={styles.timelineContent}>
                                    <div className="text-body-strong">Medical Necessity Review</div>
                                    <div className={styles.timelineTime}>Waiting for review...</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Checklist */}
                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>Required Documentation</div>
                        <div className={styles.checklist}>
                            {checklist.map(item => (
                                <div
                                    key={item.id}
                                    className={`${styles.checklistItem} ${item.completed ? styles.checklistItemCompleted : ''}`}
                                    onClick={() => toggleCheck(item.id)}
                                >
                                    <div className={`${styles.checkbox} ${item.completed ? styles.checkboxChecked : ''}`}>
                                        {item.completed && <IconCheck size={14} />}
                                    </div>
                                    <span className={item.completed ? 'text-body-strong' : 'text-body'}>
                                        {item.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.footer}>
                    <button className="btn btn-secondary">Generate Letter</button>
                    <button className="btn btn-primary">Submit to Payer</button>
                </div>
            </div>
        </>
    );
};

export default CaseDrawer;
