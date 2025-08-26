// src/frontend/src/pages/Partners.tsx
import React from 'react';
import Footer from '../components/footer';
import Navbar from '../components/Navbar';

const Partners: React.FC = () => {
  return (
    <div className="relative">
      <div className="fixed top-0 left-0 z-50 w-full">
        <Navbar />
      </div>
      <div className="flex min-h-screen flex-col items-center justify-center px-6 pt-28 text-center">
        <h1 className="mb-6 text-3xl font-bold">Partnership Providers</h1>
        <p className="text-xl text-gray-600"> Coming Soon </p>
      </div>
      <Footer />
    </div>
  );
};

// interface Partner {
//   id: string;
//   logo: string;
//   name: string;
//   description: string;
//   categories: string[];
//   courseCount: number;
//   officialLink: string;
//   status: 'Active' | 'Coming Soon' | 'Inactive';
// }

// const partners: Partner[] = [
//   {
//     id: 'icp',
//     logo: '/src/assets/icons/logo-icp.svg',
//     name: 'ICP (Internet Computer Protocol)',
//     description:
//       'ICP provides decentralized blockchain infrastructure for educational applications.',
//     categories: ['Blockchain', 'Web3', 'Cloud'],
//     courseCount: 15,
//     officialLink: 'https://internetcomputer.org/',
//     status: 'Active',
//   },
//   {
//     id: 'blockchain',
//     logo: '/src/assets/icons/Blockchain.svg',
//     name: 'Blockchain.com',
//     description:
//       'Blockchain focuses on courses related to blockchain technology, crypto, and digital security.',
//     categories: ['Blockchain', 'Crypto', 'Finance'],
//     courseCount: 12,
//     officialLink: 'https://www.blockchain.com/',
//     status: 'Active',
//   },
//   {
//     id: 'khanacademy',
//     logo: 'https://cdn.kastatic.org/images/khan-logo-vertical-transparent.png',
//     name: 'Khan Academy',
//     description:
//       'Khan Academy offers a variety of free courses from mathematics, science, to arts.',
//     categories: ['Mathematics', 'Science', 'Programming', 'Economics'],
//     courseCount: 200,
//     officialLink: 'https://www.khanacademy.org/',
//     status: 'Active',
//   },
//   {
//     id: 'coursera',
//     logo: '/src/assets/icons/coursera.svg',
//     name: 'Coursera',
//     description:
//       'Coursera partners with top universities to provide certified online courses.',
//     categories: ['AI', 'Data Science', 'Programming', 'Design'],
//     courseCount: 5000,
//     officialLink: 'https://www.coursera.org/',
//     status: 'Active',
//   },
//   {
//     id: 'udemy',
//     logo: '/src/assets/icons/udemy.svg',
//     name: 'Udemy',
//     description:
//       'Udemy offers a wide range of courses from professional instructors worldwide.',
//     categories: ['Programming', 'Business', 'Personal Development'],
//     courseCount: 100,
//     officialLink: 'https://www.udemy.com/',
//     status: 'Coming Soon',
//   },
//   {
//     id: 'dicoding',
//     logo: '/src/assets/image/dicoding.jpeg',
//     name: 'Dicoding Indonesia',
//     description:
//       'Dicoding is an Indonesian technology education platform that nurtures digital talent through world-class learning experiences.',
//     categories: ['Programming', 'Tech Education', 'E-Learning'],
//     courseCount: 50, 
//     officialLink: 'https://www.dicoding.com/',
//     status: 'Coming Soon',
//   },
//   {
//     id: 'edx',
//     logo: 'https://www.edx.org/images/logos/edx-logo-elm.svg',
//     name: 'edX',
//     description:
//       'edX offers high-quality courses from top universities and institutions worldwide.',
//     categories: ['Engineering', 'Humanities', 'Data Science'],
//     courseCount: 300,
//     officialLink: 'https://www.edx.org/',
//     status: 'Coming Soon',
//   },
//   {
//     id: 'pluralsight',
//     logo: '/src/assets/icons/pluralsight.svg',
//     name: 'Pluralsight',
//     description:
//       'Pluralsight provides technology and creative courses for professionals.',
//     categories: ['Tech Skills', 'Creative Skills'],
//     courseCount: 2000,
//     officialLink: 'https://www.pluralsight.com/',
//     status: 'Coming Soon',
//   },
//   {
//     id: 'futurelearn',
//     logo: '/src/assets/image/futurelearn.jpeg',
//     name: 'FutureLearn',
//     description:
//       'FutureLearn offers a diverse range of courses from universities and cultural institutions.',
//     categories: ['Arts', 'Humanities', 'Science'],
//     courseCount: 150,
//     officialLink: 'https://www.futurelearn.com/',
//     status: 'Coming Soon',
//   },
//   {
//     id: 'skillshare',
//     logo: '/src/assets/image/skillshare.png',
//     name: 'Skillshare',
//     description:
//       'Skillshare is a learning community for creators, offering thousands of classes in design, business, tech, and more.',
//     categories: ['Design', 'Business', 'Tech'],
//     courseCount: 1000,
//     officialLink: 'https://www.skillshare.com/',
//     status: 'Coming Soon',
//   },
// ];

// const Partners: React.FC = () => {
//   return (
//     <div className="relative">
//       <div className="fixed top-0 left-0 z-50 w-full">
//         <Navbar />
//       </div>
//       <div className="p-10 pt-28">
//         <h1 className="mb-6 text-center text-3xl font-bold">
//           Partnership Providers
//         </h1>
//         <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {partners.map((partner) => (
//             <div
//               key={partner.id}
//               className="flex flex-col items-center rounded-2xl bg-transparent p-6 shadow-lg"
//             >
//               <img
//                 src={partner.logo}
//                 alt={partner.name}
//                 className="mb-4 h-24 w-24 object-contain"
//               />
//               <h2 className="text-center text-xl font-semibold">
//                 {partner.name}
//               </h2>
//               <p className="mt-2 text-center text-sm text-gray-600">
//                 {partner.description}
//               </p>
//               <div className="mt-3 text-center">
//                 <span className="font-semibold">Categories:</span>{' '}
//                 {partner.categories.join(', ')}
//               </div>
//               <div className="text-center">
//                 <span className="font-semibold">Number of Courses:</span>{' '}
//                 {partner.courseCount}
//               </div>
//               <div className="mt-2">
//                 <span className="font-semibold">Status:</span>{' '}
//                 <span
//                   className={`rounded px-2 py-1 text-white ${
//                     partner.status === 'Active'
//                       ? 'bg-green-500'
//                       : partner.status === 'Coming Soon'
//                         ? 'bg-yellow-500'
//                         : 'bg-red-500'
//                   }`}
//                 >
//                   {partner.status}
//                 </span>
//               </div>
//               <a
//                 href={partner.officialLink}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
//               >
//                 Visit Website
//               </a>
//             </div>
//           ))}
//         </div>
//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default Partners;
export default Partners;