// pages/Careers.tsx
import Navbar from '../components/Navbar';
import Footer from '../components/footer';

export default function Careers() {
  const jobs = [
    {
      role: "Frontend Engineer (React/TypeScript)",
      type: "Remote",
      blurb: "Build interactive course interfaces, wallet integration, and WebAuthn login flows.",
    },
    {
      role: "Backend Engineer (Motoko/Rust)",
      type: "Remote",
      blurb: "Develop smart contracts for certificates and ICP-based payment systems.",
    },
    {
      role: "Partnership Manager",
      type: "Remote",
      blurb: "Establish partnerships with top educational content providers.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        <h1 className="text-3xl font-semibold">Careers</h1>
        <p className="text-gray-400">
          Join us in building the future of on-chain learning and global credential verification.
        </p>

        <div className="space-y-4">
          {jobs.map((j) => (
            <div
              key={j.role}
              className="rounded-2xl border border-gray-800 p-5 flex items-start justify-between gap-6"
            >
              <div>
                <h2 className="font-semibold">{j.role}</h2>
                <p className="text-gray-400">{j.blurb}</p>
              </div>
              <div className="text-sm text-gray-400">{j.type}</div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-cyan-700/40 p-5">
          Send your CV or portfolio to{" "}
          <span className="text-cyan-400">careers@educhain.app</span>
        </div>
      </main>

      <Footer />
    </div>
  );
}
