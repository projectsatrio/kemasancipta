export type Role = 'admin' | 'accounting' | 'marketing' | 'it';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  role: Role;
}

export interface MenuItem {
  title: string;
  path: string;
  roleRequired: Role;
  icon: string;
}
