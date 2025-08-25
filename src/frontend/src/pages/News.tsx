// pages/News.tsx
import Navbar from '../components/Navbar';
import Footer from '../components/footer';

export default function News() {
  const posts = [
    {
      id: 1,
      title: "Launching EduChain Alpha",
      date: "2025-08-01",
      excerpt:
        "We have officially launched EduChain Alpha, introducing blockchain-based credentials and multi-payment support via ICP, QRIS, and PayPal.",
    },
    {
      id: 2,
      title: "New Content Partnership",
      date: "2025-09-10",
      excerpt:
        "EduChain is partnering with top education providers to expand our global learning ecosystem and enhance the quality of available courses.",
    },
    {
      id: 3,
      title: "Introducing Instant Credential Verification",
      date: "2025-10-05",
      excerpt:
        "Our latest update brings instant credential verification to employers and institutions worldwide, reducing the time for trust-based hiring.",
    },
    {
      id: 4,
      title: "Community Beta Testing Program",
      date: "2025-10-20",
      excerpt:
        "Join our community beta testing program and help shape the future of decentralized education with your feedback and insights.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        <h1 className="text-3xl font-semibold">News & Blogs</h1>
        <p className="text-gray-300">
          Stay updated with the latest news, product releases, and partnerships from EduChain. 
          Here you will find our latest announcements and insights on decentralized education.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {posts.map((p) => (
            <article
              key={p.id}
              className="rounded-2xl border border-gray-800 p-5 hover:border-cyan-700 transition"
            >
              <time className="text-xs text-gray-500">{p.date}</time>
              <h2 className="text-lg font-semibold mt-1">{p.title}</h2>
              <p className="text-gray-400 mt-2">{p.excerpt}</p>
              <button className="mt-4 text-sm text-cyan-400 hover:underline">
                Read more →
              </button>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

