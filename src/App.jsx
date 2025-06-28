import { BrowserRouter, Routes, Route, } from 'react-router-dom';
import EstudianteLayout from './layouts/EstudiantesLayout';
import DocenteLayout from './layouts/DocentesLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import EstudianteDashboard from './pages/EstudianteDashboard';


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Rutas de inicio de sesión */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Rutas de estudiantes */}
        <Route path="/estudiantelayout" element={<EstudianteLayout />}>
        <Route index element={<EstudianteDashboard/>} />
        </Route>

        {/* Rutas de docentes */}
        <Route path="/docentelayout" element={<DocenteLayout />}>

        </Route>
 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
