"use client";

import { useState, useEffect } from "react";  // ✅ useEffect add karein
import { CreditCard, Smartphone, Building2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const deliverySlots = [
  { id: "1", date: "Today", time: "2:00 PM - 4:00 PM" },
  { id: "2", date: "Today", time: "4:00 PM - 6:00 PM" },
  { id: "3", date: "Tomorrow", time: "9:00 AM - 11:00 AM" },
];

const paymentMethods = [
  { id: "card", label: "Credit / Debit Card", icon: CreditCard },
  { id: "upi", label: "UPI / Digital Wallet", icon: Smartphone },
  { id: "cod", label: "Cash on Delivery", icon: Building2 },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();

  const [step, setStep] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState("1");
  const [selectedPayment, setSelectedPayment] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);  // ✅ State add karein

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // ✅ CALCULATIONS
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const delivery = subtotal > 50 ? 0 : 4.99;
  const total = subtotal + delivery;

  // ✅ FIX: Redirect in useEffect, not during render
  useEffect(() => {
    if (items.length === 0 && !isRedirecting) {
      setIsRedirecting(true);
      router.push("/products");
    }
  }, [items.length, router, isRedirecting]);

  // ✅ PLACE ORDER
  const placeOrder = async () => {
    if (!form.name || !form.phone || !form.address) {
      alert("Please fill all delivery details");
      return;
    }

    if (items.length === 0) {
      alert("Cart is empty");
      return;
    }

    setLoading(true);

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      alert("Please login to place an order");
      router.push("/login");
      setLoading(false);
      return;
    }

    try {
      const timestamp = Date.now().toString(36).toUpperCase();
      const random = Math.random().toString(36).substring(2, 8).toUpperCase();
      const orderNumber = `DF-${timestamp}-${random}`;

      const { error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            order_number: orderNumber,
            user_id: user.id,
            name: form.name,
            phone: form.phone,
            address: form.address,
            delivery_address: form.address,
            items: items,
            total_amount: subtotal,
            final_amount: total,
            delivery_charge: delivery,
            discount_amount: 0,
            status: "pending",
            payment_method: selectedPayment,
            payment_status: "pending",
            delivery_slot: selectedSlot,
          },
        ]);

      if (orderError) throw orderError;

      clearCart();
      alert(`Order placed successfully! 🎉\nOrder Number: ${orderNumber}`);
      router.push("/orders");
      router.refresh();
      
    } catch (error: any) {
      console.error("Order error:", error);
      alert("Failed to place order: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Loading state while redirecting
  if (isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      {/* STEPS Indicator */}
      <div className="flex gap-2 mb-6">
        {["Address", "Delivery", "Payment"].map((label, i) => (
          <div
            key={i}
            className={`px-3 py-1 rounded text-sm ${
              step === i + 1 ? "bg-primary text-white" : "bg-muted"
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* LEFT - Form Steps */}
        <div className="lg:col-span-2">
          {/* STEP 1: Address */}
          {step === 1 && (
            <div className="border p-6 rounded-xl">
              <h2 className="font-bold mb-4">Delivery Address</h2>
              <input
                placeholder="Full Name *"
                className="w-full border p-2 mb-3 rounded"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                placeholder="Phone *"
                className="w-full border p-2 mb-3 rounded"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <textarea
                placeholder="Address *"
                className="w-full border p-2 mb-3 rounded"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                rows={3}
              />
              <button
                className="w-full bg-primary text-white py-2 rounded disabled:opacity-50"
                onClick={() => {
                  if (!form.name || !form.phone || !form.address) {
                    alert("Fill all details");
                    return;
                  }
                  setStep(2);
                }}
              >
                Continue
              </button>
            </div>
          )}

          {/* STEP 2: Delivery Slot */}
          {step === 2 && (
            <div className="border p-6 rounded-xl">
              <h2 className="font-bold mb-4">Delivery Slot</h2>
              {deliverySlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot.id)}
                  className={`block w-full border p-3 mb-2 rounded ${
                    selectedSlot === slot.id
                      ? "bg-primary text-white"
                      : "hover:bg-muted"
                  }`}
                >
                  {slot.date} - {slot.time}
                </button>
              ))}
              <div className="flex gap-2 mt-4">
                <button 
                  className="px-4 py-2 border rounded"
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
                <button 
                  className="px-4 py-2 bg-primary text-white rounded"
                  onClick={() => setStep(3)}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment */}
          {step === 3 && (
            <div className="border p-6 rounded-xl">
              <h2 className="font-bold mb-4">Payment Method</h2>
              {paymentMethods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedPayment(m.id)}
                  className={`block w-full border p-3 mb-2 rounded flex items-center gap-2 ${
                    selectedPayment === m.id
                      ? "bg-primary text-white"
                      : "hover:bg-muted"
                  }`}
                >
                  <m.icon className="w-4 h-4" />
                  {m.label}
                </button>
              ))}
              <div className="flex gap-2 mt-4">
                <button 
                  className="px-4 py-2 border rounded"
                  onClick={() => setStep(2)}
                >
                  Back
                </button>
                <button
                  onClick={placeOrder}
                  disabled={loading}
                  className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {loading ? "Processing..." : `Pay ₹${total.toFixed(2)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT - Order Summary */}
        <div className="border p-4 rounded-xl h-fit">
          <h2 className="font-bold mb-4">Order Summary</h2>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm mb-2">
              <span>{item.name} x {item.quantity}</span>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t mt-3 pt-3 text-sm space-y-1">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>{delivery === 0 ? "Free" : `₹${delivery}`}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-2">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}