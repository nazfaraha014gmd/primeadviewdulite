// This file is being replaced by `src/pages/dashboard/OverviewPage.tsx`.
// It can be deleted or kept for reference, but the routing now points to the new file.
import React from 'react';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Dashboard</h1>
        <p className="text-text-secondary mb-8">
          This is a placeholder for the user dashboard. <br/> We will build the layout and functionality in the next steps.
        </p>
        <Link to="/" className="text-primary hover:underline">
          &larr; Back to Home
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;
