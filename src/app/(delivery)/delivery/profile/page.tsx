"use client";
import { Save, Star, Truck, CheckCircle, Phone, Mail, MapPin } from "lucide-react";

export default function DeliveryProfilePage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-muted-foreground text-sm">Manage your delivery agent profile</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors text-sm">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div>
          <div className="bg-white rounded-2xl border border-border p-6 text-center mb-5">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-3xl mx-auto mb-4">J</div>
            <h2 className="text-xl font-bold mb-1">John Doe</h2>
            <p className="text-muted-foreground text-sm mb-3">Delivery Agent · Zone: North</p>
            <div className="flex items-center justify-center gap-1 text-yellow-500 mb-4">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-500" />)}
              <span className="text-sm ml-1 text-foreground font-semibold">4.9</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/40 rounded-xl p-3">
                <div className="text-lg font-bold flex items-center gap-1 justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" /> 52
                </div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div className="bg-muted/40 rounded-xl p-3">
                <div className="text-lg font-bold flex items-center gap-1 justify-center">
                  <Truck className="w-4 h-4 text-blue-600" /> 2
                </div>
                <div className="text-xs text-muted-foreground">Active</div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <h3 className="font-semibold mb-3">Contact</h3>
            <div className="space-y-2">
              {[
                { icon: Phone, value: "+1 (555) 901-2345" },
                { icon: Mail, value: "john.doe@dairyfresh.com" },
                { icon: MapPin, value: "North Zone, Freshville" },
              ].map((item) => (
                <div key={item.value} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <item.icon className="w-4 h-4 text-primary shrink-0" />
                  {item.value}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-border p-5">
            <h2 className="font-semibold mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">First Name</label>
                  <input type="text" defaultValue="John" className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Last Name</label>
                  <input type="text" defaultValue="Doe" className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Phone Number</label>
                <input type="tel" defaultValue="+1 (555) 901-2345" className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <input type="email" defaultValue="john.doe@dairyfresh.com" className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border p-5">
            <h2 className="font-semibold mb-4">Vehicle & Zone</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Vehicle Type</label>
                  <select className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm">
                    <option>Motorcycle</option>
                    <option>Car</option>
                    <option>Bicycle</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Vehicle Number</label>
                  <input type="text" defaultValue="CA-1234-AB" className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Delivery Zone</label>
                <select defaultValue="North" className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm">
                  <option>North</option>
                  <option>South</option>
                  <option>East</option>
                  <option>West</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border p-5">
            <h2 className="font-semibold mb-4">Change Password</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Confirm Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
