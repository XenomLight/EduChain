import React, { useEffect, useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import Footer from '@/components/footer';
import Navbar from '@/components/Navbar';
import AvatarImg from '@/assets/image/avatar.png';

const Dashboard = () => {
  const { actor, principal, loginWithPrincipal } = useAuth();
  const [popup, setPopup] = useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [data, setData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
  });
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [courses, setCourses] = React.useState<
    { title: string; instructor: string }[]
  >([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // input validation
    if (!data.email) {
      setError('Please enter your email!');
      setIsLoading(false);
      return;
    }
    if (!data.username) {
      setError('Please enter your username!');
      setIsLoading(false);
      return;
    }

    // process data
    try {
      if (!actor) {
        setError('Backend connection failed. Please try again.');
        setIsLoading(false);
        return;
      }
      const { status, message } = await loginWithPrincipal(data);
      if (status !== 'success') {
        setError(message);
        setIsLoading(false);
        return;
      }
      setPopup(false);
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (actor) {
      (async () => {
        const { ok, err } = (await actor.getMe()) as {
          ok?: {
            first_name: string[];
            last_name: string[];
          };
          err?: {
            NotFound: unknown;
          };
        };
        if (err || !ok?.first_name?.length || !ok?.last_name?.length) {
          setPopup(true);
        }

        setFirstName(ok?.first_name[0] || '');
        setLastName(ok?.last_name[0] || '');

        const result = (await actor.getMyCourses()) as {
          title: string;
          instructor: string;
        }[];
        setCourses(result);
      })();
    }
  }, [actor]);

  return (
    <div>
      {popup && (
        <div className="overlay active">
          <div className="overlay-content mx-auto my-6 w-100 bg-gray-900 p-4">
            <div className="mb-4 text-xl">Please fill in your information</div>
            {error && (
              <div className="w-full max-w-sm rounded-lg border border-red-500 bg-red-500/20 px-4 py-2 text-center text-red-200 md:max-w-lg">
                {error}
              </div>
            )}
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-sm space-y-4 md:max-w-lg md:space-y-5"
            >
              <Input
                type="firstName"
                name="firstName"
                placeholder="Enter your first name"
                value={data.firstName}
                onChange={handleChange}
                className="border-white/30 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/60 md:px-6 md:py-4 md:text-lg"
                required
              />
              <Input
                type="lastName"
                name="lastName"
                placeholder="Enter your last name"
                value={data.lastName}
                onChange={handleChange}
                className="border-white/30 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/60 md:px-6 md:py-4 md:text-lg"
                required
              />
              <Input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={data.username}
                onChange={handleChange}
                className="border-white/30 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/60 md:px-6 md:py-4 md:text-lg"
                required
              />
              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={data.email}
                onChange={handleChange}
                className="border-white/30 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/60 md:px-6 md:py-4 md:text-lg"
                required
              />
              <div className="flex justify-center pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full cursor-pointer rounded-xl bg-[#2A8188] py-3 text-base font-medium text-white transition-colors hover:bg-[#2A8188]/90 disabled:opacity-50 md:py-4 md:text-lg"
                >
                  {isLoading ? 'Submitting data...' : 'Submit data'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Navbar />
      <main className="py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h1 className="mb-8 text-3xl md:text-4xl">Dashboard</h1>
          <div className="grid md:grid-cols-3 md:gap-12">
            <div className="md:col-span-1">
              <img
                src={AvatarImg}
                alt="Avatar placeholder"
                className="mx-auto mb-4 w-40 rounded-full"
              />
              <div className="mb-4 border-b-2 pb-4 text-center text-2xl">
                {firstName + ' ' + lastName}
              </div>
              <div className="font-bold">PrincipalID:</div>
              <div className="text-sm italic">{principal}</div>
            </div>
            <div className="md:col-span-2">
              <div className="mb-12">
                <h2 className="mb-4 text-xl">My Course</h2>
                {courses?.length == 0 && (
                  <div className="text-center">You have no course</div>
                )}
                <div className="flex items-center justify-between">
                  {courses &&
                    courses?.map((val, key) => {
                      return (
                        <div className="w-80 text-center" key={key}>
                          <div className="mb-2 h-40 w-full bg-gray-300"></div>
                          <div className="mb-2">
                            <div className="">{val?.title}</div>
                            <div className="">by {val?.instructor}</div>
                          </div>
                          <div className="progress-container">
                            <div
                              className="progress-bar"
                              style={{ width: '55%' }}
                            ></div>
                          </div>
                          <div className="">55% Complete</div>
                        </div>
                      );
                    })}
                </div>
              </div>
              <div className="mb-12">
                <h2 className="mb-4 text-xl">My Certificate</h2>
                <div className="text-center">You have no certificate</div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
