import { auth } from '@/auth.config';
import { Title } from '@/components';
import { redirect } from 'next/navigation';
import Image from 'next/image';

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    // redirect('/auth/login?returnTo=/profile');
    redirect('/');
  }

  return (
    <div className="container mx-auto p-4">
      <Title title="Perfil" />
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-4 mb-6">
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name}
              width={64}
              height={64}
              className="rounded-full"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xl text-gray-600">
                {session.user.name.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold">{session.user.name}</h2>
            <p className="text-gray-600 ml-1">{session.user.email}</p>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-medium mb-4">Información del Usuario</h3>
          {/* <p><strong>ID:</strong> {session.user.id}</p> */}
          <p>
            <strong>Email Verificado:</strong>{' '}
            {session.user.emailVerified ? 'Sí' : 'No'}
          </p>
          <p>
            <strong>Rol:</strong> {session.user.role}
          </p>
        </div>
      </div>
    </div>
  );
}
