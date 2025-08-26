import Navbar from '../components/Navbar';
import { PiHexagonThin } from 'react-icons/pi';
import { motion } from 'framer-motion';
import Footer from '../components/footer';
import { useAuth } from '@/hooks/useAuth';
import React from 'react';
import certificartesvg from '../assets/icons/certificate.svg';
import paymentsvg from '../assets/icons/payment.svg';
import contentsvg from '../assets/icons/content.svg';
import web3svg from '../assets/icons/web3.svg';
import registersvg from '../assets/icons/register.svg';
import enrollsvg from '../assets/icons/enroll.svg';
import completesvg from '../assets/icons/complete.svg';

import { authService } from '@/lib/auth';

const Home = () => {
  const {
      setIsAuthenticated,
      setPrincipal,
      setWalletType,
      isAuthenticated
    } = useAuth();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  // helper utk semua paket
const handleBuy = async (amount: number, desc: string) => {
  if (!isAuthenticated) {
    const success = await handleLogin();
    if (!success) return; // gagal login
  }

  // kalau sudah login → langsung redirect
  window.location.href = `/qris?amount=${amount}&desc=${encodeURIComponent(desc)}`;
};


  const handleLogin = async () => {
      // authService
      setIsLoading(true);
      try {
        const success = await authService.loginWithInternetIdentity();
        if (success) {
          setIsAuthenticated(authService.isAuthenticated);
          setPrincipal(authService.principal);
          setWalletType(authService.walletType);
        }
        return success;
      } catch (error) {
        console.error('Internet Identity login failed:', error);
        alert('Internet Identity login failed. Please try again.');
        return false;
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 text-center sm:px-6">
        {/* Hexagon background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <PiHexagonThin className="h-auto w-[70vw] max-w-[1000px] text-cyan-400 opacity-50 blur-sm drop-shadow-[0_0_25px_rgba(34,211,238,0.7)]" />
          </motion.div>
        </div>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-black/80" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl">
          <h1 className="bg-gradient-to-r from-[#18E18C] via-[#77FFC6] to-[#FFD541] bg-clip-text text-3xl leading-tight font-bold text-transparent sm:text-5xl lg:text-7xl">
            Revolutionizing Global Education <br /> with Blockchain Transparency
          </h1>
          <p className="mt-6 text-base text-gray-300 sm:text-lg">
            Learn. Earn Certificates and Own Your Achievements. <br />
            All on the Internet Computer Protocol.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={() =>
                document
                  .getElementById('why-educhain')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              className="rounded-lg bg-white px-6 py-3 font-semibold text-black hover:bg-gray-200"
            >
              Explore Course
            </button>
            <div
              className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white sm:px-6 sm:text-base"
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
          <h2 className="mb-12 text-center text-2xl font-semibold sm:text-3xl">
            Why EduChain
          </h2>
          <div className="grid justify-center gap-8 sm:grid-cols-2 md:grid-cols-3">
            {[
              {
                icon: '✨',
                title: 'Decentralized & Transparent',
                text: 'All data and certificates are stored on the ICP blockchain, ensuring tamper-proof records that anyone can verify globally.',
              },
              {
                icon: '🧩',
                title: 'On-Chain Credentials',
                text: 'Certificates are automatically issued by smart contracts and stored directly on-chain, making them secure, permanent, and globally recognized.',
              },
              {
                icon: '💲',
                title: 'Multi-Payment Integration',
                text: 'Users can pay for courses using ICP tokens, QRIS, PayPal, and more—enabling greater accessibility and flexibility.',
              },
            ].map((card, i) => (
              <div
                key={i}
                className="mx-auto flex w-full max-w-[320px] flex-col rounded-[12px] bg-[#1a1a1a] p-6 sm:p-8"
              >
                <div className="mb-4 text-3xl text-white sm:text-4xl">
                  {card.icon}
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {card.title}
                </h3>
                <div className="my-4 h-[2px] w-16 bg-white/40"></div>
                <p className="text-sm leading-relaxed text-gray-400">
                  {card.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gradient-to-b from-black to-gray-900 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="mb-4 text-center text-2xl font-bold text-white sm:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-sm text-gray-300 sm:text-base">
            Getting started with EduChain is easy. Follow these simple steps to
            enroll in courses, learn, and earn verifiable blockchain-based
            certificates.
          </p>
          <div className="grid justify-items-center gap-8 sm:grid-cols-2 md:grid-cols-4">
            {[
              { title: 'Register', img: registersvg },
              {
                title: 'Enroll in Course',
                img: enrollsvg,
              },
              {
                title: 'Complete & Learn',
                img: completesvg,
              },
              { title: 'Earn Certificates', img: web3svg },
            ].map((item, i) => (
              <div
                key={i}
                className="flex w-full max-w-[300px] flex-col items-center justify-center rounded-xl border border-white/10 bg-black/50 p-6 backdrop-blur-md sm:p-8"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="mb-6 h-auto w-20 object-contain sm:w-32"
                />
                <p className="text-center text-lg font-bold text-white sm:text-xl">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-black/60 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="mb-4 text-center text-2xl font-bold text-white sm:text-4xl">
            Features
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-sm text-gray-300 sm:text-base">
            EduChain combines the power of blockchain and modern education to
            offer a secure, accessible, and user-centric learning experience.
            Here’s what makes it stand out.
          </p>
          <div className="grid justify-items-center gap-8 sm:grid-cols-2 md:grid-cols-4">
            {[
              {
                title: 'On-Chain Certificates',
                img: certificartesvg
              },
              {
                title: 'Multi-Payment Options',
                img: paymentsvg,
              },
              {
                title: 'Curated Content',
                img: contentsvg,
              },
              { title: 'Web3 Login', img: web3svg },
            ].map((item, i) => (
              <div
                key={i}
                className="flex w-full max-w-[300px] flex-col items-center justify-center rounded-xl border border-white/10 bg-black/50 p-6 backdrop-blur-md sm:p-8"
              >
                <div className="mb-6 flex h-20 w-20 items-center justify-center sm:h-32 sm:w-32">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="h-full w-full object-contain"
                  />
                </div>
                <p className="text-center text-lg font-bold text-white sm:text-xl">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Pricing Section */}
      <section className="bg-gradient-to-b from-gray-900 to-black py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="mb-4 text-center text-3xl font-bold sm:text-5xl">
            Pricing
          </h2>
          <p className="mb-12 text-center text-gray-400">
            For individuals and teams. 30-days money back guarantee.
          </p>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Free Access */}
            <div className="flex flex-col rounded-xl bg-[#1A1A1A] p-8 shadow-lg">
              <div>
                <h3 className="mb-2 bg-gradient-to-r from-[#514EFF] via-[#DC77FF] to-[#FFD541] bg-clip-text font-bold text-transparent">
                  Free Access
                </h3>
                <p className="text-3xl font-bold text-white">
                  Rp 0 <span className="text-sm font-normal">/once</span>
                </p>
                <ul className="mt-6 space-y-2 text-sm text-gray-300">
                  <li>✔ Access to Free learning materials</li>
                  <li>✔ Introduction to NFT & blockchain fundamentals</li>
                  <li>✔ On-chain digital certificate (NFT)</li>
                  <li>✔ Certificate included</li>
                  <li>✔ Can be showcased on LinkedIn portfolio</li>
                  <li>✔ Payment via QRIS / ICP</li>
                </ul>
              </div>
              <div className="mt-auto">
                <button
                  onClick={() => handleBuy(1, "Start Learning")}
                  className="mt-8 w-full rounded-full border border-white py-3 transition hover:bg-white hover:text-black"
                  disabled={isLoading}
                >
                  {isAuthenticated ? "Start Learning" : isLoading ? "Loading..." : "Login to Start"}
                </button>
                <p className="mt-4 text-center text-xs text-gray-400">
                  Best for beginners wanting to try the platform
                </p>
              </div>
            </div>

            {/* Individual Course Access */}
            <div className="flex flex-col rounded-xl bg-[#1A1A1A] p-8 shadow-lg">
              <div>
                <h3 className="mb-2 bg-gradient-to-r from-[#18E18C] via-[#77FFC6] to-[#FFD541] bg-clip-text font-bold text-transparent">
                  EduChain Pro Access
                </h3>
                <p className="text-3xl font-bold text-white">
                  Rp 472,000 <span className="text-sm font-normal">/month</span>
                </p>
                <ul className="mt-6 space-y-2 text-sm text-gray-300">
                  <li>✔ Full access to 1000+ courses</li>
                  <li>✔ Limit of 2 concurrently enrolled premium courses</li>
                  <li>✔ On-chain digital certificate (NFT)</li>
                  <li>✔ On-chain tracked module progress</li>
                  <li>✔ Can be showcased on LinkedIn portfolio</li>
                  <li>✔ Payment via QRIS / ICP</li>
                  <li className="flex items-center gap-2">
                    ✔ Public URLs access control{' '}
                    <span className="rounded border border-[#ACF3A6] px-1 py-0.5 text-[10px] text-[#ACF3A6]">
                      Soon
                    </span>
                  </li>
                  <li>✔ Priority support</li>
                </ul>
              </div>
              <div className="mt-auto">
                <button
                  onClick={() => handleBuy(472000, "Buy Pro Course Access")}
                  className="mt-8 w-full rounded-full bg-gradient-to-r from-[#18E18C] via-[#77FFC6] to-[#FFD541] py-3 font-semibold text-black transition hover:opacity-90"
                  disabled={isLoading}
                >
                  {isAuthenticated ? "Buy Pro Access" : isLoading ? "Loading..." : "Buy Pro Access"}
                </button>
                <p className="mt-4 text-center text-xs text-gray-400">
                  Best for focused learning on one skill
                </p>
              </div>
            </div>

            {/* Monthly Subscription */}
            <div className="flex flex-col rounded-xl bg-[#1A1A1A] p-8 shadow-lg">
              <div>
                <h3 className="mb-2 bg-gradient-to-r from-[#514EFF] via-[#DC77FF] to-[#FFD541] bg-clip-text font-bold text-transparent">
                  EduChain Pro Plus
                </h3>
                <p className="text-3xl font-bold text-white">
                  Rp 570,000 <span className="text-sm font-normal">/month</span>
                </p>
                <ul className="mt-6 space-y-2 text-sm text-gray-300">
                  <li>✔ Full access to 1000+ courses</li>
                  <li>✔ Limit of 4 concurrently enrolled premium courses</li>
                  <li>✔ On-chain digital certificate (NFT)</li>
                  <li>✔ On-chain tracked module progress</li>
                  <li>✔ Can be showcased on LinkedIn portfolio</li>
                  <li>✔ Payment via QRIS / ICP</li>
                  <li className="flex items-center gap-2">
                    ✔ Public URLs access control{' '}
                    <span className="rounded border border-[#ACF3A6] px-1 py-0.5 text-[10px] text-[#ACF3A6]">
                      Soon
                    </span>
                  </li>
                  <li>✔ Priority support</li>
                </ul>
              </div>
              <div className="mt-auto">
               <button
                  onClick={() => handleBuy(570000, "Buy Pro Plus Plan")}
                  className="mt-8 w-full rounded-full border border-white py-3 transition hover:bg-white hover:text-black"
                  disabled={isLoading}
                >
                  {isAuthenticated ? "Buy Pro Plus Plan" : isLoading ? "Loading..." : "Buy Pro Plus Plan"}
                </button>
                <p className="mt-4 text-center text-xs text-gray-400">
                  Best for learners exploring multiple skills
                </p>
              </div>
            </div>

            {/* LocalCan for teams 
            <div className="flex flex-col rounded-xl bg-[#1A1A1A] p-8 shadow-lg">
              <div>
                <h3 className="mb-2 bg-gradient-to-r from-[#514EFF] via-[#C96852] to-[#FFD541] bg-clip-text font-bold text-transparent">
                  LocalCan for teams
                </h3>
                <p className="text-3xl font-bold text-white">
                  Rp 3,893,000{' '}
                  <span className="text-sm font-normal">/year</span>
                </p>
                <ul className="mt-6 space-y-2 text-sm text-gray-300">
                  <li>✔ All Full Access features, premium certificates</li>
                  <li>✔ Comprehensive on-chain track record</li>
                  <li>✔ On-chain tracked module progress</li>
                  <li>✔ 43.1% savings compared to monthly plan</li>
                  <li>✔ Can be showcased on LinkedIn portfolio</li>
                  <li>✔ Payment via QRIS / ICP</li>
                  <li className="flex items-center gap-2">
                    ✔ Public URLs access control
                    <span className="rounded border border-[#ACF3A6] px-1 py-0.5 text-[10px] text-[#ACF3A6]">
                      Soon
                    </span>
                  </li>
                  <li>✔ Priority support</li>
                </ul>
              </div>
              <div className="mt-auto">
                <button
                  onClick={() => handleBuy(3893000, "Buy Annual Plan")}
                  className="mt-8 w-full rounded-full border border-white py-3 transition hover:bg-white hover:text-black"
                  disabled={isLoading}
                >
                  {isAuthenticated ? "Buy Annual Plan" : isLoading ? "Loading..." : "Buy Annual Plan"}
                </button>
                <p className="mt-4 text-center text-xs text-gray-400">
                  Best for committed learners & professionals
                </p>
              </div>
            </div>*/}
          </div>
        </div>
      </section>
      {/* Footer */}
      <Footer />

      {/* Back to top button */}
    </div>
  );
};

export default Home;
