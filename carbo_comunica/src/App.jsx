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

  // Estados persistentes
  const [actividades, setActividades] = useState(() => JSON.parse(localStorage.getItem('carbo_actividades')) || []);
  const [agenda, setAgenda] = useState(() => JSON.parse(localStorage.getItem('agenda')) || []);
  const [tareas, setTareas] = useState(() => JSON.parse(localStorage.getItem('tareas')) || []);

  // Formateador de fecha exacto (sin zona horaria UTC)
  const formatFecha = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  useEffect(() => {
    localStorage.setItem('carbo_actividades', JSON.stringify(actividades));
    localStorage.setItem('agenda', JSON.stringify(agenda));
    localStorage.setItem('tareas', JSON.stringify(tareas));
  }, [actividades, agenda, tareas]);

  if (!usuarioLogueado) {
    return (
      <div style={{ backgroundColor: '#1e3a8a', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
        <form onSubmit={(e) => { e.preventDefault(); if(CLAVES_ACCESO[inputClave]) { setUsuarioLogueado(CLAVES_ACCESO[inputClave]); localStorage.setItem('carbo_usuario_sesion', CLAVES_ACCESO[inputClave]); } }} style={{ background: '#fff', padding: '40px', borderRadius: '10px' }}>
          <h2>Carbó Comunica</h2>
          <input type="password" placeholder="Clave..." onChange={(e) => setInputClave(e.target.value)} style={{ padding: '10px', width: '100%', marginBottom: '10px' }} />
          <button type="submit" style={{ width: '100%' }}>Ingresar</button>
        </form>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerGroup}>
          <img src="/escudo.png" alt="Escudo" style={styles.logo} />
          <div>
            <h1 style={styles.title}>Carbó Comunica</h1>
            <p>Operador: {usuarioLogueado}</p>
          </div>
        </div>
        <button onClick={() => { setUsuarioLogueado(''); localStorage.removeItem('carbo_usuario_sesion'); }} style={styles.logout}>Salir</button>
        <img src="/comunicacion.png" alt="Logo" style={styles.logo} />
      </header>

      <div style={styles.grid}>
        <Section title="Actividades" data={actividades} setData={setActividades} formatFecha={formatFecha} />
        <Section title="Agenda" data={agenda} setData={setAgenda} formatFecha={formatFecha} />
        <div style={styles.card}>
          <h4>Tareas (Kanban)</h4>
          <TareasComponent data={tareas} setData={setTareas} />
        </div>
      </div>
    </div>
  );
}

function Section({ title, data, setData, formatFecha }) {
  const [val1, setVal1] = useState('');
  const [date, setDate] = useState('');
  const [nivel, setNivel] = useState(NIVELES_CARBO[0]);

  const add = () => {
    if (!val1) return;
    const item = { id: Date.now(), text: `${formatFecha(date)} - ${val1} (${nivel})` };
    setData([item, ...data]);
    setVal1(''); setDate('');
  };

  return (
    <div style={styles.card}>
      <h4>{title}</h4>
      <input placeholder={title === 'Actividades' ? 'Actividad' : 'Evento'} value={val1} onChange={(e) => setVal1(e.target.value)} style={styles.input} />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={styles.input} />
      <select value={nivel} onChange={(e) => setNivel(e.target.value)} style={styles.input}>{NIVELES_CARBO.map(n => <option key={n} value={n}>{n}</option>)}</select>
      <button onClick={add} style={styles.button}>Agregar</button>
      {data.map(i => <div key={i.id} style={styles.item}>{i.text} <button onClick={() => setData(data.filter(x => x.id !== i.id))}>X</button></div>)}
    </div>
  );
}

function TareasComponent({ data, setData }) {
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Nueva tarea" style={styles.input} />
      <button onClick={() => { setData([...data, { id: Date.now(), text: text, status: 'Pendiente' }]); setText(''); }} style={styles.button}>Agregar</button>
      {data.map(t => <div key={t.id} style={styles.item}>{t.text} <button onClick={() => setData(data.filter(i => i.id !== t.id))}>X</button></div>)}
    </>
  );
}

const styles = {
  container: { fontFamily: 'sans-serif', backgroundColor: '#f1f5f9', minHeight: '100vh' },
  header: { backgroundColor: '#1e3a8a', color: '#fff', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  headerGroup: { display: 'flex', alignItems: 'center', gap: '15px' },
  logo: { height: '50px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', padding: '20px' },
  card: { backgroundColor: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' },
  input: { display: 'block', width: '100%', margin: '5px 0', padding: '8px' },
  button: { width: '100%', padding: '8px', marginTop: '5px' },
  item: { padding: '8px 0', borderBottom: '1px solid #eee', fontSize: '13px', display: 'flex', justifyContent: 'space-between' },
  logout: { backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' },
  title: { margin: 0, fontSize: '20px' }
};
