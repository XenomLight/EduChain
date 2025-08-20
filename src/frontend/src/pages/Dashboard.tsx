import Footer from '../components/footer';
import Navbar from '@/components/Navbar';

const Dashboard = () => {
  return (
    <div>
      <Navbar />
      <main className="py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div>Dashboard</div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
