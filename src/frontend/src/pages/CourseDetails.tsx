import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

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

  useEffect(() => {
    if (!id) return;

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

  if (!course) {
    return <p className="text-center py-10">Loading course details...</p>;
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative bg-black"
      style={{
        backgroundImage: `url(https://www.khanacademy.org${course.imagePath})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl w-full px-4">
        {/* Back Button */}
        <Link
          to="/courses"
          className="inline-block mb-6 rounded-lg px-4 py-2 text-white font-semibold transition-all duration-300 hover:scale-105"
          style={{
            backgroundColor: '#2A8188',
          }}
        >
          ← Back to Courses
        </Link>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-8 flex flex-col md:flex-row gap-6 border border-white/20">
          {/* Image */}
          <div className="md:w-1/2">
            <img
              src={`https://www.khanacademy.org${course.imagePath}`}
              alt={course.translatedTitle}
              className="rounded-lg object-cover w-full h-full shadow-lg"
            />
          </div>

          {/* Details */}
          <div className="md:w-1/2 flex flex-col text-white">
            <h1 className="text-4xl font-bold mb-4">{course.translatedTitle}</h1>
            <p className="text-gray-300 mb-2">
              By <span className="font-semibold">{course.authorNickname}</span>
            </p>
            <p className="text-gray-400 mb-6">Votes: {course.sumVotesIncremented}</p>

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
