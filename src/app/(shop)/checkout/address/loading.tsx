import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function LoadingPage() {
  return (
    <div className="flex flex-col sm:justify-center sm:items-center mb-72 px-10 sm:px-0">
      <div className="w-full xl:w-[1000px] flex flex-col justify-center text-left">
        <Skeleton height={40} width={200} />
        <form className="grid grid-cols-1 gap-2 sm:gap-5 sm:grid-cols-2">
          {/* Placeholder for inputs */}
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="flex flex-col mb-2">
              <Skeleton height={40} />
            </div>
          ))}
          <div className="flex flex-col mb-2 sm:mb-1">
            <Skeleton height={40} />
            <Skeleton height={40} width={150} />
          </div>
        </form>
      </div>
    </div>
  );
}
