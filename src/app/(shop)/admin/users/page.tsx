export const revalidate = 0;

// https://tailwindcomponents.com/component/hoverable-table
import { getPaginatedUsersAdmin } from '@/actions';
import { Pagination, Title } from '@/components';

import { redirect } from 'next/navigation';
import { UsersTable } from './ui/UsersTable';

interface Props {
  searchParams: {
    page?: string;
  };
}

export default async function UsersPage({ searchParams }: Props) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const {
    ok,
    totalPages,
    users = [],
  } = await getPaginatedUsersAdmin({
    page,
  });

  if (!ok) {
    return redirect('/auth/login');
  }

  return (
    <>
      <Title title="Administración de usuarios" />

      <div className="mb-10">
        <UsersTable users={users} />
        <Pagination totalPages={totalPages!} />
      </div>
    </>
  );
}
