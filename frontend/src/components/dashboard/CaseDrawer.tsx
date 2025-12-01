import React, { useState, useEffect } from 'react';
import styles from './CaseDrawer.module.css';
import { IconX, IconCheck, IconClock } from '../ui/Icons';

interface CaseData {
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

interface CaseDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    caseData: CaseData | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const CaseDrawer = ({ isOpen, onClose, caseData }: CaseDrawerProps) => {
    const [checklist, setChecklist] = useState<any[]>([]);
    const [letter, setLetter] = useState<string | null>(null);
    const [loading, setLoading] = useState<string | null>(null);
    const [authStatus, setAuthStatus] = useState<any>(null);

    useEffect(() => {
        if (isOpen && caseData) {
            // Reset state when opening a new case
            setChecklist([]);
            setLetter(null);
            setAuthStatus(null);

            // Auto-check auth status
            checkAuthStatus();
        }
    }, [isOpen, caseData]);

    const checkAuthStatus = async () => {
        if (!caseData) return;
        setLoading('auth');
        try {
            const res = await fetch(`${API_URL}/check_auth_need`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    payer: caseData.payer,
                    code: caseData.treatmentCode.split(' ')[0], // Extract code like J9035
                    diagnosis: caseData.diagnosis,
                    stage: caseData.stage,
                    clinical_note: caseData.clinicalNote || "Standard clinical note"
                })
            });
            const data = await res.json();
            setAuthStatus(data);

            // If auth needed, generate checklist
            if (data.auth_needed) {
                generateChecklist();
            }
        } catch (e) {
            console.error("Error checking auth:", e);
        }
        setLoading(null);
    };

    const generateChecklist = async () => {
        if (!caseData) return;
        setLoading('checklist');
        try {
            const res = await fetch(`${API_URL}/generate_checklist`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    diagnosis: caseData.diagnosis,
                    stage: caseData.stage,
                    code: caseData.treatmentCode.split(' ')[0],
                    clinical_note: caseData.clinicalNote || "Standard clinical note"
                })
            });
            const data = await res.json();
            setChecklist(data.checklist.map((item: any, idx: number) => ({
                id: idx,
                text: item.item,
                completed: false,
                mandatory: item.mandatory
            })));
        } catch (e) {
            console.error("Error generating checklist:", e);
        }
        setLoading(null);
    };

    const generateLetter = async () => {
        if (!caseData) return;
        setLoading('letter');
        try {
            const res = await fetch(`${API_URL}/draft_letter`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patient_name: caseData.patientName,
                    payer: caseData.payer,
                    code: caseData.treatmentCode.split(' ')[0],
                    clinical_note: caseData.clinicalNote || "Standard clinical note",
                    justification_points: [
                        `${caseData.diagnosis} ${caseData.stage}`,
                        "Therapy aligned with NCCN guidelines",
                        "Clinical necessity supported by notes"
                    ]
                })
            });
            const data = await res.json();
            setLetter(data.letter_content);
        } catch (e) {
            console.error("Error generating letter:", e);
        }
        setLoading(null);
    };

    if (!isOpen || !caseData) return null;

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
                        <div className="text-h2">Case #{caseData.id}</div>
                        <div className="text-body">{caseData.patientName} • {caseData.diagnosis} • {caseData.stage}</div>
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
                                <span className="text-body-strong">{caseData.treatmentCode}</span>
                                {authStatus && (
                                    <span className={`badge ${authStatus.auth_needed ? 'badge-red' : 'badge-green'}`}>
                                        {authStatus.auth_needed ? 'Auth Required' : 'No Auth Needed'}
                                    </span>
                                )}
                            </div>
                            <div className="text-body">
                                {authStatus ? authStatus.reason : 'Checking authorization requirements...'}
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
                            {/* Dynamic Timeline Items based on state */}
                            {checklist.length > 0 && (
                                <div className={styles.timelineItem}>
                                    <div className={`${styles.timelineDot} ${styles.timelineDotActive}`}></div>
                                    <div className={styles.timelineContent}>
                                        <div className="text-body-strong">Checklist Generated</div>
                                        <div className={styles.timelineTime}>AI Agent</div>
                                    </div>
                                </div>
                            )}
                            {letter && (
                                <div className={styles.timelineItem}>
                                    <div className={`${styles.timelineDot} ${styles.timelineDotActive}`}></div>
                                    <div className={styles.timelineContent}>
                                        <div className="text-body-strong">Letter Drafted</div>
                                        <div className={styles.timelineTime}>AI Agent</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Checklist */}
                    {checklist.length > 0 && (
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
                                        <div className="flex-col">
                                            <span className={item.completed ? 'text-body-strong' : 'text-body'}>
                                                {item.text}
                                            </span>
                                            {item.mandatory && <span className="text-small" style={{ color: 'var(--status-error-text)' }}>Mandatory</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Letter Preview */}
                    {letter && (
                        <div className={styles.section}>
                            <div className={styles.sectionTitle}>Letter Draft</div>
                            <div className={styles.card} style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '12px' }}>{letter}</pre>
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.footer}>
                    <button
                        className="btn btn-secondary"
                        onClick={generateLetter}
                        disabled={loading === 'letter'}
                    >
                        {loading === 'letter' ? 'Drafting...' : 'Generate Letter'}
                    </button>
                    <button className="btn btn-primary">Submit to Payer</button>
                </div>
            </div>
        </>
    );
};

export default CaseDrawer;
