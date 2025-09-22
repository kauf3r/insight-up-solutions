# Database Schema

This schema will be located in prisma/schema.prisma.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum ProductType {
  UAV
  PAYLOAD
  ACCESSORY
}

model Product {
  id              String      @id @default(cuid())
  name            String
  slug            String      @unique
  description     String
  price           Float
  type            ProductType
  specifications  Json
  imageUrl        String
  quoteOnly       Boolean     @default(false)
  orderItems      OrderItem[]
}

model Order {
  id                    String      @id @default(cuid())
  amount                Float
  status                String      @default("PENDING")
  stripePaymentIntentId String      @unique
  userId                String
  user                  User        @relation(fields: [userId], references: [id])
  items                 OrderItem[]
  @@index([userId])
}

model OrderItem {
  id          String    @id @default(cuid())
  quantity    Int
  orderId     String
  order       Order     @relation(fields: [orderId], references: [id])
  productId   String
  product     Product   @relation(fields: [productId], references: [id])
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  orders        Order[]
}

// ... Standard NextAuth.js models (Account, Session, VerificationToken)
```