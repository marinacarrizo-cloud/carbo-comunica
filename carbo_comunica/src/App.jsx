import React, { useState, useEffect } from 'react';

// Credenciales
const CLAVES_ACCESO = {
  "carbo2026mar": "Marina Carrizo",
  "carbo2026juan": "Juan Pérez",
  "carbo2026dir": "Prof. Lic. Marcela Rosana Quevedo"
};

export default function App() {
  const [usuario, setUsuario] = useState(() => localStorage.getItem('carbo_user') || '');
  
  // Estados para Actividades, Agenda y Tareas
  const [actividades, setActividades] = useState(() => JSON.parse(localStorage.getItem('actividades')) || []);
  const [agenda, setAgenda] = useState(() => JSON.parse(localStorage.getItem('agenda')) || []);
  const [tareas, setTareas] = useState(() => JSON.parse(localStorage.getItem('tareas')) || []);

  // Función para formatear fecha evitando el problema de la zona horaria (UTC)
  const formatearFecha = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  // Guardado automático
  useEffect(() => {
    localStorage.setItem('actividades', JSON.stringify(actividades));
    localStorage.setItem('agenda', JSON.stringify(agenda));
    localStorage.setItem('tareas', JSON.stringify(tareas));
  }, [actividades, agenda, tareas]);

  if (!usuario) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', backgroundColor: '#f1f5f9', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        <h2>Carbó Comunica - Ingreso</h2>
        <input type="password" placeholder="Clave..." onChange={(e) => { if(CLAVES_ACCESO[e.target.value]) { setUsuario(CLAVES_ACCESO[e.target.value]); localStorage.setItem('carbo_user', CLAVES_ACCESO[e.target.value]); } }} style={{ padding: '10px' }} />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <img src="/escudo.png" alt="Escudo" style={styles.logo} />
          <div>
            <h1 style={styles.title}>Carbó Comunica</h1>
            <p>Operador: {usuario}</p>
          </div>
        </div>
        <button onClick={() => { setUsuario(''); localStorage.removeItem('carbo_user'); }} style={styles.logout}>Salir</button>
        <img src="/comunicacion.png" alt="Logo" style={styles.logo} />
      </header>

      <div style={styles.mainGrid}>
        {/* Actividades */}
        <Section title="Actividades" data={actividades} setData={setActividades} fields={['Actividad', 'date']} />
        {/* Agenda */}
        <Section title="Agenda" data={agenda} setData={setAgenda} fields={['Evento', 'date']} />
        {/* Tareas */}
        <div style={styles.column}>
          <h3>Tareas (Kanban)</h3>
          <div style={styles.list}>
             {tareas.map(t => <div key={t.id} style={styles.item}>{t.text} - {t.status} <button onClick={() => setTareas(tareas.filter(i => i.id !== t.id))}>X</button></div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, data, setData, fields }) {
  const [val1, setVal1] = useState('');
  const [val2, setVal2] = useState('');

  const add = () => {
    if (!val1) return;
    const [year, month, day] = val2.split('-');
    const fechaFinal = val2 ? `${day}/${month}/${year}` : new Date().toLocaleDateString('es-AR');
    setData([...data, { id: Date.now(), text: `${fechaFinal} - ${val1}` }]);
    setVal1(''); setVal2('');
  };

  return (
    <div style={styles.column}>
      <h3>{title}</h3>
      <input placeholder={fields[0]} value={val1} onChange={(e) => setVal1(e.target.value)} />
      <input type="date" value={val2} onChange={(e) => setVal2(e.target.value)} />
      <button onClick={add}>Agregar</button>
      <div style={styles.list}>
        {data.map(i => <div key={i.id} style={styles.item}>{i.text} <button onClick={() => setData(data.filter(x => x.id !== i.id))}>X</button></div>)}
      </div>
    </div>
  );
}

const styles = {
  container: { fontFamily: 'sans-serif', backgroundColor: '#f1f5f9', minHeight: '100vh' },
  header: { backgroundColor: '#1e3a8a', color: '#fff', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  mainGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', padding: '20px' },
  column: { backgroundColor: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' },
  list: { marginTop: '10px' },
  item: { padding: '5px 0', borderBottom: '1px solid #eee', fontSize: '14px' },
  logo: { height: '50px' },
  title: { margin: 0, fontSize: '20px' },
  logout: { backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }
};
