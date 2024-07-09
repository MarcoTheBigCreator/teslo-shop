import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function LoadingPage() {
  return (
    <div className="px-5 sm:px-0">
      <div className="mb-2">
        <Skeleton height={30} width={200} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 mb-10">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <Skeleton height={500} width={500} />
            <Skeleton width={`80%`} />
            <Skeleton width={`60%`} />
          </div>
        ))}
      </div>
      <div className="flex justify-center text-center mt-10 mb-32">
        <div className="flex list-style-none">
          <div className="page-item">
            <Skeleton height={30} width={30} />
          </div>
          <div className="page-item">
            <Skeleton height={30} width={30} />
          </div>
          <div className="page-item">
            <Skeleton height={30} width={30} />
          </div>
        </div>
      </div>
    </div>
  );
}
