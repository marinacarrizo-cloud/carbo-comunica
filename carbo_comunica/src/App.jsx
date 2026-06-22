import React, { useState, useEffect } from 'react';

// Credenciales
const CLAVES_ACCESO = {
  "carbo2026mar": "Marina Carrizo",
  "carbo2026juan": "Juan Pérez",
  "carbo2026dir": "Prof. Lic. Marcela Rosana Quevedo (Directora de la Unidad Académica)"
};

const NIVELES_CARBO = ["Institucional (todos los niveles)", "Nivel Inicial", "Nivel Primario", "Nivel Secundario", "Nivel Superior"];

export default function App() {
  const [usuarioLogueado, setUsuarioLogueado] = useState(() => localStorage.getItem('carbo_usuario_sesion') || '');
  const [inputClave, setInputClave] = useState('');
  
  const [actividades, setActividades] = useState(() => JSON.parse(localStorage.getItem('carbo_actividades_v12')) || []);
  const [agenda, setAgenda] = useState(() => JSON.parse(localStorage.getItem('carbo_agenda_v12')) || []);
  const [tareas, setTareas] = useState(() => JSON.parse(localStorage.getItem('carbo_tareas_v12')) || []);

  const [textAct, setTextAct] = useState(''); const [dateAct, setDateAct] = useState(''); const [nivelAct, setNivelAct] = useState(NIVELES_CARBO[0]);
  const [textAge, setTextAge] = useState(''); const [dateAge, setDateAge] = useState(''); const [nivelAge, setNivelAge] = useState(NIVELES_CARBO[0]);
  const [textTarea, setTextTarea] = useState('');

  useEffect(() => { localStorage.setItem('carbo_actividades_v12', JSON.stringify(actividades)); }, [actividades]);
  useEffect(() => { localStorage.setItem('carbo_agenda_v12', JSON.stringify(agenda)); }, [agenda]);
  useEffect(() => { localStorage.setItem('carbo_tareas_v12', JSON.stringify(tareas)); }, [tareas]);

  // CORRECCIÓN FECHA: Conversión manual sin usar Date() para evitar desfase UTC
  const formatFecha = (str) => {
    if (!str) return new Date().toLocaleDateString('es-AR');
    const [y, m, d] = str.split('-');
    return `${d}/${m}/${y}`;
  };

  const handleAddActividad = (e) => {
    e.preventDefault();
    setActividades([{ fecha: formatFecha(dateAct), nivel: nivelAct, texto: textAct }, ...actividades]);
    setTextAct(''); setDateAct('');
  };

  const handleAddAgenda = (e) => {
    e.preventDefault();
    setAgenda([{ fecha: formatFecha(dateAge), nivel: nivelAge, texto: textAge }, ...agenda]);
    setTextAge(''); setDateAge('');
  };

  if (!usuarioLogueado) {
    return (
      <div style={{ backgroundColor: '#1e3a8a', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <form onSubmit={(e) => { e.preventDefault(); if(CLAVES_ACCESO[inputClave]) { setUsuarioLogueado(CLAVES_ACCESO[inputClave]); localStorage.setItem('carbo_usuario_sesion', CLAVES_ACCESO[inputClave]); } }} style={{ background: '#fff', padding: '40px', borderRadius: '10px' }}>
          <h2>Carbó Comunica</h2>
          <input type="password" placeholder="Clave..." onChange={(e) => setInputClave(e.target.value)} />
          <button type="submit">Ingresar</button>
        </form>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <img src="/escudo.png" alt="Escudo" style={styles.logo} />
            <div>
              <h1 style={styles.title}>Carbó Comunica</h1>
              <p>Operador: <strong>{usuarioLogueado}</strong></p>
            </div>
          </div>
          <button onClick={() => { setUsuarioLogueado(''); localStorage.removeItem('carbo_usuario_sesion'); }} style={styles.logout}>Salir</button>
          <img src="/comunicacion.png" alt="Logo" style={styles.logo} />
        </div>
      </header>

      <div style={styles.grid}>
        <section style={styles.card}>
          <h4>Actividades</h4>
          <form onSubmit={handleAddActividad}>
            <input value={textAct} onChange={(e) => setTextAct(e.target.value)} placeholder="Actividad" />
            <input type="date" value={dateAct} onChange={(e) => setDateAct(e.target.value)} />
            <select value={nivelAct} onChange={(e) => setNivelAct(e.target.value)}>{NIVELES_CARBO.map(n => <option key={n} value={n}>{n}</option>)}</select>
            <button type="submit">Agregar</button>
          </form>
          {actividades.map((a, i) => <div key={i}>{a.fecha} - {a.texto} <button onClick={() => setActividades(actividades.filter((_, idx) => idx !== i))}>X</button></div>)}
        </section>

        <section style={styles.card}>
          <h4>Agenda</h4>
          <form onSubmit={handleAddAgenda}>
            <input value={textAge} onChange={(e) => setTextAge(e.target.value)} placeholder="Evento" />
            <input type="date" value={dateAge} onChange={(e) => setDateAge(e.target.value)} />
            <select value={nivelAge} onChange={(e) => setNivelAge(e.target.value)}>{NIVELES_CARBO.map(n => <option key={n} value={n}>{n}</option>)}</select>
            <button type="submit">Agregar</button>
          </form>
          {agenda.map((a, i) => <div key={i}>{a.fecha} - {a.texto} <button onClick={() => setAgenda(agenda.filter((_, idx) => idx !== i))}>X</button></div>)}
        </section>

        <section style={styles.card}>
          <h4>Tareas (Kanban)</h4>
          <input value={textTarea} onChange={(e) => setTextTarea(e.target.value)} placeholder="Nueva tarea" />
          <button onClick={() => { setTareas([...tareas, { id: Date.now(), text: textTarea, status: 'Pendiente' }]); setTextTarea(''); }}>Agregar</button>
          {tareas.map(t => <div key={t.id}>{t.text} <button onClick={() => setTareas(tareas.filter(i => i.id !== t.id))}>X</button></div>)}
        </section>
      </div>
    </div>
  );
}

const styles = {
  container: { fontFamily: 'sans-serif', backgroundColor: '#f1f5f9', minHeight: '100vh' },
  header: { backgroundColor: '#1e3a8a', color: '#fff', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  headerContent: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  logo: { height: '50px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', padding: '20px' },
  card: { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' },
  title: { margin: 0 },
  logout: { backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }
};
