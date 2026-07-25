import { useSelector } from "react-redux";

export default function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
  } = useSelector((state) => state.auth);

  const roleKey = user?.activeRole?.key?.toUpperCase() || "";

  const permissions = user?.permissions || [];

  const hasPermission = (permission) =>
    permissions.includes(permission);

  const hasAnyPermission = (...perms) =>
    perms.some((p) => permissions.includes(p));

  const hasAllPermissions = (...perms) =>
    perms.every((p) => permissions.includes(p));

  const hasRole = (...roles) =>
    roles
      .map((r) => r.toUpperCase())
      .includes(roleKey);

  return {
    // Auth
    user,
    isAuthenticated,
    isLoading,

    // User
    userId: user?._id,
    name: user?.name,
    email: user?.email,
    phone: user?.phone,
    userType: user?.userType,

    // Organization
    organizationId: user?.activeOrganization?._id,
    organizationName: user?.activeOrganization?.name,
    organizations: user?.organizations || [],

    // Role
    role: user?.activeRole,
    roleKey,

    isSuperAdmin: roleKey === "SUPER_ADMIN",
    isOrganizer: roleKey === "ORGANIZER_OWNER",
    isBuyer: roleKey === "NORMAL_USER",

    hasRole,

    // Permissions
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}