'use client';

import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    patientName: 'John Doe',
    age: 65,
    diagnosis: 'Non-small cell lung cancer',
    stage: 'Stage IV',
    payer: 'MockHealth',
    code: 'J9312',
    clinicalNote: 'Patient presents with advanced stage NSCLC. Previous lines of therapy failed. ECOG PS 1.'
  });

  const [authResult, setAuthResult] = useState<any>(null);
  const [checklist, setChecklist] = useState<any>(null);
  const [letter, setLetter] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const handleCheckAuth = async () => {
    setLoading('auth');
    try {
      const res = await fetch(`${API_URL}/check_auth_need`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payer: formData.payer,
          code: formData.code,
          diagnosis: formData.diagnosis,
          stage: formData.stage,
          clinical_note: formData.clinicalNote
        })
      });
      const data = await res.json();
      setAuthResult(data);
    } catch (e) {
      console.error(e);
      alert('Failed to connect to backend. Make sure it is running on port 8000.');
    }
    setLoading(null);
  };

  const handleGenerateChecklist = async () => {
    setLoading('checklist');
    try {
      const res = await fetch(`${API_URL}/generate_checklist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diagnosis: formData.diagnosis,
          stage: formData.stage,
          code: formData.code,
          clinical_note: formData.clinicalNote
        })
      });
      const data = await res.json();
      setChecklist(data.checklist);
    } catch (e) {
      console.error(e);
    }
    setLoading(null);
  };

  const handleDraftLetter = async () => {
    setLoading('letter');
    try {
      const res = await fetch(`${API_URL}/draft_letter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_name: formData.patientName,
          payer: formData.payer,
          code: formData.code,
          clinical_note: formData.clinicalNote,
          justification_points: [
            `${formData.diagnosis} ${formData.stage}`,
            "Therapy aligned with NCCN guidelines",
            "Clinical necessity supported by notes"
          ]
        })
      });
      const data = await res.json();
      setLetter(data.letter_content);
    } catch (e) {
      console.error(e);
    }
    setLoading(null);
  };

  return (
    <main className="container">
      <div className="header">
        <h1>Mini-RISA PA</h1>
        <p>AI-Powered Prior Authorization Automation</p>
      </div>

      <div className="grid">
        {/* Left Column: Input */}
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Case Details</h2>

          <div className="form-group">
            <label>Patient Name</label>
            <input
              className="form-control"
              value={formData.patientName}
              onChange={e => setFormData({ ...formData, patientName: e.target.value })}
            />
          </div>

          <div className="grid" style={{ gap: '1rem', marginBottom: '0' }}>
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                className="form-control"
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: parseInt(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label>Stage</label>
              <select
                className="form-control"
                value={formData.stage}
                onChange={e => setFormData({ ...formData, stage: e.target.value })}
              >
                <option>Stage I</option>
                <option>Stage II</option>
                <option>Stage III</option>
                <option>Stage IV</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Diagnosis</label>
            <input
              className="form-control"
              value={formData.diagnosis}
              onChange={e => setFormData({ ...formData, diagnosis: e.target.value })}
            />
          </div>

          <div className="grid" style={{ gap: '1rem', marginBottom: '0' }}>
            <div className="form-group">
              <label>Payer</label>
              <select
                className="form-control"
                value={formData.payer}
                onChange={e => setFormData({ ...formData, payer: e.target.value })}
              >
                <option>MockHealth</option>
                <option>BlueCross</option>
                <option>Medicare</option>
              </select>
            </div>
            <div className="form-group">
              <label>CPT/Drug Code</label>
              <input
                className="form-control"
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Clinical Note</label>
            <textarea
              className="form-control"
              rows={4}
              value={formData.clinicalNote}
              onChange={e => setFormData({ ...formData, clinicalNote: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button
              className="btn btn-primary"
              onClick={handleCheckAuth}
              disabled={!!loading}
            >
              {loading === 'auth' ? 'Checking...' : 'Check Auth Need'}
            </button>
          </div>
        </div>

        {/* Right Column: Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* Auth Status */}
          <div className="card">
            <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Authorization Status</h2>
            {!authResult ? (
              <p style={{ color: 'var(--secondary)' }}>Run a check to see status.</p>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <span className={`badge ${authResult.auth_needed ? 'badge-red' : 'badge-green'}`}>
                    {authResult.auth_needed ? 'AUTH REQUIRED' : 'NO AUTH NEEDED'}
                  </span>
                  {authResult.rule_id && <span className="badge badge-gray">{authResult.rule_id}</span>}
                </div>
                <p style={{ lineHeight: '1.6' }}>{authResult.reason}</p>

                {authResult.auth_needed && (
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button
                      className="btn btn-secondary"
                      onClick={handleGenerateChecklist}
                      disabled={!!loading}
                    >
                      {loading === 'checklist' ? 'Generating...' : 'Generate Checklist'}
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={handleDraftLetter}
                      disabled={!!loading}
                    >
                      {loading === 'letter' ? 'Drafting...' : 'Draft Letter'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Checklist */}
          {checklist && (
            <div className="card">
              <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Required Documentation</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {checklist.map((item: any, i: number) => (
                  <div key={i} className="checklist-item">
                    <input type="checkbox" defaultChecked={false} />
                    <div>
                      <div style={{ fontWeight: '600' }}>{item.item}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>{item.reason}</div>
                    </div>
                    {item.mandatory && <span className="badge badge-red" style={{ fontSize: '0.7rem', marginLeft: 'auto' }}>REQ</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Letter */}
          {letter && (
            <div className="card">
              <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Letter Draft</h2>
              <div className="result-box">
                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '0.9rem' }}>
                  {letter}
                </pre>
              </div>
              <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={() => navigator.clipboard.writeText(letter)}>
                Copy to Clipboard
              </button>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
