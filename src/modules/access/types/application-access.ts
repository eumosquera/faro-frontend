export interface ApplicationAccessMembership {
    membershipId: string;
    residentialComplexId: string;
    accessRoleId: string;
}

export interface ApplicationAccess {
    hasApplicationAccess: boolean;
    memberships: ApplicationAccessMembership[];
}