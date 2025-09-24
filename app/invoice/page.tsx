'use client';

import React from 'react';
import AuthGuard from '@/src/components/Auth/AuthGuard';
import DashboardLayout from '@/src/components/Layout/DashboardLayout';
import InvoiceGenerator from '@/src/components/Invoice/Invoice';

const InvoicePage: React.FC = () => {
  return (
    <AuthGuard>
      <DashboardLayout currentPage="invoice">
        <InvoiceGenerator />
      </DashboardLayout>
    </AuthGuard>
  );
};

export default InvoicePage;