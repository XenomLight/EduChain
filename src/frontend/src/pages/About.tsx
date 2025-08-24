// pages/About.tsx
import Navbar from '../components/Navbar';
import Footer from '../components/footer';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        <h1 className="text-3xl font-semibold">About EduChain</h1>
        <p className="text-gray-300">
          EduChain is an innovative education platform that leverages the Internet Computer Protocol (ICP) 
          to deliver transparent, portable, and verifiable learning credentials. By combining blockchain technology 
          with modern educational methods, EduChain empowers learners, institutions, and employers to connect 
          through a trusted and decentralized ecosystem.
        </p>
        <p className="text-gray-300">
          Our mission is to remove barriers in global education by ensuring that qualifications, skills, and 
          achievements are recognized and trusted worldwide, regardless of geographical or institutional boundaries.
        </p>

        <section className="grid md:grid-cols-2 gap-6">
          <AboutCard
            title="Challenges in Traditional Education Platforms"
            items={[
              "Lack of transparency in academic credentials",
              "Limited recognition across countries and organizations",
              "Minimal user control over personal academic data",
              "Difficulty verifying the authenticity of certificates",
              "Dependence on centralized institutions for storage and validation"
            ]}
          />
          <AboutCard
            title="EduChain’s Blockchain-Powered Solutions"
            items={[
              "Tamper-proof on-chain certificates stored on ICP",
              "Instant and borderless global verification",
              "Full user ownership and control of personal identity & data",
              "Seamless credential sharing with employers and institutions",
              "Long-term secure storage without reliance on a single server"
            ]}
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Why It Matters</h2>
          <p className="text-gray-300">
            In today’s interconnected world, education and skills must be portable, verifiable, 
            and free from unnecessary bureaucratic barriers. EduChain ensures that every learner 
            can carry their achievements anywhere, get recognized instantly, and fully control 
            who can access their data.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function AboutCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-gray-800 p-5">
      <h3 className="font-semibold text-lg">{title}</h3>
      <ul className="mt-2 text-gray-400 list-disc list-inside space-y-1">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}
