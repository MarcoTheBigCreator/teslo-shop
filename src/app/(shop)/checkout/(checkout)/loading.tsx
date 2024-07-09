import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function LoadingPage() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex mb-5">
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
            <Skeleton width={100} height={100} />
          </div>
          <div className="ml-5 flex-1">
            <Skeleton height={20} width={150} />
            <Skeleton height={20} width={100} />
          </div>
        </div>
      ))}
    </>
  );
}
