import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function LoadingPage() {
  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Carrito */}
          <div className="flex flex-col mt-5">
            <h2 className="text-2xl mb-5">
              <Skeleton height={30} width={200} />
            </h2>

            {/* Items */}
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex mb-5">
                <Skeleton height={100} width={100} className="mr-5 rounded" />
                <div>
                  <p>
                    <Skeleton height={20} width={200} />
                  </p>
                  <p>
                    <Skeleton height={20} width={100} />
                    <Skeleton height={20} width={50} />
                  </p>
                  <p className="font-semibold">
                    <Skeleton height={20} width={100} />
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout - Resumen de orden */}
          <div className="bg-white rounded-xl shadow-xl p-7 h-fit">
            <h2 className="text-2xl mb-2 font-bold">
              <Skeleton height={30} width={300} />
            </h2>
            <div className="mb-10">
              <Skeleton height={20} width={300} />
              <Skeleton height={20} width={300} />
              <Skeleton height={20} width={300} />
              <Skeleton height={20} width={300} />
              <Skeleton height={20} width={300} />
              <Skeleton height={20} width={300} />
              <Skeleton height={20} width={300} />
            </div>

            {/* Divider */}
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10"></div>

            <h2 className="text-2xl mb-2">
              <Skeleton height={30} width={200} />
            </h2>

            <div className="grid grid-cols-2">
              <span>
                <Skeleton height={20} width={100} />
              </span>
              <span className="text-right">
                <Skeleton height={20} width={100} />
              </span>

              <span>
                <Skeleton height={20} width={100} />
              </span>
              <span className="text-right">
                <Skeleton height={20} width={100} />
              </span>

              <span className="mt-5 text-2xl font-semibold">
                <Skeleton height={30} width={100} />
              </span>
              <span className="mt-5 text-2xl text-right font-semibold">
                <Skeleton height={30} width={100} />
              </span>
            </div>

            <div className="mt-10 w-full">
              <Skeleton height={40} width={200} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
