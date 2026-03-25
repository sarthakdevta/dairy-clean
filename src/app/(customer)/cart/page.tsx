"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag, Tag } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const { items, increaseQty, decreaseQty, removeFromCart } = useCartStore();

  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  // ✅ CALCULATIONS
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const discount = couponApplied ? subtotal * 0.2 : 0;
  const delivery = subtotal >= 30 ? 0 : 4.99;
  const total = subtotal - discount + delivery;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/products" className="p-2 rounded-xl hover:bg-muted">
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <h1 className="text-2xl font-bold">Shopping Cart</h1>

        <span className="px-2 py-0.5 bg-primary/10 text-primary text-sm rounded-full font-medium">
          {items.length} items
        </span>
      </div>

      {/* EMPTY STATE */}
      {items.length === 0 ? (
        <div className="text-center py-24">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Add some products to get started
          </p>

          <Link
            href="/products"
            className="inline-flex px-6 py-3 bg-primary text-white rounded-xl font-semibold"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* CART ITEMS */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white border p-4 rounded-xl flex items-center gap-4"
              >
                {/* IMAGE */}
                <div className="w-20 h-20 bg-muted rounded-xl overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* DETAILS */}
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>

                  {/* ✅ SAFE ACCESS */}
                  {(item as any).weight && (
  <p className="text-sm text-muted-foreground">
    {(item as any).weight}
  </p>
)}

                  <p className="text-primary font-bold mt-1">
                    ₹{item.price}
                  </p>
                </div>

                {/* QTY CONTROLS */}
                <div className="flex items-center gap-2">
                  <div className="flex border rounded-lg overflow-hidden">
                    <button
                      onClick={() => decreaseQty(item.id)}
                      className="px-2 py-2 hover:bg-muted"
                    >
                      <Minus className="w-3 h-3" />
                    </button>

                    <span className="w-8 text-center font-semibold">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => increaseQty(item.id)}
                      className="px-2 py-2 hover:bg-muted"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* ITEM TOTAL */}
                  <div className="w-16 text-right font-bold">
                    ₹{item.price * item.quantity}
                  </div>

                  {/* DELETE */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* SUMMARY */}
          <div>
            <div className="bg-white border p-5 rounded-xl sticky top-24">
              <h2 className="font-bold text-lg mb-5">Order Summary</h2>

              {/* COUPON */}
              <div className="flex gap-2 mb-5">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />

                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Coupon code"
                    className="w-full pl-9 pr-3 py-2 border rounded-lg"
                  />
                </div>

                <button
                  className="px-3 py-2 bg-primary text-white rounded-lg"
                  onClick={() => {
                    if (coupon.toUpperCase() === "FRESH20") {
                      setCouponApplied(true);
                    }
                  }}
                >
                  Apply
                </button>
              </div>

              {couponApplied && (
                <p className="text-green-600 text-sm mb-3">
                  Coupon applied (20% off)
                </p>
              )}

              {/* CALCULATION */}
              <div className="space-y-3 border-t pt-4 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>

                {couponApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>
                    {delivery === 0 ? "Free" : `₹${delivery.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between font-bold border-t pt-2">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* ACTIONS */}
              <Link
                href="/checkout"
                className="w-full mt-5 flex justify-center py-3 bg-primary text-white rounded-xl font-semibold"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/products"
                className="w-full mt-3 flex justify-center py-2 border rounded-xl"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}