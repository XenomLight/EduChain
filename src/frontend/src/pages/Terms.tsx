// pages/Terms.tsx
import Navbar from '../components/Navbar';
import Footer from '../components/footer';

export default function Terms() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-6">
        <h1 className="text-3xl font-semibold">Terms of Service</h1>
        <p className="text-gray-400 text-sm">
          Last updated: Aug 2025 — Non-legal summary.
        </p>

        <Section title="Account & Access">
          Users may register via Web3 (Internet Identity).
          You are responsible for keeping your credentials secure.
        </Section>

        <Section title="Payments">
          Courses can be purchased using ICP, QRIS (for Indonesian users), PayPal, and other digital payment methods.
          On-chain transactions are final.
        </Section>

        <Section title="On-Chain Certificates">
          Certificates are issued on the ICP blockchain and can be publicly verified.
          We cannot remove on-chain records.
        </Section>

        <Section title="Fair Use">
          Do not misuse the service, attempt to hack, or upload illegal content.
        </Section>

        <Section title="Limitation of Liability">
          The service is provided “as is”. To the fullest extent permitted by law, EduChain is not liable for indirect losses.
        </Section>
      </main>
      <Footer />
    </div>
  );
}

function Section({
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
