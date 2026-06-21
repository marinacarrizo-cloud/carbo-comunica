import React, { useState, useEffect } from 'react';

// Credenciales operativas locales
const CLAVES_ACCESO = {
  "carbo2026mar": "Marina Carrizo",
  "carbo2026juan": "Juan Pérez",
  "carbo2026dir": "Prof. Lic. Marcela Rosana Quevedo (Directora de la Unidad Académica)"
};

const NIVELES_CARBO = ["Institucional (todos los niveles)", "Nivel Inicial", "Nivel Primario", "Nivel Secundario", "Nivel Superior"];
const PERSONAL_AUTORIZADO = ["Marina Carrizo", "Juan Pérez", "Equipo General"];

// --- DATOS SEMILLA ---
const initialActividades = [];
const initialAgenda = [];
const initialGacetillas = [];
const initialCoberturas = [];
const initialTareas = [];

export default function App() {
  const [usuarioLogueado, setUsuarioLogueado] = useState(() => localStorage.getItem('carbo_usuario_sesion') || '');
  const [inputClave, setInputClave] = useState('');
  const [errorLogin, setErrorLogin] = useState(false);

  const [actividades, setActividades] = useState(() => { const local = localStorage.getItem('carbo_actividades_v12'); return local ? JSON.parse(local) : initialActividades; });
  const [agenda, setAgenda] = useState(() => { const local = localStorage.getItem('carbo_agenda_v12'); return local ? JSON.parse(local) : initialAgenda; });
  const [gacetillas, setGacetillas] = useState(() => { const local = localStorage.getItem('carbo_gacetillas_v12'); return local ? JSON.parse(local) : initialGacetillas; });
  const [coberturas, setCoberturas] = useState(() => { const local = localStorage.getItem('carbo_coberturas_v12'); return local ? JSON.parse(local) : initialCoberturas; });
  const [tareas, setTareas] = useState(() => { const local = localStorage.getItem('carbo_tareas_v12'); return local ? JSON.parse(local) : initialTareas; });

  const [textAct, setTextAct] = useState(''); const [dateAct, setDateAct] = useState(''); const [nivelAct, setNivelAct] = useState(NIVELES_CARBO[0]);
  const [textAge, setTextAge] = useState(''); const [dateAge, setDateAge] = useState(''); const [nivelAge, setNivelAge] = useState(NIVELES_CARBO[0]);
  const [textGac, setTextGac] = useState(''); const [dateGac, setDateGac] = useState(''); const [nivelGac, setNivelGac] = useState(NIVELES_CARBO[0]);
  const [cobEvento, setCobEvento] = useState(''); const [cobPersona1, setCobPersona1] = useState(PERSONAL_AUTORIZADO[0]); const [cobFuncion1, setCobFuncion1] = useState(''); const [cobPersona2, setCobPersona2] = useState(PERSONAL_AUTORIZADO[1]); const [cobFuncion2, setCobFuncion2] = useState(''); const [cobNotas, setCobNotas] = useState('');
  const [nuevaTareaTexto, setNuevaTareaTexto] = useState(''); const [tareaResp, setTareaResp] = useState(PERSONAL_AUTORIZADO[0]); const [tareaSolicitud, setTareaSolicitud] = useState(''); const [tareaLimite, setTareaLimite] = useState(''); const [columnaInicial, setColumnaInicial] = useState('pendiente');

  useEffect(() => { localStorage.setItem('carbo_actividades_v12', JSON.stringify(actividades)); }, [actividades]);
  useEffect(() => { localStorage.setItem('carbo_agenda_v12', JSON.stringify(agenda)); }, [agenda]);
  useEffect(() => { localStorage.setItem('carbo_gacetillas_v12', JSON.stringify(gacetillas)); }, [gacetillas]);
  useEffect(() => { localStorage.setItem('carbo_coberturas_v12', JSON.stringify(coberturas)); }, [coberturas]);
  useEffect(() => { localStorage.setItem('carbo_tareas_v12', JSON.stringify(tareas)); }, [tareas]);

  const handleLogin = (e) => { e.preventDefault(); const user = CLAVES_ACCESO[inputClave.trim()]; if (user) { setUsuarioLogueado(user); localStorage.setItem('carbo_usuario_sesion', user); setErrorLogin(false); } else { setErrorLogin(true); } };
  const handleLogout = () => { setUsuarioLogueado(''); localStorage.removeItem('carbo_usuario_sesion'); };

  const handleAddCanal = (e, text, date, nivel, setText, setDate, setNivel, setList) => { e.preventDefault(); if (!text.trim()) return; setList(prev => [{ fecha: date || new Date().toLocaleDateString('es-AR'), nivel, texto: text.trim() }, ...prev]); setText(''); setDate(''); setNivel(NIVELES_CARBO[0]); };
  const handleRemoveSimple = (index, setList) => setList(prev => prev.filter((_, i) => i !== index));
  
  const handleAddCobertura = (e) => { e.preventDefault(); setCoberturas(prev => [{ id: Date.now(), evento: cobEvento, personal: [{ nombre: cobPersona1, funcion: cobFuncion1 }, { nombre: cobPersona2, funcion: cobFuncion2 }], notas: cobNotas }, ...prev]); setCobEvento(''); setCobNotas(''); };
  const handleRemoveCobertura = (id) => setCoberturas(prev => prev.filter(c => c.id !== id));
  
  const handleAddTarea = (e) => { e.preventDefault(); setTareas(prev => [{ id: Date.now(), texto: nuevaTareaTexto, responsable: tareaResp, fechaSolicitud: tareaSolicitud, fechaLimite: tareaLimite, columna: columnaInicial, fechaRealizada: '' }, ...prev]); };
  const handleMoverTarea = (id, col) => setTareas(prev => prev.map(t => t.id === id ? { ...t, columna: col } : t));
  const handleRemoveTarea = (id) => setTareas(prev => prev.filter(t => t.id !== id));

  const generarInformeSemanal = () => {
    const ventanaInforme = window.open('', '_blank', 'width=700,height=650');
    ventanaInforme.document.write(`<html><body><h3>Informe Semanal</h3><pre>${JSON.stringify(tareas, null, 2)}</pre></body></html>`);
  };

  if (!usuarioLogueado) {
    return (
      <div style={{ backgroundColor: '#1e3a8a', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <form onSubmit={handleLogin} style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px', width: '300px' }}>
          <h2>Carbó Comunica</h2>
          <input type="password" placeholder="Clave..." onChange={(e) => setInputClave(e.target.value)} style={{ width: '100%', padding: '10px' }} />
          {errorLogin && <p style={{ color: 'red' }}>Clave incorrecta</p>}
          <button type="submit" style={{ width: '100%', padding: '10px' }}>Ingresar</button>
        </form>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <img src="/escudo.png" alt="Escudo" style={styles.logoImg} />
            <div>
              <h1 style={styles.title}>Carbó Comunica</h1>
              <p style={styles.subtitle}>Operador/a: <strong>{usuarioLogueado}</strong></p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={generarInformeSemanal} style={styles.buttonReport}>📋 Informe</button>
            <button onClick={handleLogout} style={styles.buttonLogout}>Salir ✕</button>
            <img src="/comunicacion.png" alt="Logo" style={styles.logoImg} />
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <h3>Gestión Institucional</h3>
        <div style={styles.grid}>
          {/* Actividades */}
          <div style={styles.card}>
            <h4>Actividades</h4>
            <form onSubmit={(e) => handleAddCanal(e, textAct, dateAct, nivelAct, setTextAct, setDateAct, setNivelAct, setActividades)}>
              <input value={textAct} onChange={(e) => setTextAct(e.target.value)} placeholder="Actividad" />
              <button type="submit">Agregar</button>
            </form>
            {actividades.map((a, i) => <div key={i}>{a.texto} <button onClick={() => handleRemoveSimple(i, setActividades)}>X</button></div>)}
          </div>
          {/* Agenda */}
          <div style={styles.card}>
            <h4>Agenda</h4>
            <form onSubmit={(e) => handleAddCanal(e, textAge, dateAge, nivelAge, setTextAge, setDateAge, setNivelAge, setAgenda)}>
              <input value={textAge} onChange={(e) => setTextAge(e.target.value)} placeholder="Evento" />
              <button type="submit">Agregar</button>
            </form>
            {agenda.map((a, i) => <div key={i}>{a.texto} <button onClick={() => handleRemoveSimple(i, setAgenda)}>X</button></div>)}
          </div>
          {/* Kanban */}
          <div style={styles.card}>
            <h4>Tareas (Kanban)</h4>
            {tareas.map((t, i) => <div key={i}>{t.texto} - {t.columna} <button onClick={() => handleRemoveTarea(t.id)}>X</button></div>)}
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: { fontFamily: 'sans-serif', backgroundColor: '#f1f5f9', minHeight: '100vh' },
  header: { backgroundColor: '#1e3a8a', color: '#ffffff', padding: '20px 40px' },
  headerContent: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' },
  logoImg: { height: '60px', width: 'auto' },
  title: { margin: 0, fontSize: '24px' },
  subtitle: { margin: 0, fontSize: '14px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' },
  card: { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' },
  buttonLogout: { backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' },
  buttonReport: { backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' },
  main: { maxWidth: '1200px', margin: '20px auto', padding: '20px' }
};
