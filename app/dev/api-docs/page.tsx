// app/dev/api-docs/page.tsx
import React from "react";

export default function APIDocsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10 text-sm leading-6 text-gray-800">
      <h1 className="text-2xl font-bold mb-6">🛠️ E-Commerce API Documentation</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">🛒 Cart Endpoints</h2>

        <div className="mb-4">
          <h3 className="font-bold">POST /api/cart/add</h3>
          <p>Adds a product to the user’s cart or updates quantity if it exists.</p>
          <code>{`{ "userId": "USER123", "productId": "PROD456", "quantity": 1 }`}</code>
        </div>

        <div className="mb-4">
          <h3 className="font-bold">GET /api/cart?userId=USER123</h3>
          <p>Fetch all items in the user’s cart.</p>
        </div>

        <div className="mb-4">
          <h3 className="font-bold">PATCH /api/cart/modify</h3>
          <p>Change product quantity in the cart.</p>
          <code>{`{ "userId": "USER123", "productId": "PROD456", "quantity": 3 }`}</code>
        </div>

        <div className="mb-4">
          <h3 className="font-bold">DELETE /api/cart/clear?userId=USER123</h3>
          <p>Clear the entire cart.</p>
        </div>

        <div className="mb-4">
          <h3 className="font-bold">DELETE /api/cart/delete?userId=USER123&productId=PROD456
          </h3>
          <p>Remove a specific product from the cart.</p>
          <p><strong>Request Body:</strong></p>
          <code>{`{ "userId": "USER123", "productId": "PROD456" }`}</code>
        </div>

      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">💖 Wishlist Endpoints</h2>

        <div className="mb-4">
          <h3 className="font-bold">POST /api/wishlist/add</h3>
          <p>Add or remove a product from the wishlist (toggle).</p>
          <code>{`{ "userId": "USER123", "productId": "PROD456" }`}</code>
        </div>

        <div className="mb-4">
          <h3 className="font-bold">GET /api/wishlist?userId=USER123</h3>
          <p>Get all wishlist items for a user.</p>
        </div>

        <div className="mb-4">
          <h3 className="font-bold">DELETE /api/wishlist/delete?userId=USER123&productId=PROD456</h3>
          <p>Remove one product from the wishlist using query parameters.</p>
        </div>


        <div className="mb-4">
          <h3 className="font-bold">DELETE /api/wishlist/clear?userId=USER123</h3>
          <p>Clear the entire wishlist.</p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">🔁 Sync Behavior</h2>
        <p>
          All endpoints use <code>userId</code> to keep cart and wishlist in sync
          across devices automatically.
        </p>
        <p className="mt-2">
          (Optional) You can merge guest cart (stored in <code>localStorage</code>)
          into the server cart after user login.
        </p>
      </section>
    </main>
  );
}
