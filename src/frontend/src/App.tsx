import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from '@/pages/Home';
import Register from './pages/auth/Register';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/register" element={<Register />} />
      </Routes>
    </Router>
  );
}
