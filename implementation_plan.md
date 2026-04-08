# Lenzify Storefront Architecture & Advanced E-Commerce Plan

This document outlines the architectural changes and additions required to build out the requested features for Lenzify, including the comprehensive storefront, product filtering engine, detailed product pages, and database schema updates.

## User Review Required

> [!WARNING]
> **Database Schema Changes Needed**
> You requested specific array columns (`gender[]`, `type[]`, `collection[]`, `colors[]`, `sizes[]`) in the Supabase PostgreSQL database. Currently, some of these are stored as comma-separated strings or embedded inside JSON. 
> 
> I will provide a migration SQL script (`migration.sql`) to run in your Supabase SQL Editor to alter the table securely. Please confirm if this is acceptable, or if you prefer I try to implement filtering without altering the database schema using advanced JSON querying.

> [!IMPORTANT]
> **Component Libraries**
> I will use standard Tailwind CSS classes to build the modernized e-commerce layouts. For sliders and interactive components (like Price Range Sliders), we may need lightweight packages like `rc-slider` or simple native multi-range sliders. Please let me know if you have specific restrictions on installing npm packages.

## Proposed Changes

---

### Phase 1: Database Migration & Admin Polish
We need to sync the backend with your 15-point specifications.

#### [NEW] `supabase_migration.sql`
- Create an SQL script containing:
  - `ALTER TABLE products RENAME COLUMN offer_price TO discount_price;`
  - Array casting for `gender`, `material`, `frame_type`.
  - Adding new array columns: `type`, `collection`, `colors`, `sizes`.

#### [MODIFY] `src/app/admin/products/actions.ts`
- Update the `createProduct` and `updateProduct` forms to map the multi-select checkbox values directly into native PostgreSQL arrays instead of concatenating them or embedding them in the `specifications` JSON.

#### [MODIFY] `src/app/admin/layout.tsx` (Admin Dashboard Sidebar)
- Update the admin sidebar routes to strictly include: Dashboard, Products, Add Product, Categories, Orders, Customers, Brands, Collections, Inventory, Settings.

---

### Phase 2: Navigation & Homepage Architecture
Building the structural user-facing components.

#### [MODIFY] `src/app/page.tsx`
- Refactor to include all specific categories (Men, Women, Kids, Eyeglasses...).
- Insert dynamic sections: "New Arrivals", "Trending Products", "Best Sellers", "Brands".
- Ensure category cards correctly navigate to URLs like `/products?type=sunglasses`.

#### [NEW/MODIFY] Layout & Header
- Implement a global unified Navbar with links to categories, Wishlist, Cart, and Search bar capability.
- Ensure the footer matches the "Modern optical store" UI.

---

### Phase 3: The Products & Discovery Engine (Filtering)

#### [NEW] `src/app/products/page.tsx`
- Implement the requested **Two-column layout**:
  - **Left side (Sticky Filters)**: Checkbox multi-select groups for Category (Gender/Type), Brands, Colors, Sizes, Frame Type, Material, Collection, and a Price Range Slider.
  - **Right side (Grid)**: Display `ProductCard` arrays dynamically fetched from Supabase.
- Implement strictly query-param bound state (e.g. `?gender=men&color=black&price=0-2000`) so users can share filter links.
- Apply Supabase Native Array filtering (`.contains()`, `.overlaps()`) to power multi-select checkbox queries on the backend safely.

#### [MODIFY/NEW] `src/components/store/ProductCard.tsx`
- Improve the product card with: Product Image, Discount Badge, Wishlist Icon, Title, crossed-out Old Price, current Price, Add to Cart button, and hover effects.

---

### Phase 4: Product Detail Page & Cart 

#### [NEW] `src/app/product/[id]/page.tsx`
- Build a dedicated, full-featured product page layout matching modern e-commerce paradigms.
- Features: Image gallery carousel, Title, Pricing & Discounts, Dynamic Size/Color selector blocks, Add to Cart / Buy Now triggers, Description accordion, Specifications table, and a "Related Products" dynamic fetching row.

#### [NEW] Extra Features
- Setup Wishlist functionality (leveraging Context or LocalStorage if auth is only for admins).
- Sorting (`order` queries for price/newest), Pagination.

## Open Questions

1. **Category Mapping Logic:** Since "Categories" historically had their own database table (`categories(id, name)`), and you've requested `type[]` on the `products` table directly — are we deprecating the `categories` table and moving strictly to the `type[]` array column, or do you want to maintain both?
2. **Filter counts:** Calculating dynamic live counts (e.g., "Men (24)") for every filter is extremely heavy on databases. Should we skip strict dynamic counts for performance, or implement a lighter version?
3. **Cart & Wishlist State:** Should Wishlist and Cart be stored in localstorage (Zustand context), or do we expect a `users`/`customers` table for authenticated public visitors later?

## Verification Plan
1. **Frontend**: I will write the code and navigate around using the browser subagent to verify the query parameters correctly fetch and render filtered products.
2. **Backend**: Provide you the `migration.sql` to execute in the Supabase UI and confirm success before deploying UI changes to avoid crashes.
