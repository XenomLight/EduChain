import { useState, useEffect } from 'react';
import SettingsLayout from '@/components/SettingsLayout';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/footer';

type User = {
  username: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wallets?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  principal?: any;
};

export default function Profile() {
  const { actor, principal, isAuthenticated } = useAuth();
  //const [avatar, setAvatar] = useState('https://d17ivq9b7rppb3.cloudfront.net/small/avatar/pp.jpg');
  const [userData, setUserData] = useState<User | null>(null);
  //const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!isAuthenticated || !actor) return;

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result: any = await actor.getMe(); // pakai 'any' supaya TS tidak error
        if (result?.ok) setUserData(result.ok);
        else console.error('Error fetching user:', result?.err);
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };

    fetchUser();
  }, [isAuthenticated, actor]);

  // const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     const url = URL.createObjectURL(e.target.files[0]);
  //     setAvatar(url);
  //   }
  // };

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen flex-col text-white">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-lg text-white">
            Please log in to view your profile.
          </p>
        </div>
        <Footer />
        <Navbar />
      </div>
    );
  }

  return (
    <SettingsLayout title="Profile">
      <form className="mb-20 space-y-4 rounded-2xl border border-gray-800 p-8 shadow">
        <h4 className="text-3xl font-semibold">User Profile</h4>

        {/* Foto Diri
        <div>
          <label className="block font-medium mb-2">Foto Diri</label>
          <div className="flex items-center gap-6">
            <img src={avatar} alt={userData?.first_name ?? ''} className="w-20 h-20 rounded object-cover" />
            <div>
              <button
                type="button"
                className="bg-primary text-white px-4 py-2 rounded"
                onClick={() => fileInputRef.current?.click()}
              >
                Pilih Foto
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <div className="text-xs text-gray-500 mt-2">
                Gambar Profile Anda sebaiknya memiliki rasio 1:1 dan berukuran tidak lebih dari 2MB.
              </div>
            </div>
          </div>
        </div> */}

        {/* Principal ID */}
        <div>
          <label htmlFor="principalID" className="mb-2 block font-medium">
            Principal ID
          </label>
          <input
            id="principalID"
            name="principalID"
            type="text"
            className="w-full rounded rounded-2xl border border-2 border-black border-gray-800 p-2 text-sm text-gray-500"
            value={principal ?? ''}
            readOnly
          />
          <div className="mt-1 text-xs text-gray-500">Not to change</div>
        </div>

        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="mb-2 font-medium">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            className="w-full rounded rounded-2xl border border-2 border-black border-gray-800 p-2 text-sm"
            value={userData?.first_name ?? ''}
            onChange={(e) =>
              setUserData({ ...userData!, first_name: e.target.value })
            }
            required
          />
          <div className="mt-1 text-xs text-gray-500">Wajib diisi</div>
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="mb-2 font-medium">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            className="w-full rounded rounded-2xl border border-2 border-black border-gray-800 p-2 text-sm"
            value={userData?.last_name ?? ''}
            onChange={(e) =>
              setUserData({ ...userData!, last_name: e.target.value })
            }
            required
          />
          <div className="mt-1 text-xs text-gray-500">Wajib diisi</div>
        </div>

        {/* Email */}
        <div>
          <label className="mb-2 block font-medium">Email</label>
          <input
            type="text"
            className="w-full rounded rounded-2xl border border-2 border-black border-gray-800 p-2 text-sm"
            value={userData?.email ?? ''}
            readOnly
          />
          <div className="mt-1 text-xs text-gray-500">
            Anda dapat mengubah alamat email melalui menu{' '}
            <a href="/settings/account" className="text-primary underline">
              Akun
            </a>
            .
          </div>
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            className="bg-primary rounded px-6 py-2 text-white"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </SettingsLayout>
  );
}
