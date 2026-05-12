export const normalizeRole = (role) => {
    if (!role) return null;

    return role.replace(/^ROLE_/, "");
};

export const isSuperAdmin = (role) => {
    return normalizeRole(role) === "SUPER_ADMIN";
};

export const isCommunityAdmin = (role) => {
    return normalizeRole(role) === "COMMUNITY_ADMIN";
};

export const isAdmin = (role) => {
    const normalizedRole = normalizeRole(role);

    return ["SUPER_ADMIN", "COMMUNITY_ADMIN"].includes(normalizedRole);
};