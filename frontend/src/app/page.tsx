'use client';

import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import CasesTable from '../components/dashboard/CasesTable';
import CaseDrawer from '../components/dashboard/CaseDrawer';

export default function Home() {
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleViewCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedCaseId(null), 300); // Wait for animation
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

      <CasesTable onViewCase={handleViewCase} />

      <CaseDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        caseId={selectedCaseId}
      />
    </DashboardLayout>
  );
}
