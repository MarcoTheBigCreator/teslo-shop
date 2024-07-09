import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function LoadingPage() {
  return (
    <>
      <Skeleton width={300} />

      <div className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3">
        {/* Textos */}
        <div className="w-full">
          <div className="flex flex-col mb-2">
            <span>Título</span>
            <Skeleton height={20} />
          </div>

          <div className="flex flex-col mb-2">
            <span>Slug</span>
            <Skeleton height={20} />
          </div>

          <div className="flex flex-col mb-2">
            <span>Descripción</span>
            <Skeleton height={80} />
          </div>

          <div className="flex flex-col mb-2">
            <span>Precio</span>
            <Skeleton height={20} />
          </div>

          <div className="flex flex-col mb-2">
            <span>Tags</span>
            <Skeleton height={20} />
          </div>

          <div className="flex flex-col mb-2">
            <span>Género</span>
            <Skeleton height={20} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col mb-2">
              <span>Categoría</span>
              <Skeleton height={20} />
            </div>
            <div className="flex flex-col mb-2">
              <span>Inventario</span>
              <Skeleton height={20} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col mb-2">
              <span>Tallas</span>
              <Skeleton height={20} />
            </div>
            <div className="flex flex-col mb-2">
              <span>Fotos</span>
              <Skeleton height={20} />
            </div>
          </div>

          <div className="flex justify-between mt-4 space-x-4">
            <Skeleton height={40} width={120} />
            <Skeleton height={40} width={120} />
          </div>
        </div>

        {/* Selector de tallas y fotos */}
        <div className="w-full">
          <div className="flex flex-col mb-2">
            <span>Inventario</span>
            <Skeleton height={20} />
          </div>

          <div className="flex flex-col">
            <span>Tallas</span>
            <Skeleton count={6} height={40} style={{ marginTop: '0.5rem' }} />
          </div>

          <div className="flex flex-col mb-2">
            <span>Fotos</span>
            <Skeleton count={3} height={200} style={{ marginTop: '0.5rem' }} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[1, 2, 3].map((index) => (
              <div key={index} className="relative w-full h-40">
                <Skeleton height={200} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
