import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function LoadingPage() {
  return (
    <table className="min-w-full">
      <thead className="bg-gray-200 border-b">
        <tr>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Imagen
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Título
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Precio
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Género
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Inventario
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Sizes
          </th>
        </tr>
      </thead>
      <tbody>
        {[1, 2, 3, 4, 5].map((index) => (
          <tr key={index} className="bg-white border-b">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              <Skeleton circle={true} width={40} height={40} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-light text-gray-900">
              <Skeleton width={120} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
              <Skeleton width={60} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-light text-gray-900">
              <Skeleton width={40} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
              <Skeleton width={40} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
              <Skeleton width={80} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
