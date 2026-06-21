import React, { useState, useEffect } from 'react';

// Credenciales
const CLAVES_ACCESO = { "carbo2026mar": "Marina Carrizo", "carbo2026juan": "Juan Pérez" };
const NIVELES = ["Nivel Inicial", "Nivel Primario", "Nivel Secundario", "Nivel Superior"];

export default function App() {
  const [usuario, setUsuario] = useState(() => localStorage.getItem('carbo_usuario_sesion') || '');
  const [activeTab, setActiveTab] = useState('actividades');

  // Recuperar estados complejos
  const [actividades, setActividades] = useState(() => JSON.parse(localStorage.getItem('actividades')) || []);
  const [agenda, setAgenda] = useState(() => JSON.parse(localStorage.getItem('agenda')) || []);
  const [gacetillas, setGacetillas] = useState(() => JSON.parse(localStorage.getItem('gacetillas')) || []);
  const [coberturas, setCoberturas] = useState(() => JSON.parse(localStorage.getItem('coberturas')) || []);
  const [tareas, setTareas] = useState(() => JSON.parse(localStorage.getItem('tareas')) || []);

  // Guardado persistente
  useEffect(() => { localStorage.setItem('actividades', JSON.stringify(actividades)); }, [actividades]);
  useEffect(() => { localStorage.setItem('agenda', JSON.stringify(agenda)); }, [agenda]);
  useEffect(() => { localStorage.setItem('gacetillas', JSON.stringify(gacetillas)); }, [gacetillas]);
  useEffect(() => { localStorage.setItem('coberturas', JSON.stringify(coberturas)); }, [coberturas]);
  useEffect(() => { localStorage.setItem('tareas', JSON.stringify(tareas)); }, [tareas]);

  const handleLogout = () => { setUsuario(''); localStorage.removeItem('carbo_usuario_sesion'); };

  if (!usuario) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
        <h2>Acceso Carbó</h2>
        <input type="password" onChange={(e) => { if(CLAVES_ACCESO[e.target.value]) { setUsuario(CLAVES_ACCESO[e.target.value]); localStorage.setItem('carbo_usuario_sesion', CLAVES_ACCESO[e.target.value]); } }} placeholder="Ingrese clave" style={{ padding: '10px', width: '250px' }} />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <img src="/escudo.png" alt="Escudo Carbó" style={styles.logoImg} />
            <div>
              <h1 style={styles.title}>Carbó Comunica</h1>
              <p style={styles.subtitle}>Operador/a: <strong>{usuario}</strong></p>
            </div>
          </div>
          <button onClick={handleLogout} style={styles.buttonLogout}>Salir ✕</button>
          <img src="/comunicacion.png" alt="Logo Comunicación" style={styles.logoImg} />
        </div>
      </header>

      <nav style={styles.nav}>
        {['actividades', 'agenda', 'gacetillas', 'coberturas', 'tareas'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ ...styles.tabBtn, backgroundColor: activeTab === tab ? '#1e3a8a' : '#ddd', color: activeTab === tab ? '#fff' : '#000' }}>
            {tab.toUpperCase()}
          </button>
        ))}
      </nav>

      <main style={styles.main}>
        {activeTab === 'actividades' && <FormularioSimple label="Actividad" data={actividades} setData={setActividades} />}
        {activeTab === 'agenda' && <FormularioSimple label="Evento en Agenda" data={agenda} setData={setAgenda} />}
        {activeTab === 'gacetillas' && <FormularioSimple label="Gacetilla" data={gacetillas} setData={setGacetillas} />}
        {activeTab === 'coberturas' && <FormularioCoberturas data={coberturas} setData={setCoberturas} />}
        {activeTab === 'tareas' && <FormularioTareas data={tareas} setData={setTareas} />}
      </main>
    </div>
  );
}

// Sub-componente para listas simples
function FormularioSimple({ label, data, setData }) {
  const [text, setText] = useState('');
  const [fecha, setFecha] = useState('');
  return (
    <div>
      <h3>Gestión de {label}</h3>
      <input type="date" onChange={(e) => setFecha(e.target.value)} value={fecha} />
      <input placeholder="Descripción..." value={text} onChange={(e) => setText(e.target.value)} style={{ marginLeft: '10px' }} />
      <button onClick={() => { setData([...data, { id: Date.now(), fecha, text }]); setText(''); }}>Agregar</button>
      {data.map(item => <div key={item.id} style={styles.item}>{item.fecha} - {item.text} <button onClick={() => setData(data.filter(i => i.id !== item.id))}>🗑️</button></div>)}
    </div>
  );
}

// Sub-componente complejo para Coberturas
function FormularioCoberturas({ data, setData }) {
  const [evento, setEvento] = useState('');
  const [notas, setNotas] = useState('');
  return (
    <div>
      <h3>Nueva Cobertura</h3>
      <input placeholder="Evento" value={evento} onChange={(e) => setEvento(e.target.value)} />
      <input placeholder="Notas" value={notas} onChange={(e) => setNotas(e.target.value)} style={{ marginLeft: '10px' }} />
      <button onClick={() => { setData([...data, { id: Date.now(), evento, notas }]); setEvento(''); setNotas(''); }}>Registrar</button>
      {data.map(i => <div key={i.id} style={styles.item}><strong>{i.evento}</strong>: {i.notas} <button onClick={() => setData(data.filter(x => x.id !== i.id))}>🗑️</button></div>)}
    </div>
  );
}

// Sub-componente complejo para Tareas
function FormularioTareas({ data, setData }) {
  const [texto, setTexto] = useState('');
  const [resp, setResp] = useState('');
  return (
    <div>
      <h3>Asignación de Tareas</h3>
      <input placeholder="Tarea" value={texto} onChange={(e) => setTexto(e.target.value)} />
      <input placeholder="Responsable" value={resp} onChange={(e) => setResp(e.target.value)} style={{ marginLeft: '10px' }} />
      <button onClick={() => { setData([...data, { id: Date.now(), texto, resp }]); setTexto(''); setResp(''); }}>Asignar</button>
      {data.map(i => <div key={i.id} style={styles.item}>{i.texto} (Responsable: {i.resp}) <button onClick={() => setData(data.filter(x => x.id !== i.id))}>🗑️</button></div>)}
    </div>
  );
}

const styles = {
  container: { fontFamily: 'sans-serif', backgroundColor: '#f1f5f9', minHeight: '100vh' },
  header: { backgroundColor: '#1e3a8a', color: '#ffffff', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  headerContent: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  logoImg: { height: '60px', width: 'auto' },
  nav: { display: 'flex', gap: '10px', padding: '20px', justifyContent: 'center' },
  tabBtn: { padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  main: { maxWidth: '800px', margin: '20px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '8px' },
  buttonLogout: { backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' },
  item: { padding: '10px', borderBottom: '1px solid #eee' },
  title: { margin: 0 },
  subtitle: { margin: 0, fontSize: '14px' }
};
