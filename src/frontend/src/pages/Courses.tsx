// src/frontend/src/pages/Courses.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from '../components/footer';
import Navbar from '@/components/Navbar';

interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  url: string;
}

interface CourseCategory {
  name: string;
  courses: Course[];
}

const Courses = () => {
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Ambil query search dari URL
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          'http://localhost:3001/api/courses/khanacademy'
        );
        const data = await res.json();

        const programs = data.data.listTopPrograms.programs.map((p: any) => ({
          id: p.id,
          title: p.translatedTitle,
          description: `By ${p.authorNickname} • Votes: ${p.sumVotesIncremented}`,
          image: `https://www.khanacademy.org${p.imagePath}`,
          url: `https://www.khanacademy.org${p.url}`,
        }));

        setCategories([
          {
            name: 'Learn ICP & Blockchain',
            courses: [
              {
                id: 'ppt-blockchain',
                title: 'ICP & Blockchain PPT',
                description: 'Slide pembelajaran dasar ICP dan Blockchain',
                image: '/images/icp-ppt.jpg',
                url: '/courses/icp-ppt',
              },
              {
                id: 'video-blockchain',
                title: 'ICP & Blockchain Video',
                description: 'Video tutorial lengkap ICP dan Blockchain',
                image: '/images/icp-video.jpg',
                url: '/courses/icp-video',
              },
            ],
          },
          {
            name: 'Khan Academy',
            courses: programs,
          },
        ]);
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };

    fetchData();
  }, []);

  // Filter kategori berdasarkan search query
  const filteredCategories = categories.map((cat) => ({
    ...cat,
    courses: cat.courses.filter(
      (c) =>
        c.title.toLowerCase().includes(searchQuery) ||
        c.description.toLowerCase().includes(searchQuery)
    ),
  }));

  return (
    <div>
      {/* Navbar fixed */}
      <Navbar />

      {/* Konten */}
      <div className="container mx-auto px-4 py-8 pt-24">
        {filteredCategories.map(
          (category) =>
            category.courses.length > 0 && (
              <div key={category.name} className="mb-12">
                <h2 className="mb-6 text-center text-2xl font-bold">
                  {category.name}
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {category.courses.map((course) => (
                    <div
                      key={course.id}
                      className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-lg shadow-black/40"
                      style={{
                        backgroundImage: `url(${course.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      {/* Overlay hitam transparan */}
                      <div className="absolute inset-0">
                        <div
                          className="h-full w-full bg-cover bg-center blur-sm brightness-75"
                          style={{ backgroundImage: `url(${course.image})` }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent transition group-hover:from-black/30"></div>
                      </div>

                      {/* Konten */}
                      <div className="relative flex h-full flex-col justify-between p-6 text-white">
                        <div>
                          <h3 className="text-xl font-bold">{course.title}</h3>
                          <p className="text-gray-300">{course.description}</p>
                        </div>

                        <div>
                          <p className="mt-4 text-2xl font-bold">Free</p>
                          <button
                            onClick={() => navigate(`/courses/${course.id}`)}
                            className="mt-2 text-sm font-medium text-[#24ABEC] hover:underline"
                          >
                            Click for details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
        )}

        <Footer />
      </div>
    </div>
  );
};

export default Courses;
