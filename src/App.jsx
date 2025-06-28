import { BrowserRouter, Routes, Route, } from 'react-router-dom';
//import EstudianteLayout from './layouts/EstudiantesLayout';
//import DocenteLayout from './layouts/DocentesLayout';
import Login from './pages/Login';
//import Register from './pages/Register';



function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Rutas de inicio de sesión */}
        <Route path="/" element={<Login />} />
        
 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
