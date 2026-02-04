import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { Skeleton } from '@/components/ui/skeleton';

const AdminLayout: React.FC = () => {
  const { isAdmin, isLoading } = useAdmin();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md p-8">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-8 w-1/2" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default AdminLayout;
