import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function LoadingPage() {
  return (
    <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3">
      {/* slideshow */}
      <div className="col-span-1 md:col-span-2">
        {/* Mobile Slideshow Skeleton */}
        <div className="block md:hidden">
          <Skeleton height={300} />
        </div>

        {/* Desktop Slideshow Skeleton */}
        <div className="hidden md:block">
          <Skeleton height={500} />
        </div>
      </div>
      {/* detalles */}
      <div className="col-span-1 px-5">
        <div className="mb-5">
          <Skeleton height={30} width={150} />
        </div>
        <h1 className="antialiased font-bold text-xl">
          <Skeleton height={30} width={300} />
        </h1>
        <p className="text-lg mb-5">
          <Skeleton height={20} width={100} />
        </p>
        <div className="mb-5">
          <Skeleton height={40} />
        </div>
        <div className="mb-5">
          <Skeleton count={3} />
        </div>
        {/* Descripción */}
        <h3 className="font-bold text-sm">Descripción</h3>
        <div className="font-light">
          <Skeleton count={4} />
        </div>
      </div>
    </div>
  );
}
