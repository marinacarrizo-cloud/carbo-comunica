import React, { useState, useEffect } from 'react';

const CLAVES_ACCESO = {
  "carbo2026mar": "Marina Carrizo",
  "carbo2026juan": "Juan Pérez",
  "carbo2026dir": "Prof. Lic. Marcela Rosana Quevedo"
};

const NIVELES_CARBO = ["Institucional", "Nivel Inicial", "Nivel Primario", "Nivel Secundario", "Nivel Superior"];

export default function App() {
  const [user, setUser] = useState(() => localStorage.getItem('user') || '');
  const [tab, setTab] = useState('actividades');
  
  const [data, setData] = useState({
    actividades: JSON.parse(localStorage.getItem('actividades')) || [],
    agenda: JSON.parse(localStorage.getItem('agenda')) || [],
    gacetillas: JSON.parse(localStorage.getItem('gacetillas')) || [],
    coberturas: JSON.parse(localStorage.getItem('coberturas')) || [],
    tareas: JSON.parse(localStorage.getItem('tareas')) || []
  });

  useEffect(() => {
    Object.entries(data).forEach(([key, val]) => localStorage.setItem(key, JSON.stringify(val)));
  }, [data]);

  const add = (sec, item) => setData(p => ({ ...p, [sec]: [...p[sec], { ...item, id: Date.now() }] }));
  const remove = (sec, id) => setData(p => ({ ...p, [sec]: p[sec].filter(i => i.id !== id) }));

  if (!user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f1f5f9' }}>
        <input type="password" placeholder="Clave..." onChange={(e) => { if(CLAVES_ACCESO[e.target.value]) { setUser(CLAVES_ACCESO[e.target.value]); localStorage.setItem('user', CLAVES_ACCESO[e.target.value]); } }} style={{ padding: '15px' }} />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img src="/escudo.png" alt="Escudo" style={styles.logo} />
          <div>
            <h1 style={styles.title}>Carbó Comunica</h1>
            <p>Operador: {user}</p>
          </div>
        </div>
        <button onClick={() => { setUser(''); localStorage.removeItem('user'); }} style={styles.logout}>Salir</button>
        <img src="/comunicacion.png" alt="Logo" style={styles.logo} />
      </header>

      <nav style={styles.nav}>
        {['actividades', 'agenda', 'gacetillas', 'coberturas', 'tareas'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{...styles.tab, backgroundColor: tab === t ? '#1e3a8a' : '#fff'}}>{t.toUpperCase()}</button>
        ))}
      </nav>

      <main style={styles.main}>
        {tab === 'actividades' && <GenericSection title="Actividades" data={data.actividades} add={(i) => add('actividades', i)} remove={(id) => remove('actividades', id)} />}
        {tab === 'agenda' && <GenericSection title="Agenda" data={data.agenda} add={(i) => add('agenda', i)} remove={(id) => remove('agenda', id)} />}
        {tab === 'gacetillas' && <GenericSection title="Gacetillas" data={data.gacetillas} add={(i) => add('gacetillas', i)} remove={(id) => remove('gacetillas', id)} />}
        {tab === 'coberturas' && <Coberturas data={data.coberturas} add={(i) => add('coberturas', i)} remove={(id) => remove('coberturas', id)} />}
        {tab === 'tareas' && <Tareas data={data.tareas} add={(i) => add('tareas', i)} remove={(id) => remove('tareas', id)} />}
      </main>
    </div>
  );
}

function GenericSection({ title, data, add, remove }) {
  const [f, setF] = useState(''); const [t, setT] = useState('');
  return (
    <div>
      <h3>{title}</h3>
      <input type="date" onChange={(e) => setF(e.target.value)} />
      <input placeholder="Descripción" value={t} onChange={(e) => setT(e.target.value)} />
      <button onClick={() => { add({f, t}); setT(''); }}>Agregar</button>
      {data.map(i => <div key={i.id} style={styles.card}>{i.f} - {i.t} <button onClick={() => remove(i.id)}>X</button></div>)}
    </div>
  );
}

function Coberturas({ data, add, remove }) {
  const [ev, setEv] = useState(''); const [no, setNo] = useState('');
  return (
    <div>
      <h3>Coberturas</h3>
      <input placeholder="Evento" value={ev} onChange={(e) => setEv(e.target.value)} />
      <input placeholder="Notas" value={no} onChange={(e) => setNo(e.target.value)} />
      <button onClick={() => add({ev, no})}>Guardar</button>
      {data.map(i => <div key={i.id} style={styles.card}>{i.ev} - {i.no} <button onClick={() => remove(i.id)}>X</button></div>)}
    </div>
  );
}

function Tareas({ data, add, remove }) {
  const [tx, setTx] = useState('');
  return (
    <div>
      <h3>Tareas (Kanban)</h3>
      <input placeholder="Nueva tarea" value={tx} onChange={(e) => setTx(e.target.value)} />
      <button onClick={() => add({tx, col: 'Pendiente'})}>Agregar</button>
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        {['Pendiente', 'Progreso', 'Completado'].map(col => (
          <div key={col} style={styles.col}><h4>{col}</h4>{data.filter(i => i.col === col).map(i => <div key={i.id} style={styles.card}>{i.tx} <button onClick={() => remove(i.id)}>X</button></div>)}</div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { fontFamily: 'sans-serif', backgroundColor: '#f1f5f9', minHeight: '100vh' },
  header: { backgroundColor: '#1e3a8a', color: '#fff', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { height: '60px' },
  nav: { display: 'flex', justifyContent: 'center', padding: '10px' },
  tab: { padding: '10px 20px', cursor: 'pointer', border: 'none', margin: '5px' },
  main: { padding: '20px', backgroundColor: '#fff', borderRadius: '8px', maxWidth: '1000px', margin: 'auto' },
  card: { padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' },
  col: { flex: 1, backgroundColor: '#f9f9f9', padding: '10px' },
  logout: { backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px' }
};
