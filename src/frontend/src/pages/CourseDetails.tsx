// src/pages/CourseDetail.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { icpMaterials } from '../data/icpMaterials';

interface Program {
  id: string;
  translatedTitle: string;
  authorNickname: string;
  sumVotesIncremented: number;
  imagePath: string;
  url: string;
}

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Program | null>(null);
  const [currentMaterial, setCurrentMaterial] = useState(icpMaterials[0]);

  useEffect(() => {
    if (!id) return;

    // Case khusus ICP & Blockchain PPT
    if (id === 'ppt-blockchain') {
      setCourse(null); // kita gak fetch API
      return;
    }

    // Default: ambil dari API Khan Academy
    fetch(`http://localhost:3001/api/courses/khanacademy`)
      .then((res) => res.json())
      .then((data) => {
        const program = data.data.listTopPrograms.programs.find(
          (p: Program) => p.id === id
        );
        setCourse(program || null);
      })
      .catch((err) => console.error('Error fetching course detail:', err));
  }, [id]);

// ICP & Blockchain PPT
if (id === 'ppt-blockchain') {
  const totalHours = icpMaterials.reduce((sum, m) => sum + (m.hours || 1), 0);
  const currentIndex = icpMaterials.indexOf(currentMaterial);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      
      {/*User & Bottom Sections */}
      <div className="flex-1 p-4 md:p-6">
        <div className="rounded-2xl bg-white shadow-lg backdrop-blur-md p-4 md:p-6">
          <iframe
            src={currentMaterial.file}
            className="w-full h-80 md:h-[36rem] rounded-xl shadow-md"
            title={currentMaterial.title}
          />
          
          <h2 className="mt-4 text-2xl md:text-3xl font-bold text-gray-800">{currentMaterial.title}</h2>
          {currentMaterial.hours && (
            <p className="mt-1 text-gray-600">Estimated study time: {currentMaterial.hours} hour(s)</p>
          )}

          {/* Bottom Sections */}
          <div className="mt-6 space-y-6">
            {/* About Material */}
            <div className="p-4 rounded-xl bg-white shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">About This Material</h3>
              <p className="text-gray-700 text-sm md:text-base">
                In this chapter, you will learn the basics of Internet Computer Protocol (ICP) and blockchain,
                including key concepts, use cases, and benefits for modern industries.
              </p>
            </div>

            {/* Progress */}
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
              <h4 className="text-md font-medium mb-1 text-gray-800">Learning Progress</h4>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentIndex + 1) / icpMaterials.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-gray-700 text-sm mt-1">{currentIndex + 1} / {icpMaterials.length} materials completed</p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              {currentIndex > 0 && (
                <button
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
                  onClick={() => setCurrentMaterial(icpMaterials[currentIndex - 1])}
                >
                  ← Previous
                </button>
              )}
              {currentIndex < icpMaterials.length - 1 && (
                <button
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
                  onClick={() => setCurrentMaterial(icpMaterials[currentIndex + 1])}
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Material Sidebar */}
      <div className="w-full md:w-80 p-4 md:p-6 bg-white/90 shadow-lg rounded-2xl backdrop-blur-md mt-4 md:mt-0">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Materials List</h3>
        <ul className="space-y-3">
          {icpMaterials.map((m) => (
            <li
              key={m.id}
              className={`cursor-pointer p-3 rounded-lg flex justify-between items-center transition ${
                currentMaterial.id === m.id
                  ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-md'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
              onClick={() => setCurrentMaterial(m)}
            >
              <span>{m.title}</span>
              {m.hours && <span className="text-sm font-medium">{m.hours}h</span>}
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <p className="mb-2 text-gray-800 font-medium">Total Estimated Hours: {totalHours}h</p>
          <Link
            to="/courses"
            className="block text-center py-2 px-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    </div>
  );
}


  //Khan Academy
  if (!course) {
    return <p className="py-10 text-center">Loading course details...</p>;
  }

  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-black"
      style={{
        backgroundImage: `url(https://www.khanacademy.org${course.imagePath})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl px-4">
        {/* Back Button */}
        <Link
          to="/courses"
          className="mb-6 inline-block rounded-lg px-4 py-2 font-semibold text-white transition-all duration-300 hover:scale-105"
          style={{ backgroundColor: '#2A8188' }}
        >
        Back to Courses
        </Link>

        {/* Card */}
        <div className="flex flex-col gap-6 rounded-xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-md md:flex-row">
          {/* Image */}
          <div className="md:w-1/2">
            <img
              src={`https://www.khanacademy.org${course.imagePath}`}
              alt={course.translatedTitle}
              className="h-full w-full rounded-lg object-cover shadow-lg"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col text-white md:w-1/2">
            <h1 className="mb-4 text-4xl font-bold">
              {course.translatedTitle}
            </h1>
            <p className="mb-2 text-gray-300">
              By <span className="font-semibold">{course.authorNickname}</span>
            </p>
            <p className="mb-6 text-gray-400">
              Votes: {course.sumVotesIncremented}
            </p>

            <div className="mt-auto flex gap-3">
              <a
                href={`https://www.khanacademy.org${course.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-lg px-4 py-2 text-center font-semibold text-white transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: '#2A8188' }}
              >
                Start Learning
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
