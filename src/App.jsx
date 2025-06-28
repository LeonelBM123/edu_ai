import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Login from './pages/Login';
import Register from './pages/Register';
import EstudianteDashboard from './pages/EstudianteDashboard';
import EstudiantesLayout from './layouts/EstudiantesLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas de estudiantes */}
        <Route path="/estudianteslayout" element={<EstudiantesLayout />}>
          <Route index element={<EstudianteDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
