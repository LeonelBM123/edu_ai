import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
// Eliminamos imports de iconos si no los vamos a usar en esta versión simplificada
// import { ChevronLeft, BookOpen, GraduationCap, Calculator, FileText, Star, Sparkles } from 'lucide-react';

// StudentDashboard ahora recibe el JSON de datos completo como prop 'data'
const StudentDashboard = ({ data }) => {
    // Si necesitas ver los datos en la consola cuando el dashboard se renderice
    useEffect(() => {
        if (data) {
            console.log("StudentDashboard recibió los siguientes datos (JSON paseado):", data);
        }
    }, [data]); // Se ejecutará cada vez que 'data' cambie

    // Podemos mostrar un mensaje simple o incluso el JSON para confirmar que llegó
    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
            <h1 className="text-4xl font-bold mb-4">Bienvenido al Dashboard del Estudiante</h1>
            <p className="text-lg mb-8">
                Aquí se mostrarán tus niveles, grados y materias.
            </p>
            
            {data ? (
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl w-full">
                    <h2 className="text-2xl font-semibold mb-4">Datos recibidos:</h2>
                    <pre className="whitespace-pre-wrap break-all text-sm overflow-auto max-h-96">
                        {JSON.stringify(data, null, 2)}
                    </pre>
                </div>
            ) : (
                <p>No se recibieron datos aún o están cargando.</p>
            )}

            {/* Si aún necesitas Outlet para rutas anidadas en el futuro, mantenlo */}
            <Outlet />
        </div>
    );
};

export default StudentDashboard;