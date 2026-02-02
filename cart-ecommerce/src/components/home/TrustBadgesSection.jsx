// src/components/home/TrustBadgesSection.jsx
import TrustBadge from '../common/TrustBadge';

const badges = [
  { title: "Complimentary Shipping", desc: "Free delivery on all orders" },
  { title: "Easy Verification", desc: "Quick and simple process" },
  { title: "No Bank Needed", desc: "Shop without bank account/card" },
  { title: "Zero Doc Fees", desc: "No charges for documentation" },
];

export default function TrustBadgesSection() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {badges.map((item, i) => (
            <TrustBadge key={i} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
}