export type ProfileRole = "teacher" | "student";

export type Profile = {
  id: string;
  email: string;
  name: string | null;
  role: ProfileRole;
  is_admin: boolean;
  created_at: string;
};
