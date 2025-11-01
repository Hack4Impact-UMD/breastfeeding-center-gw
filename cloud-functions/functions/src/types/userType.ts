export interface User {
  auth_id: string;
  email: string;
  firstName: string;
  lastName: string;
  pronouns?: string;
  phone?: string;
  type: Role;
}

// Should correspond with firestore & cloud functions
export type Role = "VOLUNTEER" | "ADMIN" | "DIRECTOR";

export const RoleLevels: Record<Role, number> = {
  VOLUNTEER: 0,
  ADMIN: 1,
  DIRECTOR: 2,
};
