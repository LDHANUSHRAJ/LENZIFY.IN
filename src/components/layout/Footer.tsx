import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
        <div className="md:col-span-1">
          <Link href="/" className="font-display text-3xl font-bold tracking-widest uppercase mb-6 block">
            Lenzify
          </Link>
          <p className="text-white/60 text-sm leading-relaxed mb-8">
            The zenith of luxury eyewear. Experience precision optics engineered for visionaries.
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold uppercase tracking-widest text-sm mb-6 pb-2 border-b border-white/10 text-brand-gold">
            Collections
          </h4>
          <ul className="space-y-4 text-sm">
            <li><Link href="/spectacles" className="text-white/70 hover:text-white transition-colors">Premium Spectacles</Link></li>
            <li><Link href="/sunglasses" className="text-white/70 hover:text-white transition-colors">Designer Sunglasses</Link></li>
            <li><Link href="/lenses" className="text-white/70 hover:text-white transition-colors">Contact Lenses</Link></li>
            <li><Link href="/accessories" className="text-white/70 hover:text-white transition-colors">Accessories</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold uppercase tracking-widest text-sm mb-6 pb-2 border-b border-white/10 text-brand-gold">
            Support
          </h4>
          <ul className="space-y-4 text-sm">
            <li><Link href="/contact" className="text-white/70 hover:text-white transition-colors">Contact Us</Link></li>
            <li><Link href="/faq" className="text-white/70 hover:text-white transition-colors">FAQ</Link></li>
            <li><Link href="/shipping" className="text-white/70 hover:text-white transition-colors">Shipping & Returns</Link></li>
            <li><Link href="/warranty" className="text-white/70 hover:text-white transition-colors">Warranty Info</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold uppercase tracking-widest text-sm mb-6 pb-2 border-b border-white/10 text-brand-gold">
            Exclusive Newsletter
          </h4>
          <p className="text-white/70 text-sm mb-4">
            Curated collections and special offers, delivered to your inbox.
          </p>
          <form className="flex flex-col gap-3">
            <input 
              type="email" 
              placeholder="Email Address" 
              className="bg-white/5 border border-white/20 px-4 py-3 text-sm outline-none focus:border-brand-gold transition-colors"
              required
            />
            <button 
              type="submit" 
              className="bg-brand-gold text-brand-navy font-semibold uppercase tracking-widest text-xs px-4 py-3 hover:bg-white transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40 uppercase tracking-widest">
        <p>&copy; {new Date().getFullYear()} Lenzify. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
