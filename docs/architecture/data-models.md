# Data Models

## Product
Purpose: Represents any sellable or quotable item in the catalog.

**TypeScript Interface**

```typescript
enum ProductType {
  UAV,
  PAYLOAD,
  ACCESSORY,
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  type: ProductType;
  specifications: Record<string, any>;
  imageUrl: string;
  quoteOnly: boolean;
}
```

## User
Purpose: Represents an authenticated user of the application, managed by NextAuth.js.

**TypeScript Interface**

```typescript
interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
}
```

## Order
Purpose: Represents a completed purchase transaction for accessory items.

**TypeScript Interface**

```typescript
enum OrderStatus {
  PENDING,
  COMPLETED,
  FAILED,
}

interface Order {
  id: string;
  amount: number;
  status: OrderStatus;
  stripePaymentIntentId: string;
  userId: string;
}
```

## OrderItem
Purpose: Represents a single line item within an Order.

**TypeScript Interface**

```typescript
interface OrderItem {
  id: string;
  quantity: number;
  orderId: string;
  productId: string;
}
```