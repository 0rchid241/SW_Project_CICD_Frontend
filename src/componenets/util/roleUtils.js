export const normalizeRole = (role) => {
    if (!role) return null;

    return role.replace(/^ROLE_/, "");
};

export const isSuperAdmin = (user) => {
    return normalizeRole(user?.role) === "SUPER_ADMIN";
};

export const isCommunityAdmin = (user) => {
    return normalizeRole(user?.role) === "COMMUNITY_ADMIN";
};

export const isAdmin = (user) => {
    const role = normalizeRole(user?.role);

    return ["SUPER_ADMIN", "COMMUNITY_ADMIN"].includes(role);
};