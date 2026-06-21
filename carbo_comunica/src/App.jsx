import React, { useState, useEffect } from 'react';

// Credenciales
const CLAVES_ACCESO = {
  "carbo2026mar": "Marina Carrizo",
  "carbo2026juan": "Juan Pérez",
  "carbo2026dir": "Prof. Lic. Marcela Rosana Quevedo"
};

const NIVELES = ["Institucional", "Nivel Inicial", "Nivel Primario", "Nivel Secundario", "Nivel Superior"];

export default function App() {
  const [usuario, setUsuario] = useState(() => localStorage.getItem('carbo_usuario') || '');
  const [tab, setTab] = useState('actividades');

  // Estados persistentes completos
  const [data, setData] = useState(() => ({
    actividades: JSON.parse(localStorage.getItem('actividades')) || [],
    agenda: JSON.parse(localStorage.getItem('agenda')) || [],
    gacetillas: JSON.parse(localStorage.getItem('gacetillas')) || [],
    coberturas: JSON.parse(localStorage.getItem('coberturas')) || [],
    tareas: JSON.parse(localStorage.getItem('tareas')) || []
  }));

  useEffect(() => {
    Object.entries(data).forEach(([key, val]) => localStorage.setItem(key, JSON.stringify(val)));
  }, [data]);

  const add = (sec, item) => setData(p => ({ ...p, [sec]: [...p[sec], { ...item, id: Date.now() }] }));
  const remove = (sec, id) => setData(p => ({ ...p, [sec]: p[sec].filter(i => i.id !== id) }));
  const moveTask = (id, newStatus) => setData(p => ({ ...p, tareas: p.tareas.map(t => t.id === id ? {...t, status: newStatus} : t) }));

  if (!usuario) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginBox}>
          <h2>Carbó Comunica - Acceso</h2>
          <input type="password" placeholder="Ingrese clave..." onChange={(e) => { 
            if(CLAVES_ACCESO[e.target.value]) { 
              setUsuario(CLAVES_ACCESO[e.target.value]); 
              localStorage.setItem('carbo_usuario', CLAVES_ACCESO[e.target.value]); 
            } 
          }} style={styles.input} />
        </div>
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
            <p style={styles.subtitle}>Operador/a: {usuario}</p>
          </div>
        </div>
        <button onClick={() => { setUsuario(''); localStorage.removeItem('carbo_usuario'); }} style={styles.logout}>Salir ✕</button>
        <img src="/comunicacion.png" alt="Logo Com" style={styles.logo} />
      </header>

      <nav style={styles.nav}>
        {['actividades', 'agenda', 'gacetillas', 'coberturas', 'tareas'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{...styles.tab, backgroundColor: tab === t ? '#fff' : '#1e3a8a', color: tab === t ? '#1e3a8a' : '#fff'}}>{t.toUpperCase()}</button>
        ))}
      </nav>

      <main style={styles.main}>
        {tab === 'actividades' && <Section title="Actividades" data={data.actividades} add={(i) => add('actividades', i)} remove={(id) => remove('actividades', id)} fields={['fecha', 'nivel', 'descripcion']} />}
        {tab === 'agenda' && <Section title="Agenda" data={data.agenda} add={(i) => add('agenda', i)} remove={(id) => remove('agenda', id)} fields={['fecha', 'evento', 'nivel']} />}
        {tab === 'gacetillas' && <Section title="Gacetillas" data={data.gacetillas} add={(i) => add('gacetillas', i)} remove={(id) => remove('gacetillas', id)} fields={['fecha', 'tema', 'destinatario']} />}
        {tab === 'coberturas' && <Section title="Coberturas" data={data.coberturas} add={(i) => add('coberturas', i)} remove={(id) => remove('coberturas', id)} fields={['evento', 'personal', 'notas']} />}
        {tab === 'tareas' && <Kanban data={data.tareas} add={(i) => add('tareas', i)} remove={(id) => remove('tareas', id)} move={moveTask} />}
      </main>
    </div>
  );
}

function Section({ title, data, add, remove, fields }) {
  const [form, setForm] = useState({});
  return (
    <div>
      <h2>{title}</h2>
      <div style={styles.formRow}>
        {fields.map(f => <input key={f} placeholder={f} onChange={(e) => setForm({...form, [f]: e.target.value})} style={styles.inputField} />)}
        <button onClick={() => { add(form); setForm({}); }} style={styles.btnAdd}>Agregar</button>
      </div>
      {data.map(i => <div key={i.id} style={styles.card}>{Object.values(i).filter(v => typeof v === 'string').join(' | ')} <button onClick={() => remove(i.id)} style={styles.btnDel}>🗑️</button></div>)}
    </div>
  );
}

function Kanban({ data, add, remove, move }) {
  const [text, setText] = useState('');
  return (
    <div>
      <h2>Tablero de Tareas</h2>
      <input placeholder="Nueva tarea..." value={text} onChange={(e) => setText(e.target.value)} style={styles.inputField} />
      <button onClick={() => { add({texto: text, status: 'Pendiente'}); setText(''); }} style={styles.btnAdd}>Crear Tarea</button>
      <div style={styles.kanbanBoard}>
        {['Pendiente', 'Progreso', 'Completado'].map(col => (
          <div key={col} style={styles.col}>
            <h3>{col}</h3>
            {data.filter(i => i.status === col).map(i => (
              <div key={i.id} style={styles.taskCard}>
                {i.texto}
                <div style={styles.btnGroup}>
                  {col !== 'Pendiente' && <button onClick={() => move(i.id, 'Pendiente')}>↺</button>}
                  {col !== 'Completado' && <button onClick={() => move(i.id, col === 'Pendiente' ? 'Progreso' : 'Completado')}>→</button>}
                  <button onClick={() => remove(i.id)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { fontFamily: 'sans-serif', backgroundColor: '#f1f5f9', minHeight: '100vh' },
  header: { backgroundColor: '#1e3a8a', color: '#fff', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  headerGroup: { display: 'flex', alignItems: 'center', gap: '20px' },
  logo: { height: '50px' },
  nav: { display: 'flex', justifyContent: 'center', backgroundColor: '#1e3a8a', gap: '5px', padding: '10px' },
  tab: { padding: '10px 20px', cursor: 'pointer', border: 'none', fontWeight: 'bold', borderRadius: '4px' },
  main: { padding: '30px', backgroundColor: '#fff', margin: '20px', borderRadius: '8px' },
  formRow: { display: 'flex', gap: '10px', marginBottom: '20px' },
  inputField: { padding: '10px', borderRadius: '4px', border: '1px solid #ccc' },
  btnAdd: { padding: '10px 20px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  card: { padding: '15px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' },
  kanbanBoard: { display: 'flex', gap: '20px', marginTop: '20px' },
  col: { flex: 1, backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px' },
  taskCard: { padding: '10px', backgroundColor: '#fff', margin: '10px 0', borderRadius: '4px', border: '1px solid #ddd', display: 'flex', justifyContent: 'space-between' },
  btnGroup: { display: 'flex', gap: '5px' },
  btnDel: { background: 'none', border: 'none', cursor: 'pointer' },
  logout: { padding: '8px 16px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  loginContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f1f5f9' },
  loginBox: { padding: '40px', backgroundColor: '#fff', borderRadius: '8px', textAlign: 'center' }
};
