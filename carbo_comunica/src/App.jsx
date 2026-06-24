import React, { useState, useEffect } from 'react';

// Datos semilla reales de la Escuela Normal Superior Dr. Alejandro Carbó
const initialActividades = [
  "Organización Día de la Bandera.",
  "Feria de Ciencias - 26/06.",
  "Cobertura aniversario institucional."
];

const initialAgenda = [
  "20/06 - Acto Día de la Bandera.",
  "26/06 - Feria de Ciencias.",
  "Reunión con directivos."
];

const initialGacetillas = [
  "Invitación Feria de Ciencias.",
  "Día de la Bandera."
];

export default function App() {
  // --- ESTADOS CON INICIALIZACIÓN PEREZOSA (Evita lecturas redundantes de localStorage) ---
  const [actividades, setActividades] = useState(() => {
    const local = localStorage.getItem('carbo_actividades');
    return local ? JSON.parse(local) : initialActividades;
  });

  const [agenda, setAgenda] = useState(() => {
    const local = localStorage.getItem('carbo_agenda');
    return local ? JSON.parse(local) : initialAgenda;
  });

  const [gacetillas, setGacetillas] = useState(() => {
    const local = localStorage.getItem('carbo_gacetillas');
    return local ? JSON.parse(local) : initialGacetillas;
  });

  // Estados independientes para el manejo de los formularios de entrada
  const [inputActividad, setInputActividad] = useState('');
  const [inputAgenda, setInputAgenda] = useState('');
  const [inputGacetilla, setInputGacetilla] = useState('');

  // --- EFECTOS DE SINCRONIZACIÓN CON LOCALSTORAGE ---
  useEffect(() => {
    localStorage.setItem('carbo_actividades', JSON.stringify(actividades));
  }, [actividades]);

  useEffect(() => {
    localStorage.setItem('carbo_agenda', JSON.stringify(agenda));
  }, [agenda]);

  useEffect(() => {
    localStorage.setItem('carbo_gacetillas', JSON.stringify(gacetillas));
  }, [gacetillas]);

  // --- MANEJADORES DE LOGICA (AGREGAR / ELIMINAR) ---
  const handleAdd = (e, target, input, setInput, setList) => {
    e.preventDefault();
    if (!input.trim()) return;
    setList(prev => [...prev, input.trim()]);
    setInput('');
  };

  const handleRemove = (index, setList) => {
    setList(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased">
      
      {/* HEADER INSTITUCIONAL */}
      <header className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white shadow-md border-b-4 border-amber-500 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold tracking-tight uppercase sm:text-3xl">
              Carbó Comunica
            </h1>
            <p className="text-xs text-blue-200 mt-1 font-medium tracking-wide">
              Departamento de Comunicación Institucional • ENS Dr. Alejandro Carbó
            </p>
          </div>
          <div className="flex items-center gap-2 bg-blue-950/50 px-4 py-2 rounded-full border border-blue-800">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">
              Terminal Operativa Local
            </span>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8">
        
        {/* BANNER INTRODUCTORIO */}
        <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-slate-200/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Panel de Gestión de Contenidos</h2>
            <p className="text-sm text-slate-500 mt-1">
              Modificá, agregá o eliminá las novedades en tiempo real. Los cambios se guardan automáticamente de forma local.
            </p>
          </div>
        </div>

        {/* REJILLA DE SECCIONES (3 COLUMNAS) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* SECCIÓN 1: ACTIVIDADES */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-900 tracking-tight text-lg flex items-center gap-2">
                <span className="p-1.5 bg-blue-100 text-blue-800 rounded-lg text-sm">📋</span>
                Actividades Recientes
              </h3>
            </div>
            
            <div className="p-5 flex-grow">
              <form 
                onSubmit={(e) => handleAdd(e, 'actividades', inputActividad, setInputActividad, setActividades)}
                className="mb-5 flex gap-2"
              >
                <input 
                  type="text"
                  placeholder="Nueva actividad..."
                  value={inputActividad}
                  onChange={(e) => setInputActividad(e.target.value)}
                  className="flex-grow text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
                <button 
                  type="submit"
                  className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors shadow-sm active:scale-95 duration-150"
                >
                  +
                </button>
              </form>

              {actividades.length === 0 ? (
                <p className="text-sm text-slate-400 italic text-center py-4">No hay actividades registradas.</p>
              ) : (
                <ul className="space-y-2">
                  {actividades.map((item, index) => (
                    <li key={index} className="flex justify-between items-start gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100 group transition-colors hover:bg-slate-100/50">
                      <span className="text-sm text-slate-700 leading-relaxed">{item}</span>
                      <button 
                        onClick={() => handleRemove(index, setActividades)}
                        className="text-slate-400 hover:text-red-600 font-medium text-xs px-2 py-1 rounded transition-colors duration-150"
                        title="Eliminar"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* SECCIÓN 2: AGENDA */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-900 tracking-tight text-lg flex items-center gap-2">
                <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg text-sm">📅</span>
                Agenda Institucional
              </h3>
            </div>
            
            <div className="p-5 flex-grow">
              <form 
                onSubmit={(e) => handleAdd(e, 'agenda', inputAgenda, setInputAgenda, setAgenda)}
                className="mb-5 flex gap-2"
              >
                <input 
                  type="text"
                  placeholder="Ej: 26/06 - Evento..."
                  value={inputAgenda}
                  onChange={(e) => setInputAgenda(e.target.value)}
                  className="flex-grow text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
                <button 
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors shadow-sm active:scale-95 duration-150"
                >
                  +
                </button>
              </form>

              {agenda.length === 0 ? (
                <p className="text-sm text-slate-400 italic text-center py-4">No hay eventos en la agenda.</p>
              ) : (
                <ul className="space-y-2">
                  {agenda.map((item, index) => (
                    <li key={index} className="flex justify-between items-start gap-3 bg-amber-50/40 p-3 rounded-lg border border-amber-100/40 group transition-colors hover:bg-amber-50/80">
                      <span className="text-sm text-slate-700 leading-relaxed font-medium">{item}</span>
                      <button 
                        onClick={() => handleRemove(index, setAgenda)}
                        className="text-slate-400 hover:text-red-600 font-medium text-xs px-2 py-1 rounded transition-colors duration-150"
                        title="Eliminar"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* SECCIÓN 3: GACETILLAS */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-900 tracking-tight text-lg flex items-center gap-2">
                <span className="p-1.5 bg-purple-100 text-purple-800 rounded-lg text-sm">📰</span>
                Gacetillas emitidas
              </h3>
            </div>
            
            <div className="p-5 flex-grow">
              <form 
                onSubmit={(e) => handleAdd(e, 'gacetillas', inputGacetilla, setInputGacetilla, setGacetillas)}
                className="mb-5 flex gap-2"
              >
                <input 
                  type="text"
                  placeholder="Título de gacetilla..."
                  value={inputGacetilla}
                  onChange={(e) => setInputGacetilla(e.target.value)}
                  className="flex-grow text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                />
                <button 
                  type="submit"
                  className="bg-purple-900 hover:bg-purple-800 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors shadow-sm active:scale-95 duration-150"
                >
                  +
                </button>
              </form>

              {gacetillas.length === 0 ? (
                <p className="text-sm text-slate-400 italic text-center py-4">No hay gacetillas emitidas.</p>
              ) : (
                <ul className="space-y-2">
                  {gacetillas.map((item, index) => (
                    <li key={index} className="flex justify-between items-start gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100 group transition-colors hover:bg-slate-100/50">
                      <span className="text-sm text-slate-700 leading-relaxed">{item}</span>
                      <button 
                        onClick={() => handleRemove(index, setGacetillas)}
                        className="text-slate-400 hover:text-red-600 font-medium text-xs px-2 py-1 rounded transition-colors duration-150"
                        title="Eliminar"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

        </div>
      </main>

      {/* FOOTER INSTITUCIONAL */}
      <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="font-semibold text-slate-200">Escuela Normal Superior Dr. Alejandro Carbó</p>
            <p className="text-xs text-slate-500 mt-0.5">Córdoba, Argentina • Plataforma de Uso Interno</p>
          </div>
          
          {/* REDES SOCIALES INSTITUCIONALES */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-slate-500 font-bold">IG:</span>
              <a href="https://instagram.com/carbo.comunica" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline transition-all">
                @carbo.comunica
              </a>
            </div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-slate-500 font-bold">FB:</span>
              <span className="text-slate-300">
                Escuela Normal Superior Dr. Alejandro Carbó
              </span>
            </div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-slate-500 font-bold">Web:</span>
              <span className="text-slate-300 italic">
                Sitio web institucional
              </span>
            </div>
          </div>
        </div>
        <div className="bg-slate-950 text-center py-3 text-xs text-slate-600 tracking-wider">
          Desarrollado con Software de Código Abierto y Licencia Libre
        </div>
      </footer>

    </div>
  );
}