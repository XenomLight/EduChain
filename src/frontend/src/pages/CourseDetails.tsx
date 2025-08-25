import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { icpMaterials } from '../data/icpMaterials';
import { icpVideos } from '../data/icpVideos';

interface KhanProgram {
  id: string;
  translatedTitle: string;
  authorNickname: string;
  sumVotesIncremented: number;
  imagePath: string;
  url: string;
}

interface CourseraCourse {
  id: string;
  name: string;
  description: string;
  photoUrl?: string;
  slug: string;
}

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [khanCourse, setKhanCourse] = useState<KhanProgram | null>(null);
  const [courseraCourse, setCourseraCourse] = useState<CourseraCourse | null>(null);
  const [currentMaterial, setCurrentMaterial] = useState(icpMaterials[0]);
  const [videoIndex, setVideoIndex] = useState(0);

  useEffect(() => {
    if (!id) return;

    // Case khusus ICP & Blockchain PPT
    if (id === 'ppt-blockchain') {
      setKhanCourse(null);
      setCourseraCourse(null);
      return;
    }

    // Cek dulu ke Khan Academy
    fetch(`http://localhost:3001/api/courses/khanacademy`)
      .then((res) => res.json())
      .then((data) => {
        const program = data.data.listTopPrograms.programs.find(
          (p: KhanProgram) => p.id === id
        );
        if (program) {
          setKhanCourse(program);
          setCourseraCourse(null);
        }
      })
      .catch((err) => console.error('Error fetching Khan course detail:', err));

    // Cek Coursera
    fetch(`http://localhost:3001/api/courses/coursera`)
      .then((res) => res.json())
      .then((data) => {
        const course = data.elements.find((c: CourseraCourse) => c.id === id);
        if (course) {
          setCourseraCourse(course);
          setKhanCourse(null);
        }
      })
      .catch((err) => console.error('Error fetching Coursera course detail:', err));
  }, [id]);

  // --- ICP MATERIALS (ppt-blockchain) ---
  if (id === 'ppt-blockchain') {
    const totalHours = icpMaterials.reduce((sum, m) => sum + (m.hours || 1), 0);
    const currentIndex = icpMaterials.indexOf(currentMaterial);

    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        {/* Left Section */}
        <div className="flex-1 p-4 md:p-6">
          <div className="rounded-2xl bg-white shadow-lg backdrop-blur-md p-4 md:p-6">
            <iframe
              src={currentMaterial.file}
              className="w-full h-80 md:h-[36rem] rounded-xl shadow-md"
              title={currentMaterial.title}
            />

            <h2 className="mt-4 text-2xl md:text-3xl font-bold text-gray-800">
              {currentMaterial.title}
            </h2>
            {currentMaterial.hours && (
              <p className="mt-1 text-gray-600">
                Estimated study time: {currentMaterial.hours} hour(s)
              </p>
            )}

            {/* Progress + Navigation */}
            <div className="mt-6 space-y-6">
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                <h4 className="text-md font-medium mb-1 text-gray-800">
                  Learning Progress
                </h4>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${((currentIndex + 1) / icpMaterials.length) * 100}%`,
                    }}
                  ></div>
                </div>
                <p className="text-gray-700 text-sm mt-1">
                  {currentIndex + 1} / {icpMaterials.length} materials completed
                </p>
              </div>

              <div className="flex justify-between">
                {currentIndex > 0 && (
                  <button
                    className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
                    onClick={() =>
                      setCurrentMaterial(icpMaterials[currentIndex - 1])
                    }
                  >
                    ← Previous
                  </button>
                )}
                {currentIndex < icpMaterials.length - 1 && (
                  <button
                    className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
                    onClick={() =>
                      setCurrentMaterial(icpMaterials[currentIndex + 1])
                    }
                  >
                    Next →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full md:w-80 p-4 md:p-6 bg-white/90 shadow-lg rounded-2xl backdrop-blur-md mt-4 md:mt-0">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Materials Courses</h3>
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
            <p className="mb-2 text-gray-800 font-medium">
              Total Estimated Hours: {totalHours}h
            </p>
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

// --- ICP VIDEOS (video-blockchain) ---
if (id === 'video-blockchain') {
  const totalVideos = icpVideos.length;
  const currentVideo = icpVideos[videoIndex] || icpVideos[0];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Left Section */}
      <div className="flex-1 p-4 md:p-6">
        <div className="rounded-2xl bg-white shadow-lg backdrop-blur-md p-4 md:p-6">
          <iframe
            src={currentVideo.url.replace('watch?v=', 'embed/')}
            className="w-full h-80 md:h-[36rem] rounded-xl shadow-md"
            title={currentVideo.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />

          <h2 className="mt-4 text-2xl md:text-3xl font-bold text-gray-800">
            {currentVideo.title}
          </h2>

          {currentVideo.duration && (
            <p className="mt-1 text-gray-600">Duration: {currentVideo.duration}</p>
          )}

          {currentVideo.description && (
            <p className="mt-3 text-gray-700">{currentVideo.description}</p>
          )}

          {/* Progress + Navigation */}
          <div className="mt-6 space-y-6">
            <div className="p-3 rounded-lg bg-purple-50 border border-purple-100">
              <h4 className="text-md font-medium mb-1 text-gray-800">Watching Progress</h4>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((videoIndex + 1) / totalVideos) * 100}%` }}
                />
              </div>
              <p className="text-gray-700 text-sm mt-1">
                {videoIndex + 1} / {totalVideos} videos watched
              </p>
            </div>

            <div className="flex justify-between">
              {videoIndex > 0 && (
                <button
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
                  onClick={() => setVideoIndex(videoIndex - 1)}
                >
                  ← Previous
                </button>
              )}

              {videoIndex < totalVideos - 1 && (
                <button
                  className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition"
                  onClick={() => setVideoIndex(videoIndex + 1)}
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full md:w-80 p-4 md:p-6 bg-white/90 shadow-lg rounded-2xl backdrop-blur-md mt-4 md:mt-0">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Course Videos</h3>
        <ul className="space-y-3">
          {icpVideos.map((v, i) => (
            <li
              key={v.id}
              className={`cursor-pointer p-3 rounded-lg flex justify-between items-center transition ${
                i === videoIndex
                  ? 'bg-gradient-to-r from-purple-400 to-purple-600 text-white shadow-md'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
              onClick={() => setVideoIndex(i)}
            >
              <span>{v.title}</span>
              {v.duration && <span className="text-sm font-medium">{v.duration}</span>}
            </li>
          ))}
        </ul>

        <div className="mt-6">
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



  // --- KHAN ACADEMY ---
  if (khanCourse) {
    return (
      <div
        className="relative flex min-h-screen items-center justify-center bg-black"
        style={{
          backgroundImage: `url(https://www.khanacademy.org${khanCourse.imagePath})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div className="relative z-10 w-full max-w-4xl px-4">
          <Link
            to="/courses"
            className="mb-6 inline-block rounded-lg px-4 py-2 font-semibold text-white transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: '#2A8188' }}
          >
            Back to Courses
          </Link>
          <div className="flex flex-col gap-6 rounded-xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-md md:flex-row">
            <div className="md:w-1/2">
              <img
                src={`https://www.khanacademy.org${khanCourse.imagePath}`}
                alt={khanCourse.translatedTitle}
                className="h-full w-full rounded-lg object-cover shadow-lg"
              />
            </div>
            <div className="flex flex-col text-white md:w-1/2">
              <h1 className="mb-4 text-4xl font-bold">{khanCourse.translatedTitle}</h1>
              <p className="mb-2 text-gray-300">
                By <span className="font-semibold">{khanCourse.authorNickname}</span>
              </p>
              <p className="mb-6 text-gray-400">
                Votes: {khanCourse.sumVotesIncremented}
              </p>
              <div className="mt-auto flex gap-3">
                <a
                  href={`https://www.khanacademy.org${khanCourse.url}`}
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
  }

  // --- COURSERA ---
  if (courseraCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="w-full max-w-5xl px-4 py-10">
          <Link
            to="/courses"
            className="mb-6 inline-block rounded-lg px-4 py-2 font-semibold text-white transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: '#2A8188' }}
          >
            Back to Courses
          </Link>

          <div className="flex flex-col md:flex-row gap-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
            <div className="md:w-1/2">
              <img
                src={
                  courseraCourse.photoUrl ||
                  '/src/assets/image/coursera.png'
                }
                alt={courseraCourse.name}
                className="w-full h-full rounded-xl object-cover shadow-lg"
              />
            </div>
            <div className="md:w-1/2 flex flex-col">
              <h1 className="text-3xl font-bold mb-4">{courseraCourse.name}</h1>
              <p className="text-gray-300 mb-6">
                {courseraCourse.description || 'Coursera course'}
              </p>
              <div className="mt-auto">
                <a
                  href={`https://www.coursera.org/learn/${courseraCourse.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-lg px-6 py-3 text-center font-semibold text-white transition-all duration-300 hover:scale-105"
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
  }

  // --- DEFAULT LOADING ---
  return <p className="py-10 text-center">Loading course details...</p>;
};

export default CourseDetail;
