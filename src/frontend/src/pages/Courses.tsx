// src/frontend/src/pages/Courses.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from '../components/footer';
import Navbar from '@/components/Navbar';

interface KhanAcademyProgram {
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
  description?: string;
  photoUrl?: string;
  extraMetadata?: {
    definition?: {
      promoPhoto?: string;
    };
  };
  slug: string;
}

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
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
   
  const highlightText = (text: string, query: string) => {
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-yellow-300 text-black font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Khan Academy
        let khanPrograms: Course[] = [];
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // Timeout 5 detik
        
        try {
          const khanRes = await fetch('http://localhost:3001/api/courses/khanacademy', {
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (!khanRes.ok) {
            throw new Error(`HTTP error! status: ${khanRes.status}`);
          }
          
          const khanData = await khanRes.json();
          
          if (!khanData?.data?.listTopPrograms?.programs) {
            throw new Error('Format data tidak valid dari Khan Academy');
          }
          
          khanPrograms = khanData.data.listTopPrograms.programs
            .filter((p: unknown): p is KhanAcademyProgram => 
              !!p && 
              typeof p === 'object' && 
              p !== null &&
              'id' in p && 
              'translatedTitle' in p
            )
            .map((p: KhanAcademyProgram) => ({
              id: p.id,
              title: p.translatedTitle,
              description: `By ${p.authorNickname || 'Unknown'} • Votes: ${p.sumVotesIncremented || 0}`,
              image: p.imagePath ? `https://www.khanacademy.org${p.imagePath}` : '/images/placeholder-course.jpg',
              url: p.url ? `https://www.khanacademy.org${p.url}` : '#',
            }));
        } catch (khanError) {
          console.error('Error fetching Khan Academy:', khanError);
          
          // Hanya tampilkan error di console, biarkan array kosong
          // Aplikasi akan tetap menampilkan bagian lain yang berhasil di-load
          khanPrograms = [];
        }

        // 2. Coursera
        const courseraRes = await fetch(
          'http://localhost:3001/api/courses/coursera'
        );
        const courseraData = await courseraRes.json();

        const courseraCourses: Course[] = courseraData.elements.map(
          (c: CourseraCourse) => ({
            id: c.id,
            title: c.name,
            description: c.description || 'Coursera course',
            image:
              c.photoUrl ||
              c.extraMetadata?.definition?.promoPhoto ||
              '/src/assets/image/coursera.png',
            url: `https://www.coursera.org/learn/${c.slug}`,
          })
        );

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
          { name: 'Khan Academy', courses: khanPrograms },
          { name: 'Coursera', courses: courseraCourses },
          // Tambahkan kategori lain jika perlu
        ]);
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };

    fetchData();
  }, []);

  const filteredCategories = categories.map((category) => ({
    ...category,
    courses: category.courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchQuery) ||
        course.description.toLowerCase().includes(searchQuery)
    ),
  }));

  const toggleExpand = (categoryName: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
    );
  };
   
  const sortedCategories = filteredCategories.map((cat) => {
    const exactMatches = cat.courses.filter(
      (c) =>
        c.title.toLowerCase().startsWith(searchQuery) ||
        c.description.toLowerCase().startsWith(searchQuery)
    );
    const partialMatches = cat.courses.filter(
      (c) =>
        !exactMatches.includes(c) &&
        (c.title.toLowerCase().includes(searchQuery) ||
          c.description.toLowerCase().includes(searchQuery))
    );
    return { ...cat, courses: [...exactMatches, ...partialMatches] };
  });

  return (
    <div>
      <Navbar />

      <div className="container mx-auto px-4 py-8 pt-24">
        {sortedCategories.map(
          (category) =>
            category.courses.length > 0 && (
              <div key={category.name} className="mb-12">
                <h2 className="mb-6 text-center text-2xl font-bold">
                  {category.name}
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {(expandedCategories.includes(category.name)
                    ? category.courses
                    : category.courses.slice(0, 12)
                  ).map((course) => (
                    <div
                      key={course.id}
                      className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-lg shadow-black/40"
                      style={{
                        backgroundImage: `url(${course.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      <div className="absolute inset-0">
                        <div
                          className="h-full w-full bg-cover bg-center blur-sm brightness-75"
                          style={{ backgroundImage: `url(${course.image})` }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent transition group-hover:from-black/30"></div>
                      </div>

                      <div className="relative flex h-full flex-col justify-between p-6 text-white">
                        <div>
                          <h3 className="text-xl font-bold">{course.title}</h3>
                           {highlightText(course.title, searchQuery)}
                          <p className="text-gray-300">{course.description}</p>
                        </div>
                        <div>
                          <p className="mt-4 text-2xl font-bold">Free</p>
                          <button
                            onClick={() => navigate(`/courses/${course.id}`)}
                            className="mt-2 text-sm font-medium text-[#24ABEC] hover:underline"
                          >
                            Go to course
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* tombol See more */}
                {category.courses.length > 12 && (
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={() => toggleExpand(category.name)}
                      className="rounded-lg bg-[#2A8188] px-6 py-2 text-white hover:bg-[#1a90c9]"
                    >
                      {expandedCategories.includes(category.name)
                        ? 'See Less'
                        : 'See More'}
                    </button>
                  </div>
                )}
              </div>
            )
        )}
        <Footer />
      </div>
    </div>
  );
};

export default Courses;
