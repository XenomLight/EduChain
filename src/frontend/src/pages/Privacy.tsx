// pages/Privacy.tsx
import Navbar from '../components/Navbar';
import Footer from '../components/footer';

export default function Privacy() {
  return (
    <nav className="container mx-auto px-4 py-8">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-6">
        <h1 className="text-3xl font-semibold">Privacy Policy</h1>
        <p className="text-gray-400 text-sm">
          Summary of how we manage data.
        </p>

        <Psec title="Data Collected">
          Account data (name, email), course metadata, and Web3 identity
          (principal) if you choose to log in via Web3.
        </Psec>

        <Psec title="Use of Data">
          For authentication, payments, certificate issuance, and product
          improvement.
        </Psec>

        <Psec title="Storage & Retention">
          On-chain certificate proofs are stored
          permanently on the ICP blockchain.
        </Psec>

        <Psec title="Data Sharing">
          Only with payment providers (e.g., PayPal/QRIS) and content partners
          as necessary.
        </Psec>

        <Psec title="Your Rights">
          Access or correct your data; for on-chain data, we can
          add correction notes but cannot delete transactions.
        </Psec>
      </main>
      <Footer />
    </nav>
  );
}

function Psec({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-gray-300">{children}</p>
    </section>
  );
}
