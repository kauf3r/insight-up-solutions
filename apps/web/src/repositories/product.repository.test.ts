import { describe, it, expect } from 'vitest';
import { ProductRepository } from './product.repository';
import { ProductType } from '@/lib/types';

describe('ProductRepository', () => {
  describe('getProductBySlug', () => {
    it('should return Trinity Pro product for valid slug', async () => {
      const product = await ProductRepository.getProductBySlug('trinity-pro');

      expect(product).toBeDefined();
      expect(product!.name).toBe('Trinity Pro');
      expect(product!.slug).toBe('trinity-pro');
      expect(product!.type).toBe(ProductType.UAV);
      expect(product!.quoteOnly).toBe(false);
      expect(product!.price).toBe(24999);
      expect(product!.specifications).toHaveProperty('Wingspan');
      expect(product!.imageUrl).toBe('/images/products/trinity-pro.jpg');
    });

    it('should return Sony ILX-LR1 product for valid slug', async () => {
      const product = await ProductRepository.getProductBySlug('sony-ilx-lr1');

      expect(product).toBeDefined();
      expect(product!.name).toBe('Sony ILX-LR1');
      expect(product!.slug).toBe('sony-ilx-lr1');
      expect(product!.type).toBe(ProductType.PAYLOAD);
      expect(product!.quoteOnly).toBe(false);
      expect(product!.price).toBe(8999);
      expect(product!.specifications).toHaveProperty('Sensor Type');
      expect(product!.imageUrl).toBe('/images/products/sony-ilx-lr1.jpg');
    });

    it('should return Qube 640 product for valid slug', async () => {
      const product = await ProductRepository.getProductBySlug('qube-640');

      expect(product).toBeDefined();
      expect(product!.name).toBe('Qube 640');
      expect(product!.slug).toBe('qube-640');
      expect(product!.type).toBe(ProductType.ACCESSORY);
      expect(product!.quoteOnly).toBe(true);
      expect(product!.price).toBe(0);
      expect(product!.specifications).toHaveProperty('Display');
      expect(product!.imageUrl).toBe('/images/products/qube-640.jpg');
    });

    it('should return null for invalid slug', async () => {
      const product = await ProductRepository.getProductBySlug('non-existent-product');
      expect(product).toBeNull();
    });

    it('should return null for empty slug', async () => {
      const product = await ProductRepository.getProductBySlug('');
      expect(product).toBeNull();
    });

    it('should handle case sensitivity correctly', async () => {
      const product = await ProductRepository.getProductBySlug('Trinity-Pro');
      expect(product).toBeNull();
    });
  });

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      const products = await ProductRepository.getAllProducts();

      expect(products).toHaveLength(3);
      expect(products.map(p => p.slug)).toEqual(['trinity-pro', 'sony-ilx-lr1', 'qube-640']);
    });

    it('should return products with all required properties', async () => {
      const products = await ProductRepository.getAllProducts();

      products.forEach(product => {
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('slug');
        expect(product).toHaveProperty('description');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('type');
        expect(product).toHaveProperty('specifications');
        expect(product).toHaveProperty('imageUrl');
        expect(product).toHaveProperty('quoteOnly');

        expect(typeof product.id).toBe('string');
        expect(typeof product.name).toBe('string');
        expect(typeof product.slug).toBe('string');
        expect(typeof product.description).toBe('string');
        expect(typeof product.price).toBe('number');
        expect(Object.values(ProductType)).toContain(product.type);
        expect(typeof product.specifications).toBe('object');
        expect(typeof product.imageUrl).toBe('string');
        expect(typeof product.quoteOnly).toBe('boolean');
      });
    });

    it('should return products with valid specifications', async () => {
      const products = await ProductRepository.getAllProducts();

      products.forEach(product => {
        expect(Object.keys(product.specifications).length).toBeGreaterThan(0);
        Object.entries(product.specifications).forEach(([key, value]) => {
          expect(typeof key).toBe('string');
          expect(typeof value).toBe('string');
          expect(key.length).toBeGreaterThan(0);
          expect(value.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('getProductsByType', () => {
    it('should return UAV products only', async () => {
      const products = await ProductRepository.getProductsByType(ProductType.UAV);

      expect(products).toHaveLength(1);
      expect(products[0].name).toBe('Trinity Pro');
      expect(products[0].type).toBe(ProductType.UAV);
    });

    it('should return PAYLOAD products only', async () => {
      const products = await ProductRepository.getProductsByType(ProductType.PAYLOAD);

      expect(products).toHaveLength(1);
      expect(products[0].name).toBe('Sony ILX-LR1');
      expect(products[0].type).toBe(ProductType.PAYLOAD);
    });

    it('should return ACCESSORY products only', async () => {
      const products = await ProductRepository.getProductsByType(ProductType.ACCESSORY);

      expect(products).toHaveLength(1);
      expect(products[0].name).toBe('Qube 640');
      expect(products[0].type).toBe(ProductType.ACCESSORY);
    });
  });

  describe('data integrity', () => {
    it('should have consistent slug and id for each product', async () => {
      const products = await ProductRepository.getAllProducts();

      products.forEach(product => {
        expect(product.id).toBe(product.slug);
      });
    });

    it('should have unique slugs for all products', async () => {
      const products = await ProductRepository.getAllProducts();
      const slugs = products.map(p => p.slug);
      const uniqueSlugs = new Set(slugs);

      expect(uniqueSlugs.size).toBe(slugs.length);
    });

    it('should have valid image URLs', async () => {
      const products = await ProductRepository.getAllProducts();

      products.forEach(product => {
        expect(product.imageUrl).toMatch(/^\/images\/products\/.+\.(jpg|jpeg|png|webp)$/);
      });
    });

    it('should have proper price validation', async () => {
      const products = await ProductRepository.getAllProducts();

      products.forEach(product => {
        expect(product.price).toBeGreaterThanOrEqual(0);
        if (product.quoteOnly) {
          expect(product.price).toBe(0);
        } else {
          expect(product.price).toBeGreaterThan(0);
        }
      });
    });

    it('should have descriptions of reasonable length', async () => {
      const products = await ProductRepository.getAllProducts();

      products.forEach(product => {
        expect(product.description.length).toBeGreaterThan(100);
        expect(product.description.length).toBeLessThan(1000);
      });
    });
  });

  describe('async behavior', () => {
    it('should handle multiple concurrent calls correctly', async () => {
      const promises = [
        ProductRepository.getProductBySlug('trinity-pro'),
        ProductRepository.getProductBySlug('sony-ilx-lr1'),
        ProductRepository.getProductBySlug('qube-640'),
        ProductRepository.getAllProducts()
      ];

      const results = await Promise.all(promises);

      expect(results[0]!.name).toBe('Trinity Pro');
      expect(results[1]!.name).toBe('Sony ILX-LR1');
      expect(results[2]!.name).toBe('Qube 640');
      expect(results[3]).toHaveLength(3);
    });

    it('should return a new array instance each time', async () => {
      const products1 = await ProductRepository.getAllProducts();
      const products2 = await ProductRepository.getAllProducts();

      expect(products1).not.toBe(products2);
      expect(products1).toEqual(products2);
    });
  });
});