import React, { useState, useEffect } from 'react';
import { Menu, X, Users, Tablet, BarChart3, Settings, Plus, Edit, Trash2, Download, Upload, Eye, User, Lock, Wifi } from 'lucide-react';

const TeacherDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('classes');
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [syncProgress, setSyncProgress] = useState(0);

  // Avatares predefinidos
  const avatars = [
    { id: 1, name: 'Gato', emoji: '🐱', color: 'bg-orange-100' },
    { id: 2, name: 'Perro', emoji: '🐶', color: 'bg-yellow-100' },
    { id: 3, name: 'Conejo', emoji: '🐰', color: 'bg-pink-100' },
    { id: 4, name: 'Oso', emoji: '🐻', color: 'bg-brown-100' },
    { id: 5, name: 'León', emoji: '🦁', color: 'bg-amber-100' },
    { id: 6, name: 'Panda', emoji: '🐼', color: 'bg-gray-100' }
  ];

  // Estados para formularios
  const [classForm, setClassForm] = useState({ name: '', grade: '', section: '' });
  const [studentForm, setStudentForm] = useState({ 
    name: '', 
    lastName: '', 
    avatar: avatars[0], 
    pin: '' 
  });

  // Datos de ejemplo para el dashboard
  const [progressData, setProgressData] = useState([
    { student: 'Ana Quispe', completed: 8, total: 10, lastActivity: '2024-06-28' },
    { student: 'Carlos Mamani', completed: 6, total: 10, lastActivity: '2024-06-27' },
    { student: 'Maria Condori', completed: 9, total: 10, lastActivity: '2024-06-28' },
  ]);

  const menuItems = [
    { id: 'classes', icon: Users, label: 'Gestionar Clases', color: 'text-blue-600' },
    { id: 'sync', icon: Tablet, label: 'Sincronizar Tabletas', color: 'text-green-600' },
    { id: 'progress', icon: BarChart3, label: 'Ver Progreso', color: 'text-purple-600' },
    { id: 'settings', icon: Settings, label: 'Configuración', color: 'text-gray-600' },
  ];

  const openModal = (type, data = null) => {
    setModalType(type);
    if (type === 'editClass' && data) {
      setClassForm(data);
    } else if (type === 'editStudent' && data) {
      setStudentForm(data);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setClassForm({ name: '', grade: '', section: '' });
    setStudentForm({ name: '', lastName: '', avatar: avatars[0], pin: '' });
  };

  const handleCreateClass = () => {
    const newClass = {
      id: Date.now(),
      ...classForm,
      studentsCount: 0,
      createdAt: new Date().toLocaleDateString()
    };
    setClasses([...classes, newClass]);
    closeModal();
  };

  const handleCreateStudent = () => {
    if (!selectedClass) return;
    const newStudent = {
      id: Date.now(),
      classId: selectedClass.id,
      ...studentForm,
      createdAt: new Date().toLocaleDateString()
    };
    setStudents([...students, newStudent]);
    closeModal();
  };

  const simulateSync = (type) => {
    setConnectionStatus('connecting');
    setSyncProgress(0);
    
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setConnectionStatus('connected');
          setTimeout(() => setConnectionStatus('disconnected'), 2000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const Sidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0`}>
      <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-blue-600 to-indigo-600">
        <h1 className="text-xl font-bold text-white">🎓 EduPanel</h1>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white">
          <X size={24} />
        </button>
      </div>
      
      <nav className="mt-8">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveSection(item.id);
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center px-6 py-4 text-left hover:bg-gray-50 transition-colors ${
              activeSection === item.id ? 'bg-blue-50 border-r-4 border-blue-600' : ''
            }`}
          >
            <item.icon className={`mr-4 ${item.color}`} size={20} />
            <span className={`font-medium ${activeSection === item.id ? 'text-blue-600' : 'text-gray-700'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );

  const ClassesSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">📚 Mis Clases</h2>
        <button
          onClick={() => openModal('createClass')}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus size={20} />
          Nueva Clase
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <div key={classItem.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:scale-105">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4">
              <h3 className="text-xl font-bold text-white">{classItem.name}</h3>
              <p className="text-blue-100">{classItem.grade} - {classItem.section}</p>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600">👥 {students.filter(s => s.classId === classItem.id).length} estudiantes</span>
                <span className="text-sm text-gray-500">📅 {classItem.createdAt}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedClass(classItem)}
                  className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Eye size={16} />
                  Ver
                </button>
                <button
                  onClick={() => openModal('editClass', classItem)}
                  className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedClass && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">👥 Estudiantes de {selectedClass.name}</h3>
            <button
              onClick={() => openModal('createStudent')}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center gap-2"
            >
              <Plus size={16} />
              Agregar Estudiante
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.filter(student => student.classId === selectedClass.id).map((student) => (
              <div key={student.id} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4 border-2 border-gray-100 hover:border-blue-200 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-full ${student.avatar.color} flex items-center justify-center text-2xl`}>
                    {student.avatar.emoji}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{student.name} {student.lastName}</h4>
                    <p className="text-sm text-gray-600">🔒 PIN: {student.pin}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-500 text-white py-1 px-3 rounded-lg text-sm hover:bg-blue-600 transition-colors">
                    Editar
                  </button>
                  <button className="bg-red-500 text-white py-1 px-3 rounded-lg text-sm hover:bg-red-600 transition-colors">
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const SyncSection = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">📱 Sincronizar Tabletas</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Upload className="text-blue-500" size={24} />
            Cargar Contenido a Tableta
          </h3>
          <div className="space-y-4">
            <div className={`p-4 rounded-xl ${connectionStatus === 'connected' ? 'bg-green-100 border-green-200' : connectionStatus === 'connecting' ? 'bg-yellow-100 border-yellow-200' : 'bg-gray-100 border-gray-200'} border-2`}>
              <div className="flex items-center gap-2 mb-2">
                <Wifi className={connectionStatus === 'connected' ? 'text-green-600' : connectionStatus === 'connecting' ? 'text-yellow-600' : 'text-gray-400'} size={20} />
                <span className="font-medium">
                  {connectionStatus === 'connected' ? '✅ Tableta Conectada' : 
                   connectionStatus === 'connecting' ? '🔄 Conectando...' : 
                   '❌ Sin Conexión'}
                </span>
              </div>
              {connectionStatus === 'connecting' && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{width: `${syncProgress}%`}}></div>
                </div>
              )}
            </div>
            
            <select className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
              <option>Seleccionar clase a cargar</option>
              {classes.map(cls => (
                <option key={cls.id}>{cls.name} - {cls.grade}</option>
              ))}
            </select>
            
            <button
              onClick={() => simulateSync('upload')}
              disabled={connectionStatus === 'connecting'}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-6 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Upload size={20} />
              Cargar Clase a Tableta
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Download className="text-green-500" size={24} />
            Extraer Progreso de Tableta
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
              <p className="text-blue-800 font-medium">📊 Datos disponibles para extraer:</p>
              <ul className="text-sm text-blue-600 mt-2 space-y-1">
                <li>• Actividades completadas</li>
                <li>• Tiempo de uso por estudiante</li>
                <li>• Puntuaciones y logros</li>
                <li>• Fecha de última actividad</li>
              </ul>
            </div>
            
            <button
              onClick={() => simulateSync('download')}
              disabled={connectionStatus === 'connecting'}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Download size={20} />
              Extraer Progreso
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ProgressSection = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">📊 Progreso de Estudiantes</h2>
      
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
          <h3 className="text-xl font-bold text-white">Reporte de Actividades</h3>
        </div>
        
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-bold text-gray-700">👤 Estudiante</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-700">📈 Progreso</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-700">✅ Completado</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-700">📅 Última Actividad</th>
                </tr>
              </thead>
              <tbody>
                {progressData.map((student, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-medium text-gray-800">{student.student}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                            style={{width: `${(student.completed / student.total) * 100}%`}}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-600">
                          {Math.round((student.completed / student.total) * 100)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {student.completed}/{student.total}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{student.lastActivity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Estudiantes</p>
              <p className="text-3xl font-bold">{progressData.length}</p>
            </div>
            <Users className="text-blue-200" size={40} />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Promedio Completado</p>
              <p className="text-3xl font-bold">
                {Math.round(progressData.reduce((acc, student) => acc + (student.completed / student.total), 0) / progressData.length * 100)}%
              </p>
            </div>
            <BarChart3 className="text-green-200" size={40} />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Última Sincronización</p>
              <p className="text-lg font-bold">Hoy</p>
            </div>
            <Tablet className="text-purple-200" size={40} />
          </div>
        </div>
      </div>
    </div>
  );

  const Modal = () => (
    showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">
              {modalType === 'createClass' ? '📚 Nueva Clase' : 
               modalType === 'editClass' ? '✏️ Editar Clase' :
               modalType === 'createStudent' ? '👤 Nuevo Estudiante' : '✏️ Editar Estudiante'}
            </h3>
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          {(modalType === 'createClass' || modalType === 'editClass') && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nombre de la clase"
                value={classForm.name}
                onChange={(e) => setClassForm({...classForm, name: e.target.value})}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Grado (ej: Tercero de Primaria)"
                value={classForm.grade}
                onChange={(e) => setClassForm({...classForm, grade: e.target.value})}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Sección (ej: A)"
                value={classForm.section}
                onChange={(e) => setClassForm({...classForm, section: e.target.value})}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500"
              />
              <button
                onClick={handleCreateClass}
                className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition-colors"
              >
                {modalType === 'createClass' ? 'Crear Clase' : 'Guardar Cambios'}
              </button>
            </div>
          )}

          {(modalType === 'createStudent' || modalType === 'editStudent') && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nombre"
                value={studentForm.name}
                onChange={(e) => setStudentForm({...studentForm, name: e.target.value})}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Apellido"
                value={studentForm.lastName}
                onChange={(e) => setStudentForm({...studentForm, lastName: e.target.value})}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Avatar:</label>
                <div className="grid grid-cols-3 gap-2">
                  {avatars.map((avatar) => (
                    <button
                      key={avatar.id}
                      onClick={() => setStudentForm({...studentForm, avatar})}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        studentForm.avatar.id === avatar.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full ${avatar.color} flex items-center justify-center text-2xl mx-auto`}>
                        {avatar.emoji}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{avatar.name}</p>
                    </button>
                  ))}
                </div>
              </div>
              
              <input
                type="number"
                placeholder="PIN (3 dígitos)"
                value={studentForm.pin}
                onChange={(e) => setStudentForm({...studentForm, pin: e.target.value})}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500"
                maxLength={3}
              />
              
              <button
                onClick={handleCreateStudent}
                className="w-full bg-green-500 text-white py-3 rounded-xl hover:bg-green-600 transition-colors"
              >
                {modalType === 'createStudent' ? 'Agregar Estudiante' : 'Guardar Cambios'}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-800"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Bienvenido/a</p>
                <p className="font-semibold text-gray-800">Prof. María García</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <User className="text-white" size={20} />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {activeSection === 'classes' && <ClassesSection />}
          {activeSection === 'sync' && <SyncSection />}
          {activeSection === 'progress' && <ProgressSection />}
          {activeSection === 'settings' && (
            <div className="text-center py-20">
              <Settings className="mx-auto text-gray-400 mb-4" size={64} />
              <h2 className="text-2xl font-bold text-gray-600">Configuración</h2>
              <p className="text-gray-500">Próximamente...</p>
            </div>
          )}
        </main>
      </div>

      <Modal />
    </div>
  );
};

export default TeacherDashboard;