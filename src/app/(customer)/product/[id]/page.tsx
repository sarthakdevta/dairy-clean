"use client";

import { useState } from "react";
import Link from "next/link";
import { use } from "react";
import {
  Star,
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  ArrowLeft,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { products } from "@/lib/mock-data";
import { useCartStore } from "@/store/cartStore";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const product = products.find((p) => p.id === id) || products[0];

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const { addToCart } = useCartStore();

  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* BACK */}
      <Link
        href="/products"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </Link>

      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        {/* IMAGE */}
        <div>
          <div className="aspect-square rounded-3xl overflow-hidden bg-muted border">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* DETAILS */}
        <div>
          <h1 className="text-3xl font-bold mb-3">{product.name}</h1>

          {/* RATING */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm">{product.rating}</span>
          </div>

          {/* PRICE */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-primary">
              ₹{product.price}
            </span>

            {product.originalPrice && (
              <>
                <span className="line-through text-muted-foreground">
                  ₹{product.originalPrice}
                </span>

                <span className="text-green-600 text-sm font-medium">
                  Save ₹
                  {(product.originalPrice - product.price).toFixed(2)}
                </span>
              </>
            )}
          </div>

          {/* DESC */}
          <p className="text-muted-foreground mb-6">
            {product.description}
          </p>

          {/* WEIGHT */}
          <p className="mb-6">
            <span className="text-muted-foreground">Weight: </span>
            <span className="font-medium">{product.weight}</span>
          </p>

          {/* QTY */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex border rounded">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-3 py-2"
              >
                <Minus />
              </button>

              <span className="px-4 py-2">{qty}</span>

              <button
                onClick={() => setQty(qty + 1)}
                className="px-3 py-2"
              >
                <Plus />
              </button>
            </div>

            {/* ADD TO CART */}
            <button
              disabled={!product.inStock}
              onClick={() => {
                for (let i = 0; i < qty; i++) {
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    weight: product.weight,
                  });
                }
                alert("Added to cart");
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl"
            >
              <ShoppingCart className="w-4 h-4" />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>

          {/* FEATURES */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Truck, text: "Free Delivery" },
              { icon: Shield, text: "Quality" },
              { icon: RotateCcw, text: "Returns" },
            ].map((f, i) => (
              <div key={i} className="text-center p-3 bg-muted rounded">
                <f.icon className="mx-auto mb-1" />
                <p className="text-xs">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RELATED */}
      {related.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">
            Related Products
          </h2>

          <div className="grid sm:grid-cols-3 gap-4">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/product/${p.id}`}
                className="border rounded-xl p-3"
              >
                <img
                  src={p.image}
                  className="w-full h-40 object-cover mb-2"
                />
                <p className="font-semibold">{p.name}</p>
                <p className="text-primary font-bold">
                  ₹{p.price}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}