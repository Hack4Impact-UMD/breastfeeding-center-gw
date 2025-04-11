export interface User {
  auth_id: string;
  email: string;
  firstName: string;
  lastName: string;
  type: Role;
}

// Should correspond with firestore & cloud functions
export type Role = "VIEWER" | "EDITOR" | "ADMIN";
