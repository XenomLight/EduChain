import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
// import Login from "./pages/auth/Login";
// import Register from "./pages/auth/Register";
import ProfileSetting from './pages/settings/ProfileSetting';
import WalletSetting from './pages/settings/walletSetting';
import ConfigurationSetting from './pages/settings/configurationSetting';
import Logout from './pages/settings/logOutSetting';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Qris from './pages/Qris';
import About from './pages/About';
import News from './pages/News';
import Features from './pages/Features';
import Careers from './pages/Careers';
import Pricing from './pages/Pricing';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import CourseDetails from './pages/CourseDetails';
import Partners from './pages/Partners';
import TransactionHistory from './pages/settings/HistoryTransaksi';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        {/*<Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} /> */}
        <Route path="/qris" element={<Qris />} />
        <Route path="/about" element={<About />} />
        <Route path="/news" element={<News />} />
        <Route path="/features" element={<Features />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/settings/profile" element={<ProfileSetting />} />
        <Route path="/settings/wallet" element={<WalletSetting />} />
        <Route path="/partners" element={<Partners />} />
       
        <Route
          path="/settings/configuration"
          element={<ConfigurationSetting />}
        />
        <Route path="/settings/logout" element={<Logout />} />
        <Route
          path="/settings/transaction-history"
          element={<TransactionHistory />}
        />
      </Routes>
    </Router>
  );
}

export default App;
