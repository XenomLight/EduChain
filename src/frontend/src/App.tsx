import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from '@/pages/Home';
import Login from './pages/auth/Login';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Auth Routes */}
        <Route path="/auth">
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </Router>
  );
}
