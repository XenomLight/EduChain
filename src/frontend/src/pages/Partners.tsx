// src/frontend/src/pages/Partners.tsx
import React from "react";
import Footer from '../components/footer';
import Navbar from '../components/Navbar';

interface Partner {
  id: string;
  logo: string;
  name: string;
  description: string;
  categories: string[];
  courseCount: number;
  officialLink: string;
  status: "Active" | "Coming Soon" | "Inactive";
}

const partners: Partner[] = [
  {
    id: "icp",
    logo: "/src/assets/icons/logo-icp.svg",
    name: "ICP (Internet Computer Protocol)",
    description: "ICP provides decentralized blockchain infrastructure for educational applications.",
    categories: ["Blockchain", "Web3", "Cloud"],
    courseCount: 15,
    officialLink: "https://internetcomputer.org/",
    status: "Active",
  },
  {
    id: "blockchain",
    logo: "/src/assets/icons/Blockchain.svg",
    name: "Blockchain.com",
    description: "Blockchain focuses on courses related to blockchain technology, crypto, and digital security.",
    categories: ["Blockchain", "Crypto", "Finance"],
    courseCount: 12,
    officialLink: "https://www.blockchain.com/",
    status: "Active",
  },
  {
    id: "khanacademy",
    logo: "https://cdn.kastatic.org/images/khan-logo-vertical-transparent.png",
    name: "Khan Academy",
    description: "Khan Academy offers a variety of free courses from mathematics, science, to arts.",
    categories: ["Mathematics", "Science", "Programming", "Economics"],
    courseCount: 200,
    officialLink: "https://www.khanacademy.org/",
    status: "Active",
  },
  {
    id: "coursera",
    logo: "/src/assets/icons/coursera.svg",
    name: "Coursera",
    description: "Coursera partners with top universities to provide certified online courses.",
    categories: ["AI", "Data Science", "Programming", "Design"],
    courseCount: 5000,
    officialLink: "https://www.coursera.org/",
    status: "Active",
  },
];

const Partners: React.FC = () => {
  return (
    <div className="relative">
      {/* Navbar fixed di atas */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      {/* Konten utama dengan padding-top sesuai tinggi navbar */}
      <div className="pt-28 p-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Partnership Providers</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="bg-transparent shadow-lg rounded-2xl p-6 flex flex-col items-center"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="w-24 h-24 object-contain mb-4"
              />
              <h2 className="text-xl font-semibold text-center">{partner.name}</h2>
              <p className="text-gray-600 text-sm text-center mt-2">
                {partner.description}
              </p>
              <div className="mt-3 text-center">
                <span className="font-semibold">Categories:</span>{" "}
                {partner.categories.join(", ")}
              </div>
              <div className="text-center">
                <span className="font-semibold">Number of Courses:</span>{" "}
                {partner.courseCount}
              </div>
              <div className="mt-2">
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`px-2 py-1 rounded text-white ${
                    partner.status === "Active"
                      ? "bg-green-500"
                      : partner.status === "Coming Soon"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                >
                  {partner.status}
                </span>
              </div>
              <a
                href={partner.officialLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Visit Website
              </a>
            </div>
          ))}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Partners;
