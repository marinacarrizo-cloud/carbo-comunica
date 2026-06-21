import React, { useState, useEffect } from 'react';

// Credenciales
const CLAVES_ACCESO = {
  "carbo2026mar": "Marina Carrizo",
  "carbo2026juan": "Juan Pérez",
  "carbo2026dir": "Prof. Lic. Marcela Rosana Quevedo"
};

const NIVELES_CARBO = ["Institucional", "Nivel Inicial", "Nivel Primario", "Nivel Secundario", "Nivel Superior"];

export default function App() {
  const [usuario, setUsuario] = useState(() => localStorage.getItem('carbo_usuario') || '');
  const [activeTab, setActiveTab] = useState('actividades');
  
  // Estado inicial completo
  const [data, setData] = useState({
    actividades: JSON.parse(localStorage.getItem('actividades')) || [],
    agenda: JSON.parse(localStorage.getItem('agenda')) || [],
    gacetillas: JSON.parse(localStorage.getItem('gacetillas')) || [],
    coberturas: JSON.parse(localStorage.getItem('coberturas')) || [],
    tareas: JSON.parse(localStorage.getItem('tareas')) || []
  });

  // Persistencia de todo el estado
  useEffect(() => {
    Object.entries(data).forEach(([key, val]) => localStorage.setItem(key, JSON.stringify(val)));
  }, [data]);

  const add = (sec, item) => setData(p => ({ ...p, [sec]: [...p[sec], { ...item, id: Date.now() }] }));
  const remove = (sec, id) => setData(p => ({ ...p, [sec]: p[sec].filter(i => i.id !== id) }));

  if (!usuario) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
        <h2>Acceso Carbó</h2>
        <input type="password" placeholder="Ingrese clave..." onChange={(e) => { 
          if(CLAVES_ACCESO[e.target.value]) { 
            setUsuario(CLAVES_ACCESO[e.target.value]); 
            localStorage.setItem('carbo_usuario', CLAVES_ACCESO[e.target.value]); 
          } 
        }} style={{ padding: '15px', width: '250px' }} />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img src="/escudo.png" alt="Escudo" style={styles.logo} />
          <div>
            <h1 style={styles.title}>Carbó Comunica</h1>
            <p>Operador: {usuario}</p>
          </div>
        </div>
        <button onClick={() => { setUsuario(''); localStorage.removeItem('carbo_usuario'); }} style={styles.logout}>Salir</button>
        <img src="/comunicacion.png" alt="Logo Com" style={styles.logo} />
      </header>

      <nav style={styles.nav}>
        {['actividades', 'agenda', 'gacetillas', 'coberturas', 'tareas'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{...styles.tab, backgroundColor: activeTab === t ? '#1e3a8a' : '#fff', color: activeTab === t ? '#fff' : '#1e3a8a'}}>{t.toUpperCase()}</button>
        ))}
      </nav>

      <main style={styles.main}>
        {activeTab === 'actividades' && <Section title="Actividades" data={data.actividades} add={(i) => add('actividades', i)} remove={(id) => remove('actividades', id)} fields={['fecha', 'nivel', 'descripcion']} />}
        {activeTab === 'agenda' && <Section title="Agenda" data={data.agenda} add={(i) => add('agenda', i)} remove={(id) => remove('agenda', id)} fields={['fecha', 'evento', 'nivel']} />}
        {activeTab === 'gacetillas' && <Section title="Gacetillas" data={data.gacetillas} add={(i) => add('gacetillas', i)} remove={(id) => remove('gacetillas', id)} fields={['fecha', 'tema', 'destinatario']} />}
        {activeTab === 'coberturas' && <Section title="Coberturas" data={data.coberturas} add={(i) => add('coberturas', i)} remove={(id) => remove('coberturas', id)} fields={['evento', 'personal', 'notas']} />}
        {activeTab === 'tareas' && <Kanban data={data.tareas} add={(i) => add('tareas', i)} remove={(id) => remove('tareas', id)} />}
      </main>
    </div>
  );
}

function Section({ title, data, add, remove, fields }) {
  const [form, setForm] = useState({});
  return (
    <div>
      <h3>{title}</h3>
      {fields.map(f => <input key={f} placeholder={f} onChange={(e) => setForm({...form, [f]: e.target.value})} style={styles.input} />)}
      <button onClick={() => { add(form); setForm({}); }}>Agregar</button>
      {data.map(i => <div key={i.id} style={styles.card}>{Object.values(i).filter(v => typeof v === 'string').join(' | ')} <button onClick={() => remove(i.id)}>🗑️</button></div>)}
    </div>
  );
}

function Kanban({ data, add, remove }) {
  const [text, setText] = useState('');
  return (
    <div>
      <h3>Tablero Kanban</h3>
      <input placeholder="Nueva Tarea..." value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={() => add({texto: text, status: 'Pendiente'})}>Agregar</button>
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        {['Pendiente', 'Progreso', 'Completado'].map(col => (
          <div key={col} style={styles.col}><h4>{col}</h4>{data.filter(i => i.status === col).map(i => <div key={i.id} style={styles.card}>{i.texto} <button onClick={() => remove(i.id)}>X</button></div>)}</div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { fontFamily: 'sans-serif', backgroundColor: '#f1f5f9', minHeight: '100vh' },
  header: { backgroundColor: '#1e3a8a', color: '#fff', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { height: '50px' },
  nav: { display: 'flex', justifyContent: 'center', padding: '10px', backgroundColor: '#e2e8f0' },
  tab: { padding: '10px 20px', cursor: 'pointer', border: 'none', fontWeight: 'bold' },
  main: { padding: '20px', backgroundColor: '#fff', margin: '20px', borderRadius: '8px' },
  card: { padding: '15px', border: '1px solid #ddd', margin: '10px 0', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' },
  input: { padding: '8px', margin: '5px' },
  col: { flex: 1, backgroundColor: '#f9f9f9', padding: '10px', minHeight: '300px' },
  logout: { backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px' }
};
