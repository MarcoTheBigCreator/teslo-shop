import Image from 'next/image';

interface Props {
  src?: string;
  alt: string;
  style?: React.StyleHTMLAttributes<HTMLImageElement>['style'];
  className?: React.StyleHTMLAttributes<HTMLImageElement>['className'];
  width: number;
  height: number;
  quality?: number;
}
export const ProductImage = ({
  src,
  alt,
  className,
  width,
  height,
  style,
  quality,
}: Props) => {
  const localsrc = src
    ? src.startsWith('http')
      ? src
      : `/products/${src}`
    : '/imgs/placeholder.jpg';

  return (
    <Image
      src={localsrc}
      width={width}
      height={height}
      alt={alt}
      aria-label={alt}
      className={className}
      style={style}
      quality={quality}
    />
  );
};
