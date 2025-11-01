export const MIN_PASSWORD_LENGTH = 13;
export const PASSWORD_REQUIREMENTS = [
  `Must include at least ${MIN_PASSWORD_LENGTH} characters`,
  "Must include at least 1 lowercase letter",
  "Must include at least 1 uppercase letter",
  "Must include at least 1 digit",
  "Must include at least 1 special character",
];
export function validatePassword(p: string) {
  return (
    p.length >= MIN_PASSWORD_LENGTH &&
    /[A-Z]/.test(p) &&
    /[a-z]/.test(p) &&
    /\d/.test(p) &&
    /[^A-Za-z0-9\s]/.test(p)
  );
}
