// pages/Features.tsx
import Navbar from '../components/Navbar';
import Footer from '../components/footer';

export default function Features() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        <header>
          <h1 className="text-3xl font-semibold">Key Features</h1>
          <p className="text-gray-400 mt-2">
            EduChain is an integrated education platform built on the Internet Computer Protocol (ICP),
            enabling global learning and achievement verification.
          </p>
        </header>

        <section className="grid md:grid-cols-2 gap-6">
          <FeatureCard
            title="Decentralized Credentials"
            desc="Certificates are issued & stored on-chain — tamper-proof and verifiable from anywhere."
          />
          <FeatureCard
            title="Multiple Payment Methods"
            desc="Pay for courses with ICP tokens, QRIS (Indonesia), PayPal, and more — flexible and secure."
          />
          <FeatureCard
            title="Decentralized Login (Internet Identity)"
            desc="Login securely using Internet Identity - no passwords, no third-party accounts"
          />
          <FeatureCard
            title="Curated Learning Modules"
            desc="Carefully curated content from trusted partners — industry-relevant and up-to-date."
          />
          <FeatureCard
            title="Automated Certification"
            desc="Smart-contract powered certificates are issued automatically upon course completion."
          />
          <FeatureCard
            title="Partnerships"
            desc="Collaboration plans with Dicoding, Harisenin.com, and other leading education providers."
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">How It Works</h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2">
            <li>Sign Up: Internet Identity (Web3).</li>
            <li>Browse Courses: explore both global & local modules.</li>
            <li>Pay Securely: select ICP, QRIS, PayPal, and other supported methods.</li>
            <li>Learn: access interactive, industry-relevant content.</li>
            <li>Earn Credentials: receive on-chain certificates automatically.</li>
          </ol>
        </section>

        <section className="rounded-2xl border border-cyan-900/40 p-6 bg-gradient-to-b from-gray-900 to-black">
          <h3 className="text-xl font-semibold">Vision</h3>
          <p className="text-gray-300 mt-2">
            Combining the openness & security of decentralized technology with the convenience of traditional e-learning.
          </p>
          <p className="mt-3 text-cyan-400 font-medium">Learn. Earn. On-chain.</p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-gray-800 p-5 hover:border-cyan-700 transition">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-gray-400 mt-2">{desc}</p>
    </div>
  );
}
