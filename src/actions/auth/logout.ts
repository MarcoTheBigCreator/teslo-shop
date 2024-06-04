'use server';

import { signOut } from '@/auth.config';

export async function logout() {
  try {
    await signOut();
  } catch (error) {
    return 'Credentials SignOut';
  }
}
