import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  image: string;
  name: string;
  summary: string;
  slug: string;
  className?: string;
}

const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  ({ image, name, summary, slug, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden ${className || ''}`}
        {...props}
      >
        <Link href={`/shop/${slug}`} className="block group">
          <div className="aspect-w-16 aspect-h-9 relative h-48">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {name}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              {summary}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors">
                Learn More →
              </span>
            </div>
          </div>
        </Link>
      </div>
    );
  }
);

ProductCard.displayName = 'ProductCard';

export default ProductCard;