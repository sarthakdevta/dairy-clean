"use client";
import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, Clock, Send, Check } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-3">Get in Touch</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Have questions about our products or delivery? We're here to help! Reach out through any of the channels below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Contact Info */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20">
            <h2 className="font-bold text-lg mb-5">Contact Information</h2>
            <div className="space-y-4">
              {[
                { icon: Phone, label: "Phone", value: "+1 (555) 123-4567", sub: "Mon–Sat, 8am–8pm" },
                { icon: Mail, label: "Email", value: "hello@dairyfresh.com", sub: "We reply within 24 hours" },
                { icon: MapPin, label: "Address", value: "123 Dairy Farm Road", sub: "Freshville, CA 90210" },
                { icon: Clock, label: "Hours", value: "Mon–Sat: 8am–8pm", sub: "Sun: 10am–6pm" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{item.value}</div>
                    <div className="text-xs text-muted-foreground">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="rounded-2xl overflow-hidden border border-border h-48 bg-muted/40 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MapPin className="w-8 h-8 mx-auto mb-2" />
              <div className="text-sm">Map Placeholder</div>
              <div className="text-xs">123 Dairy Farm Road, Freshville</div>
            </div>
          </div>

          {/* WhatsApp */}
          <a
            href="https://wa.me/15551234567"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-2xl bg-green-50 border border-green-200 hover:bg-green-100 transition-colors"
          >
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-green-800 text-sm">Chat on WhatsApp</div>
              <div className="text-xs text-green-600">Get instant support</div>
            </div>
          </a>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="font-bold text-lg mb-6">Send us a Message</h2>

            {sent ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Message Sent!</h3>
                <p className="text-muted-foreground text-sm">We'll get back to you within 24 hours.</p>
                <button className="mt-5 px-5 py-2 border border-border rounded-xl text-sm hover:border-foreground transition-colors" onClick={() => setSent(false)}>
                  Send Another
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">First Name</label>
                    <input type="text" placeholder="John" className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Last Name</label>
                    <input type="text" placeholder="Doe" className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Email</label>
                  <input type="email" placeholder="john@example.com" className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Phone (optional)</label>
                  <input type="tel" placeholder="+1 (555) 000-0000" className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Subject</label>
                  <select className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm">
                    <option>Order Issue</option>
                    <option>Product Enquiry</option>
                    <option>Delivery Problem</option>
                    <option>Feedback</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Message</label>
                  <textarea rows={5} placeholder="Write your message here..." className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm resize-none" />
                </div>
                <button
                  className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors"
                  onClick={() => setSent(true)}
                >
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
