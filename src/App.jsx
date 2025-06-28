import EstudianteLayout from './layouts/EstudianteLayout';
import DocenteLayout from './layouts/DocenteLayout';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Rutas de inicio de sesión */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas de estudiante */}
        <Route path="/estudiantelayout" element={<EstudianteLayout />}>
          <Route index element={<DocenteDashboard />} /> {/* Ruta por defecto */}
        </Route>

        {/* Rutas de docente */}
        <Route path="/docentelayout" element={<DocenteLayout />}>
          <Route index element={<DocenteDashboard />} /> {/* Ruta por defecto */}
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
