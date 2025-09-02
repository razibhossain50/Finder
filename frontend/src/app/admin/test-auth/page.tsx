'use client';

import { useAuth } from '@/context/AuthContext';
import { Card, CardBody, CardHeader } from '@heroui/react';
import { Shield, User, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function TestAuthPage() {
  const { user, isAuthenticated, isLoading } = useAuth();

  const getStatusIcon = (condition: boolean) => {
    return condition ? (
      <CheckCircle className="h-5 w-5 text-green-600" />
    ) : (
      <XCircle className="h-5 w-5 text-red-600" />
    );
  };

  const getStatusColor = (condition: boolean) => {
    return condition ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Authentication Test</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Authentication Status */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User className="h-5 w-5" />
              Authentication Status
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Loading State:</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(!isLoading)}
                <span className={getStatusColor(!isLoading)}>
                  {isLoading ? 'Loading...' : 'Ready'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Authenticated:</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(isAuthenticated)}
                <span className={getStatusColor(isAuthenticated)}>
                  {isAuthenticated ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">User Loaded:</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(!!user)}
                <span className={getStatusColor(!!user)}>
                  {user ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Admin Role:</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(user?.role === 'admin' || user?.role === 'superadmin')}
                <span className={getStatusColor(user?.role === 'admin' || user?.role === 'superadmin')}>
                  {user?.role || 'None'}
                </span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* User Information */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User className="h-5 w-5" />
              User Information
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            {user ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">ID:</span>
                  <span className="font-mono text-sm">{user.id}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="text-sm">{user.fullName || 'Not set'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="text-sm">{user.email}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Role:</span>
                  <span className={`text-sm font-medium px-2 py-1 rounded ${
                    user.role === 'superadmin' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No user data available</p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Token Information */}
        <Card className="border-0 shadow-lg md:col-span-2">
          <CardHeader className="pb-3">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Token Information
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600 block mb-2">Admin Token Present:</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(!!localStorage.getItem('admin_user_access_token'))}
                  <span className={getStatusColor(!!localStorage.getItem('admin_user_access_token'))}>
                    {localStorage.getItem('admin_user_access_token') ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-gray-600 block mb-2">User Data Present:</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(!!localStorage.getItem('user'))}
                  <span className={getStatusColor(!!localStorage.getItem('user'))}>
                    {localStorage.getItem('user') ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {localStorage.getItem('admin_user_access_token') && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <span className="text-gray-600 text-sm block mb-1">Token (first 50 chars):</span>
                <code className="text-xs font-mono text-gray-800 break-all">
                  {localStorage.getItem('admin_user_access_token')?.substring(0, 50)}...
                </code>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Debug Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-3">
          <h2 className="text-lg font-semibold text-gray-900">Debug Actions</h2>
        </CardHeader>
        <CardBody>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Reload Page
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                document.cookie = 'admin_user_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                window.location.href = '/auth/admin/login';
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Clear All & Logout
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}