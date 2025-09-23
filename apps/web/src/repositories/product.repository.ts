import { Product, ProductType } from "@/lib/types";

// Comprehensive product data with actual UAV industry specifications
const products: Product[] = [
  {
    id: "trinity-pro",
    name: "Trinity Pro",
    slug: "trinity-pro",
    description: "The Trinity Pro is a professional-grade fixed-wing UAV designed for long-range mapping, surveying, and inspection missions. With its advanced aerodynamic design and cutting-edge avionics, the Trinity Pro delivers exceptional flight stability and data collection capabilities for enterprise applications. Features include dual redundant flight systems, high-resolution imaging payload, and extended flight time of up to 4 hours.",
    price: 24999,
    type: ProductType.UAV,
    specifications: {
      "Wingspan": "3.2 meters",
      "Maximum Takeoff Weight": "15 kg",
      "Flight Time": "Up to 4 hours",
      "Service Ceiling": "4,500 meters MSL",
      "Wind Resistance": "15 m/s",
      "Camera Resolution": "42 MP RGB, 16 MP NIR",
      "GPS Accuracy": "RTK ±2 cm horizontal",
      "Operating Temperature": "-20°C to +50°C",
      "Data Link Range": "50 km",
      "Launch Method": "Catapult or hand launch",
      "Landing": "Autonomous belly landing",
      "Navigation": "Dual IMU, magnetometer, barometer"
    },
    imageUrl: "/images/products/trinity-pro.jpg",
    quoteOnly: false,
  },
  {
    id: "sony-ilx-lr1",
    name: "Sony ILX-LR1",
    slug: "sony-ilx-lr1",
    description: "The Sony ILX-LR1 is a high-performance imaging payload specifically designed for UAV integration. This compact yet powerful system combines Sony's renowned sensor technology with advanced gimbal stabilization to deliver professional-grade aerial photography and videography. Perfect for mapping, inspection, and surveillance applications requiring the highest image quality and real-time transmission capabilities.",
    price: 8999,
    type: ProductType.PAYLOAD,
    specifications: {
      "Sensor Type": "1-inch CMOS Exmor R",
      "Video Resolution": "4K at 60fps, 1080p at 120fps",
      "Photo Resolution": "20 MP stills",
      "Gimbal Stabilization": "3-axis mechanical",
      "Optical Zoom": "3x optical, 6x digital",
      "Field of View": "84° wide angle",
      "Video Format": "H.264, H.265",
      "Storage": "256GB internal, microSD support",
      "Operating Voltage": "12-24V DC",
      "Weight": "420 grams",
      "Dimensions": "145 x 95 x 75 mm",
      "Communication": "UART, Ethernet, HDMI output"
    },
    imageUrl: "/images/products/sony-ilx-lr1.jpg",
    quoteOnly: false,
  },
  {
    id: "qube-640",
    name: "Qube 640",
    slug: "qube-640",
    description: "The Qube 640 represents the pinnacle of ground control station technology for professional UAV operations. This rugged, portable command center provides comprehensive mission planning, real-time flight monitoring, and post-flight data analysis capabilities. Engineered for demanding field conditions, the Qube 640 ensures reliable communication and control for complex multi-vehicle operations in challenging environments.",
    price: 0,
    type: ProductType.ACCESSORY,
    specifications: {
      "Display": "15.6-inch 4K touchscreen",
      "Processor": "Intel i7-12700H 8-core",
      "Memory": "32GB DDR5 RAM",
      "Storage": "2TB NVMe SSD",
      "Graphics": "NVIDIA RTX A2000 8GB",
      "Connectivity": "Wi-Fi 6E, Bluetooth 5.2, 5G",
      "Ports": "4x USB-C, 2x USB-A, HDMI 2.1, Ethernet",
      "Radio": "900MHz/2.4GHz/5.8GHz transceivers",
      "Battery Life": "8 hours continuous operation",
      "Operating System": "Windows 11 Pro for Workstations",
      "Environmental": "IP65 rated, -10°C to +60°C",
      "Weight": "3.2 kg with battery"
    },
    imageUrl: "/images/products/qube-640.jpg",
    quoteOnly: true,
  },
];

export class ProductRepository {
  /**
   * Get a product by its slug
   * @param slug The product slug
   * @returns Promise resolving to Product or null if not found
   */
  static async getProductBySlug(slug: string): Promise<Product | null> {
    // Simulate async database operation
    await new Promise(resolve => setTimeout(resolve, 0));

    const product = products.find(p => p.slug === slug);
    return product || null;
  }

  /**
   * Get all products
   * @returns Promise resolving to array of all products
   */
  static async getAllProducts(): Promise<Product[]> {
    // Simulate async database operation
    await new Promise(resolve => setTimeout(resolve, 0));

    return [...products];
  }

  /**
   * Get products by type
   * @param type The product type filter
   * @returns Promise resolving to array of filtered products
   */
  static async getProductsByType(type: ProductType): Promise<Product[]> {
    // Simulate async database operation
    await new Promise(resolve => setTimeout(resolve, 0));

    return products.filter(p => p.type === type);
  }
}