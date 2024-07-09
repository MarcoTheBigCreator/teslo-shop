import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function LoadingPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
            <Skeleton circle={true} height={64} width={64} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              <Skeleton height={30} width={200} />
            </h2>
            <p className="text-gray-600 ml-1">
              <Skeleton height={20} width={200} />
            </p>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-medium mb-4">
            <Skeleton height={30} width={300} />
          </h3>
          <p>
            <strong>Email Verificado:</strong>{' '}
            <Skeleton height={20} width={100} />
          </p>
          <p>
            <strong>Rol:</strong> <Skeleton height={20} width={100} />
          </p>
        </div>
      </div>
    </div>
  );
}
