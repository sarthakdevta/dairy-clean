"use client";

import Link from "next/link";
import { ArrowRight, Truck, Shield, Leaf, Clock, Star } from "lucide-react";
import { products, categories, testimonials } from "@/lib/mock-data";
import { useCartStore } from "@/store/cartStore";

function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-primary/10 via-secondary/30 to-white py-20 px-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 text-center lg:text-left">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            🥛 Farm Fresh Daily
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
            Pure Dairy,<br />
            <span className="text-primary">Fresh Every Day</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl">
            Enjoy the finest quality dairy products delivered straight from local farms to your doorstep. 
            Fresh milk, artisan cheese, creamy butter and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <Link href="/products" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors">
              Order Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/products" className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-primary text-primary rounded-xl font-semibold hover:bg-primary/5 transition-colors">
              Browse Products
            </Link>
          </div>
          <div className="flex items-center justify-center lg:justify-start gap-6 mt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> 4.9/5 Rating</div>
            <div>·</div>
            <div>10,000+ Happy Customers</div>
            <div>·</div>
            <div>Free delivery over $30</div>
          </div>
        </div>
        <div className="flex-1 relative">
          <div className="w-full max-w-md mx-auto aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/40 flex items-center justify-center text-9xl shadow-xl">
            🥛
          </div>
          <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg p-3 flex items-center gap-2">
            <span className="text-2xl">🧀</span>
            <div className="text-xs"><div className="font-bold">Aged Cheddar</div><div className="text-primary">$5.99</div></div>
          </div>
          <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-3 flex items-center gap-2">
            <span className="text-2xl">🧈</span>
            <div className="text-xs"><div className="font-bold">Fresh Butter</div><div className="text-primary">$2.49</div></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategorySection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Shop by Category</h2>
          <p className="text-muted-foreground">Explore our wide range of fresh dairy products</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/products?category=${cat.slug}`} className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border border-border hover:border-primary hover:shadow-md transition-all group">
              <span className="text-4xl group-hover:scale-110 transition-transform">{cat.icon}</span>
              <div className="text-center">
                <div className="font-semibold text-sm">{cat.name}</div>
                <div className="text-xs text-muted-foreground">{cat.count} items</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedProducts() {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-1">Featured Products</h2>
            <p className="text-muted-foreground">Hand-picked fresh dairy items</p>
          </div>
          <Link href="/products" className="hidden sm:flex items-center gap-1 text-primary font-medium hover:underline">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <Link key={product.id} href={`/product/${product.id}`} className="bg-white rounded-2xl border border-border hover:shadow-lg transition-all group overflow-hidden">
              <div className="relative aspect-square bg-muted/30 overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                {product.badge && (
                  <span className="absolute top-3 left-3 px-2 py-0.5 bg-primary text-white text-xs font-semibold rounded-full">{product.badge}</span>
                )}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="bg-white text-foreground text-sm font-semibold px-3 py-1 rounded-full">Out of Stock</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="text-xs text-muted-foreground mb-1">{product.categoryName}</div>
                <h3 className="font-semibold mb-2">{product.name}</h3>
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs text-muted-foreground">{product.rating} ({product.reviews})</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-primary">${product.price}</span>
                    {product.originalPrice && <span className="text-xs text-muted-foreground line-through ml-1">${product.originalPrice}</span>}
                  </div>
                  {/* ✅ FIXED: Add to Cart Button with quantity */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart({
  id: product.id,
  name: product.name,
  price: product.price,
  image: product.image,
  weight: product.weight,
});
                    }}
                    className="px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8 sm:hidden">
          <Link href="/products" className="inline-flex items-center gap-1 text-primary font-medium">
            View All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function WhyChooseUs() {
  const features = [
    { icon: Truck, title: "Free Delivery", desc: "Free delivery on all orders over $30. Same-day delivery available." },
    { icon: Shield, title: "100% Fresh", desc: "All products sourced fresh daily from certified local farms." },
    { icon: Leaf, title: "Organic Range", desc: "Certified organic options for health-conscious customers." },
    { icon: Clock, title: "Daily Fresh", desc: "Restocked every morning to ensure peak freshness." },
  ];
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Why Choose DairyFresh?</h2>
          <p className="text-muted-foreground">We're committed to bringing the best dairy products to your home</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="text-center p-6 rounded-2xl border border-border hover:border-primary/40 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">What Our Customers Say</h2>
          <p className="text-muted-foreground">Trusted by thousands of happy families</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl p-6 border border-border shadow-sm">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">"{t.comment}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PromoBanner() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-primary to-primary/70 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-sm font-medium opacity-80 mb-2">Limited Time Offer</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Get 20% Off Your First Order</h2>
            <p className="opacity-80">Use code <span className="font-bold bg-white/20 px-2 py-0.5 rounded">FRESH20</span> at checkout</p>
          </div>
          <Link href="/products" className="shrink-0 px-8 py-3 bg-white text-primary font-bold rounded-xl hover:bg-white/90 transition-colors">
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
      <WhyChooseUs />
      <PromoBanner />
      <Testimonials />
    </>
  );
}