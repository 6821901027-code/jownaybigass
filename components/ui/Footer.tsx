import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#121214] text-[#86868b] text-[11px] border-t border-white/10 mt-auto pt-8 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="space-y-2 border-b border-white/10 pb-6 text-neutral-500">
          <p>
            * Prices shown are in Thai Baht (THB) including all applicable taxes.
            Free express delivery and 14-day direct exchange guarantee on all purchases.
          </p>
          <p>
            BigAss SHOP guarantees high performance hardware, titanium build quality,
            and 24/7 dedicated customer assistance.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-4">
          <div>
            <h4 className="font-semibold text-[#f5f5f7] mb-3 text-xs">
              Shop Categories
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/products?category=flagships" className="hover:text-white transition-colors">
                  Flagships
                </Link>
              </li>
              <li>
                <Link href="/products?category=laptops" className="hover:text-white transition-colors">
                  Workstations & Laptops
                </Link>
              </li>
              <li>
                <Link href="/products?category=displays" className="hover:text-white transition-colors">
                  Smart Displays
                </Link>
              </li>
              <li>
                <Link href="/products?category=wearables" className="hover:text-white transition-colors">
                  Wearables
                </Link>
              </li>
              <li>
                <Link href="/products?category=audio" className="hover:text-white transition-colors">
                  Audio Studio
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#f5f5f7] mb-3 text-xs">
              Editorial & Stories
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/blogs" className="hover:text-white transition-colors">
                  BigAss Journal
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:text-white transition-colors">
                  Engineering Insights
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:text-white transition-colors">
                  Product Announcements
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#f5f5f7] mb-3 text-xs">Account</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  BigAss Account ID
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-white transition-colors">
                  My Orders
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-blue-400 transition-colors">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#f5f5f7] mb-3 text-xs">
              BigAss Services
            </h4>
            <ul className="space-y-2.5">
              <li>Flagship Concierge</li>
              <li>Hardware Care Plan</li>
              <li>Track Shipment</li>
              <li>24/7 Technical Support</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#86868b]">
          <div>
            Copyright © {new Date().getFullYear()} BigAss SHOP Inc. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span>|</span>
            <span className="hover:underline cursor-pointer">Terms of Service</span>
            <span>|</span>
            <span className="hover:underline cursor-pointer">Warranty Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
