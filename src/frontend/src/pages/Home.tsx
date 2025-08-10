import Navbar from '../components/Navbar';
import { PiHexagonThin } from "react-icons/pi";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center text-center px-4 sm:px-6 overflow-hidden">
        {/* Hexagon background */}
        <div className="absolute inset-0 flex justify-center items-center">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <PiHexagonThin
              className="w-[70vw] max-w-[1000px] h-auto
                         text-cyan-400 opacity-50 blur-sm
                         drop-shadow-[0_0_25px_rgba(34,211,238,0.7)]"
            />
          </motion.div>
        </div>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-black/80" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl">
          <h1 className="text-3xl sm:text-5xl lg:text-7xl leading-tight font-bold">
            Revolutionizing Global Education <br /> with Blockchain Transparency
          </h1>
          <p className="mt-6 text-gray-300 text-base sm:text-lg">
            Learn. Earn Certificates and Own Your Achievements. <br />
            All on the Internet Computer Protocol.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={() =>
                document.getElementById('why-educhain')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="rounded-lg bg-white px-6 py-3 font-semibold text-black hover:bg-gray-200"
            >
              Explore Course
            </button>
            <div
              className="flex items-center gap-2 rounded-lg px-4 sm:px-6 py-3 font-semibold text-white text-sm sm:text-base"
              style={{ backgroundColor: '#221D21' }}
            >
              🏅 Product Hunt #1 Product of the Week
            </div>
          </div>
        </div>
      </section>

      {/* Why EduChain */}
      <section id="why-educhain" className="bg-black/60 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="mb-12 text-center text-2xl sm:text-3xl font-semibold">
            Why EduChain
          </h2>
          <div className="grid justify-center gap-8 sm:grid-cols-2 md:grid-cols-3">
            {[
              {
                icon: "✨",
                title: "Decentralized & Transparent",
                text: "All data and certificates are stored on the ICP blockchain, ensuring tamper-proof records that anyone can verify globally."
              },
              {
                icon: "🧩",
                title: "On-Chain Credentials",
                text: "Certificates are automatically issued by smart contracts and stored directly on-chain, making them secure, permanent, and globally recognized."
              },
              {
                icon: "💲",
                title: "Multi-Payment Integration",
                text: "Users can pay for courses using ICP tokens, QRIS, PayPal, and more—enabling greater accessibility and flexibility."
              }
            ].map((card, i) => (
              <div key={i} className="flex flex-col rounded-[12px] bg-[#1a1a1a] p-6 sm:p-8 w-full max-w-[320px] mx-auto">
                <div className="mb-4 text-3xl sm:text-4xl text-white">{card.icon}</div>
                <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                <div className="my-4 h-[2px] w-16 bg-white/40"></div>
                <p className="text-sm leading-relaxed text-gray-400">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gradient-to-b from-black to-gray-900 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="mb-4 text-center text-2xl sm:text-4xl font-bold text-white">
            How It Works
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-gray-300 text-sm sm:text-base">
            Getting started with EduChain is easy. Follow these simple steps to enroll in courses, learn, and earn verifiable blockchain-based certificates.
          </p>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 justify-items-center">
            {[
              { title: 'Register', img: '/src/assets/icons/register.svg' },
              { title: 'Enroll in Course', img: '/src/assets/icons/enroll.svg' },
              { title: 'Complete & Learn', img: '/src/assets/icons/complete.svg' },
              { title: 'Web3 & Web2 Login', img: '/src/assets/icons/web3.svg' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center justify-center rounded-xl p-6 sm:p-8 w-full max-w-[300px] bg-black/50 border border-white/10 backdrop-blur-md">
                <img src={item.img} alt={item.title} className="mb-6 w-20 sm:w-32 h-auto object-contain" />
                <p className="text-center text-lg sm:text-xl font-bold text-white">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-black/60 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="mb-4 text-center text-2xl sm:text-4xl font-bold text-white">
            Features
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-gray-300 text-sm sm:text-base">
            EduChain combines the power of blockchain and modern education to offer a secure, accessible, and user-centric learning experience. Here’s what makes it stand out.
          </p>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 justify-items-center">
            {[
              { title: 'On-Chain Certificates', img: '/src/assets/icons/certificate.svg' },
              { title: 'Multi-Payment Options', img: '/src/assets/icons/payment.svg' },
              { title: 'Curated Content', img: '/src/assets/icons/content.svg' },
              { title: 'Web3 & Web2 Login', img: '/src/assets/icons/web2.svg' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center justify-center rounded-xl p-6 sm:p-8 w-full max-w-[300px] bg-black/50 border border-white/10 backdrop-blur-md">
                <div className="mb-6 flex items-center justify-center w-20 sm:w-32 h-20 sm:h-32">
                  <img src={item.img} alt={item.title} className="object-contain w-full h-full" />
                </div>
                <p className="text-center text-lg sm:text-xl font-bold text-white">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
