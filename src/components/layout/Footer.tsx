import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-brand-navy border-t border-white/5 pt-20 pb-10 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-brand-text-muted">
                {/* Brand Info */}
                <div className="col-span-1 md:col-span-1">
                    <Image src="/logo.png" alt="LENZIFY" width={120} height={40} className="mb-6 opacity-80" />
                    <p className="text-sm leading-relaxed mb-6">
                        Lenzify.in — Premium eye care solutions and luxury eyewear for the modern visionary. Experience the future of optics.
                    </p>
                </div>

                {/* Categories */}
                <div className="flex flex-col gap-4">
                    <h4 className="text-white font-semibold uppercase tracking-widest text-xs mb-2">Categories</h4>
                    <Link href="/spectacles" className="hover:text-brand-electric smooth-transition">Spectacles</Link>
                    <Link href="/lenses" className="hover:text-brand-electric smooth-transition">Lenses</Link>
                    <Link href="/contact-lenses" className="hover:text-brand-electric smooth-transition">Contact Lenses</Link>
                </div>

                {/* Customer Support */}
                <div className="flex flex-col gap-4">
                    <h4 className="text-white font-semibold uppercase tracking-widest text-xs mb-2">Support</h4>
                    <Link href="/contact" className="hover:text-brand-electric smooth-transition">Contact Us</Link>
                    <Link href="/shipping" className="hover:text-brand-electric smooth-transition">Shipping Policy</Link>
                    <Link href="/returns" className="hover:text-brand-electric smooth-transition">Returns & Exchanges</Link>
                    <Link href="/faq" className="hover:text-brand-electric smooth-transition">FAQs</Link>
                </div>

                {/* Contact info */}
                <div className="flex flex-col gap-4">
                    <h4 className="text-white font-semibold uppercase tracking-widest text-xs mb-2">Connect</h4>
                    <p className="text-sm">Email: care@lenzify.in</p>
                    <p className="text-sm">Phone: +91 98765 43210</p>
                    <div className="flex gap-4 mt-2">
                        <span className="w-8 h-8 rounded-full glass-card flex items-center justify-center hover:bg-brand-electric hover:text-white smooth-transition cursor-pointer">In</span>
                        <span className="w-8 h-8 rounded-full glass-card flex items-center justify-center hover:bg-brand-electric hover:text-white smooth-transition cursor-pointer">Ig</span>
                        <span className="w-8 h-8 rounded-full glass-card flex items-center justify-center hover:bg-brand-electric hover:text-white smooth-transition cursor-pointer">Tw</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs tracking-widest uppercase">
                <p>&copy; 2026 LENZIFY. All rights reserved.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <Link href="/terms" className="hover:text-white smooth-transition">Terms & Conditions</Link>
                    <Link href="/privacy" className="hover:text-white smooth-transition">Privacy Policy</Link>
                </div>
            </div>
        </footer>
    );
}
