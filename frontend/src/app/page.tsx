'use client';

import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import CasesTable, { Case } from '../components/dashboard/CasesTable';
import CaseDrawer from '../components/dashboard/CaseDrawer';

const dummyData: Case[] = [
  {
    id: '1',
    patientName: 'Eleanor Rigby',
    diagnosis: 'NSCLC',
    stage: 'Stage III',
    treatmentCode: 'J9035 (Bevacizumab)',
    payer: 'BlueCross',
    status: 'Pending',
    timeWaiting: '2 days',
    clinicalNote: 'Patient presents with advanced stage NSCLC. Previous lines of therapy failed. ECOG PS 1. Requesting Bevacizumab in combination with carboplatin and paclitaxel.'
  },
  {
    id: '2',
    patientName: 'Jude Law',
    diagnosis: 'Melanoma',
    stage: 'Stage II',
    treatmentCode: 'J9271 (Pembrolizumab)',
    payer: 'UnitedHealth',
    status: 'Missing Docs',
    timeWaiting: '4 hours',
    clinicalNote: 'Patient with unresectable Stage II Melanoma. No prior systemic therapy. BRAF V600E mutation negative.'
  },
  {
    id: '3',
    patientName: 'Penny Lane',
    diagnosis: 'Breast Cancer',
    stage: 'Stage IV',
    treatmentCode: 'J9355 (Trastuzumab)',
    payer: 'Aetna',
    status: 'Approved',
    timeWaiting: '-',
    clinicalNote: 'HER2 positive metastatic breast cancer. Cardiac function normal. Requesting maintenance Trastuzumab.'
  },
  {
    id: '4',
    patientName: 'Desmond Jones',
    diagnosis: 'Colorectal',
    stage: 'Stage III',
    treatmentCode: 'J9041 (Bortezomib)',
    payer: 'Cigna',
    status: 'Denied',
    timeWaiting: '1 day',
    clinicalNote: 'Recurrent colorectal cancer. Requesting off-label use of Bortezomib based on recent phase II trial data.'
  },
  {
    id: '5',
    patientName: 'Rita Meter',
    diagnosis: 'Lung Cancer',
    stage: 'Stage I',
    treatmentCode: 'J9299 (Nivolumab)',
    payer: 'Medicare',
    status: 'Pending',
    timeWaiting: '5 hours',
    clinicalNote: 'Stage I NSCLC, medically inoperable due to severe COPD. Requesting adjuvant Nivolumab.'
  },
];

export default function Home() {
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleViewCase = (caseItem: Case) => {
    setSelectedCase(caseItem);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedCase(null), 300); // Wait for animation
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-h1">Cases Overview</h1>
          <p className="text-body">Manage and track prior authorization requests.</p>
        </div>
        <button className="btn btn-primary">
          + New Case
        </button>
      </div>

      <CasesTable data={dummyData} onViewCase={handleViewCase} />

      <CaseDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        caseData={selectedCase}
      />
    </DashboardLayout>
  );
}
