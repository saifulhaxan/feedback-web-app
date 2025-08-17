# Role-Based Access Control Implementation

## Overview
This document outlines the comprehensive role-based access control (RBAC) system implemented in the feedback webapp to match the mobile app's functionality.

## Role Definitions

### 1. **Parent Role** 
- **Access Level**: Full access to all features (no restrictions)
- **Permissions**: All permissions granted

### 2. **Manager Role**
- **Access Level**: Cannot add their own children but can become a secondary parent to other children
- **Restrictions**: Cannot use `ADD_CHILDREN` permission

### 3. **Teacher Role**
- **Access Level**: Same as Manager role
- **Restrictions**: Cannot use `ADD_CHILDREN` permission

### 4. **Regular Role**
- **Access Level**: Cannot create monitoring groups
- **Restrictions**: Cannot use `CREATE_MONITORING_GROUP` permission

### 5. **Child Role**
- **Access Level**: Highly restricted access
- **Restrictions**:
  - Cannot access Groups module
  - Parent Module: Only "My Parents" tab visible
  - Network Module: Only "My Connections" tab visible (shows only parent connections)
  - Project Module: "My" and "Shared" tabs only (no sub-tabs in Shared)

## Implementation Details

### 1. **Role Permissions System** (`src/utils/rolePermissions.js`)
- **Purpose**: Centralized permission management
- **Features**:
  - Role definitions and permissions mapping
  - Helper functions for permission checking
  - Module access control
  - Role display names and restrictions

### 2. **Role-Based Route Protection** (`src/components/RoleBasedRoute.jsx`)
- **Purpose**: Protect routes based on user roles
- **Features**:
  - Module-level access control
  - Permission-level access control
  - Access denied pages with user-friendly messages
  - Automatic redirects for unauthorized access

### 3. **Header Navigation Updates** (`src/components/header/Header.jsx`)
- **Changes**:
  - Groups link hidden for Child role
  - "My Parents" vs "My Children" text based on role
  - Role-based navigation visibility

### 4. **App.jsx Route Protection**
- **Protected Routes**:
  - `/groups` - Requires `ACCESS_GROUP_MODULE` permission
  - `/groups/:groupId` - Requires `ACCESS_GROUP_MODULE` permission
  - `/monitoring-groups/:groupId` - Requires `CREATE_MONITORING_GROUP` permission
  - `/add-parent` - Requires `ADD_CHILDREN` permission

### 5. **Network Page Restrictions** (`src/pages/NetworkPage.jsx`)
- **Child Role Restrictions**:
  - Only "connections" and "suggestions" tabs visible
  - "requests" tab hidden
  - Connections filtered to show only parent connections
  - Suggestions filtered to show only parent suggestions

### 6. **Project Page Restrictions** (`src/pages/ProjectPage.jsx`)
- **Child Role Restrictions**:
  - "All" tab renamed to "My" tab
  - "Shared" tab has no sub-tabs (only "Shared with me")
  - "Shared by me" sub-tab hidden

### 7. **Manage Relation Page Restrictions** (`src/pages/ManageRelationPage.jsx`)
- **Child Role Restrictions**:
  - Only "My Parents" tab visible
  - "Parents" and "Requests" tabs hidden
  - Default tab set to "My Parents" for child users

### 8. **Group Page Restrictions** (`src/pages/GroupPage.jsx`)
- **Regular Role Restrictions**:
  - Create group button hidden for users without `CREATE_MONITORING_GROUP` permission

### 9. **Group Modal Restrictions** (`src/components/groupModal/GroupModal.jsx`)
- **Regular Role Restrictions**:
  - "Monitor" group type option hidden for users without `CREATE_MONITORING_GROUP` permission

## Permission Matrix

| Permission | Parent | Manager | Teacher | Regular | Child |
|------------|--------|---------|---------|---------|-------|
| CREATE_PROJECT | ✅ | ✅ | ✅ | ✅ | ✅ |
| EDIT_PROJECT | ✅ | ✅ | ✅ | ✅ | ✅ |
| DELETE_PROJECT | ✅ | ✅ | ✅ | ✅ | ✅ |
| SHARE_PROJECT | ✅ | ✅ | ✅ | ✅ | ✅ |
| VIEW_SHARED_PROJECTS | ✅ | ✅ | ✅ | ✅ | ✅ |
| CREATE_GROUP | ✅ | ✅ | ✅ | ✅ | ❌ |
| CREATE_MONITORING_GROUP | ✅ | ✅ | ✅ | ❌ | ❌ |
| JOIN_GROUP | ✅ | ✅ | ✅ | ✅ | ✅ |
| MANAGE_GROUP | ✅ | ✅ | ✅ | ✅ | ❌ |
| ACCESS_GROUP_MODULE | ✅ | ✅ | ✅ | ✅ | ❌ |
| ADD_CHILDREN | ✅ | ❌ | ❌ | ❌ | ❌ |
| BECOME_SECONDARY_PARENT | ✅ | ✅ | ✅ | ✅ | ❌ |
| VIEW_ALL_CONNECTIONS | ✅ | ✅ | ✅ | ✅ | ❌ |
| VIEW_PARENT_CONNECTIONS | ❌ | ❌ | ❌ | ❌ | ✅ |
| REQUEST_FEEDBACK | ✅ | ✅ | ✅ | ✅ | ✅ |
| GIVE_FEEDBACK | ✅ | ✅ | ✅ | ✅ | ✅ |
| VIEW_FEEDBACK | ✅ | ✅ | ✅ | ✅ | ✅ |
| SUBMIT_STATUS | ✅ | ✅ | ✅ | ✅ | ✅ |
| VIEW_STATUS_REPORTS | ✅ | ✅ | ✅ | ✅ | ✅ |
| EDIT_PROFILE | ✅ | ✅ | ✅ | ✅ | ✅ |
| MANAGE_PARENTS | ✅ | ✅ | ✅ | ✅ | ✅ |

## Module Access Matrix

| Module | Parent | Manager | Teacher | Regular | Child |
|--------|--------|---------|---------|---------|-------|
| Projects | ✅ | ✅ | ✅ | ✅ | ✅ |
| Groups | ✅ | ✅ | ✅ | ✅ | ❌ |
| Network | ✅ | ✅ | ✅ | ✅ | ✅ (Restricted) |
| Feedback | ✅ | ✅ | ✅ | ✅ | ✅ |
| Status | ✅ | ✅ | ✅ | ✅ | ✅ |

## Usage Examples

### Checking Permissions
```javascript
import { hasPermission, canAccessModule } from '../utils/rolePermissions';

// Check specific permission
if (hasPermission(userRole, 'CREATE_MONITORING_GROUP')) {
  // Show monitoring group creation option
}

// Check module access
if (canAccessModule(userRole, 'groups')) {
  // Show groups navigation
}
```

### Route Protection
```javascript
<Route 
  path="/groups" 
  element={
    <RoleBasedRoute requiredModule="groups">
      <GroupPage />
    </RoleBasedRoute>
  } 
/>
```

### Conditional Rendering
```javascript
{canCreateMonitoringGroup && (
  <button onClick={createMonitoringGroup}>
    Create Monitoring Group
  </button>
)}
```

## Testing Recommendations

1. **Test each role** with different user accounts
2. **Verify navigation** shows/hides correctly based on role
3. **Test route protection** by accessing restricted URLs directly
4. **Verify data filtering** works correctly for child users
5. **Test permission-based UI elements** show/hide appropriately

## Future Enhancements

1. **Dynamic permission updates** without page refresh
2. **Permission inheritance** for complex role hierarchies
3. **Audit logging** for permission checks
4. **Permission caching** for better performance
5. **Role-based analytics** and reporting

## Security Considerations

1. **Server-side validation** should mirror client-side restrictions
2. **API endpoints** should check permissions before processing requests
3. **Data filtering** should be implemented at the database level
4. **Session management** should include role information
5. **Regular security audits** of permission implementations
