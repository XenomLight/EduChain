// pages/Pricing.tsx
import Navbar from '../components/Navbar';
import Footer from '../components/footer';

export default function Pricing() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        <header>
          <h1 className="text-3xl font-semibold">Plans & Pricing</h1>
          <p className="text-gray-400 mt-2">
            Choose a plan that fits your needs. Payment options include ICP, QRIS (Indonesia), PayPal, 
            and other digital methods.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          <Plan
            title="Starter"
            price="Free"
            items={[
              "SFree NFT learning materials",
              "Introduction to NFT & blockchain fundamentals",
              "No certificate included",
              "Can be showcased on LinkedIn portfolio",
              "Payment via QRIS / ICP",
            ]}
          />
          <Plan
            title="Buy Individual Access"
            price="Rp 472.000/Month"
            items={[
              "Full access to 1 selected course",
              "On-chain digital certificate (NFT)",
              "On-chain tracked module progress",
              "Can be showcased on LinkedIn portfolio",
              "Payment via QRIS / ICP",
              "Public URLs access control",
              "Priority support",

            ]}
            highlight
          />
          <Plan
            title="Buy Monthly Plan"
            price="$Rp 570.000/Month"
            items={[
              "Unlimited access to hundreds of courses",
              "Unlimited on-chain digital certificates (NFT)",
              "On-chain tracked module progress",
              "Can be showcased on LinkedIn portfolio",
              "Payment via QRIS / ICP",
              "Public URLs access control",
              "Priority support",
            ]}
          />
          <Plan
            title="Buy Annual Plan"
            price="Rp 3.893.000/Year"
            items={[
              "All Full Access features, premium certificates",
              "Comprehensive on-chain track record",
              "On-chain tracked module progress",
              "43.1% savings compared to monthly plan",
              "Can be showcased on LinkedIn portfolio",
              "Payment via QRIS / ICP",
              "Public URLs access control",
              "Priority support",
            ]}
            />
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Payment Methods</h2>
          <ul className="list-disc list-inside text-gray-300">
            <li>ICP Token (ICP blockchain)</li>
            <li>QRIS for Indonesian users</li>
            <li>PayPal and other digital payment methods</li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Plan({
  title,
  price,
  items,
  highlight = false,
}: {
  title: string;
  price: string;
  items: string[];
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-6 border ${
        highlight
          ? "border-cyan-600 ring-1 ring-cyan-600/40"
          : "border-gray-800"
      }`}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="text-3xl font-bold mt-2">{price}</div>
      <ul className="mt-4 space-y-2 text-gray-300">
        {items.map((i) => (
          <li key={i}>• {i}</li>
        ))}
      </ul>
      <button className="mt-6 w-full rounded-xl border border-cyan-700 py-2 hover:bg-cyan-700/10">
        Choose Plan
      </button>
    </div>
  );
}
