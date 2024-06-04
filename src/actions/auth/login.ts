'use server';

import { signIn } from '@/auth.config';
import { sleep } from '@/utils';
import { AuthError, CredentialsSignin } from 'next-auth';
import { object } from 'zod';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    // await sleep(2);
    await signIn('credentials', Object.fromEntries(formData));
  } catch (error) {
    // if (error instanceof AuthError) {
    //   switch (error.type) {
    //     case 'CredentialsSignin':
    //       return 'Invalid credentials.';
    //     default:
    //       return 'Something went wrong.';
    //   }
    // }
    // throw error;
    return 'CredentialsSignin';
  }
}
