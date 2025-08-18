import React from 'react';
import { Navigate } from 'react-router-dom';
import { hasPermission, canAccessModule, getRoleDisplayName } from '../utils/rolePermissions';
import useUserStore from '../store/userStore';

const RoleBasedRoute = ({ 
  children, 
  requiredPermission, 
  requiredModule, 
  fallbackPath = "/projects",
  showAccessDenied = true 
}) => {
  const { userData } = useUserStore();
  const userRole = userData?.user?.role?.name;
  
  // If no user data, redirect to login
  if (!userData?.user) {
    return <Navigate to="/" replace />;
  }
  
  // Check module access
  if (requiredModule && !canAccessModule(userRole, requiredModule)) {
    if (showAccessDenied) {
      return (
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body text-center">
                  <h4 className="text-danger mb-3">Access Denied</h4>
                  <p className="mb-3">
                    Your role ({getRoleDisplayName(userRole)}) does not have access to this module.
                  </p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => window.history.back()}
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return <Navigate to={fallbackPath} replace />;
  }
  
  // Check specific permission
  if (requiredPermission && !hasPermission(userRole, requiredPermission)) {
    if (showAccessDenied) {
      return (
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body text-center">
                  <h4 className="text-danger mb-3">Permission Denied</h4>
                  <p className="mb-3">
                    Your role ({getRoleDisplayName(userRole)}) does not have the required permission.
                  </p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => window.history.back()}
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return <Navigate to={fallbackPath} replace />;
  }
  
  return children;
};

export default RoleBasedRoute;
