import React, { useState, useEffect } from 'react';

const CLAVES_ACCESO = { "carbo2026mar": "Marina Carrizo", "carbo2026juan": "Juan Pérez" };
const NIVELES = ["Nivel Inicial", "Nivel Primario", "Nivel Secundario", "Nivel Superior"];

export default function App() {
  const [usuario, setUsuario] = useState(() => localStorage.getItem('carbo_usuario_sesion') || '');
  const [activeTab, setActiveTab] = useState('actividades');
  
  // Estados para datos
  const [data, setData] = useState({
    actividades: JSON.parse(localStorage.getItem('actividades')) || [],
    agenda: JSON.parse(localStorage.getItem('agenda')) || [],
    gacetillas: JSON.parse(localStorage.getItem('gacetillas')) || [],
    coberturas: JSON.parse(localStorage.getItem('coberturas')) || [],
    tareas: JSON.parse(localStorage.getItem('tareas')) || []
  });

  // Guardado automático
  useEffect(() => {
    Object.keys(data).forEach(key => localStorage.setItem(key, JSON.stringify(data[key])));
  }, [data]);

  const addItem = (section, newItem) => {
    setData(prev => ({ ...prev, [section]: [...prev[section], { ...newItem, id: Date.now() }] }));
  };

  const removeItem = (section, id) => {
    setData(prev => ({ ...prev, [section]: prev[section].filter(item => item.id !== id) }));
  };

  if (!usuario) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
        <h2>Acceso Carbó</h2>
        <input type="password" onBlur={(e) => { if(CLAVES_ACCESO[e.target.value]) { setUsuario(CLAVES_ACCESO[e.target.value]); localStorage.setItem('carbo_usuario_sesion', CLAVES_ACCESO[e.target.value]); } }} placeholder="Ingrese clave" style={{ padding: '10px', width: '250px' }} />
      </div>
    );
  }

  // Renderizado de secciones
  const renderSection = () => {
    switch(activeTab) {
      case 'actividades':
      case 'agenda':
      case 'gacetillas':
        return <GenericList section={activeTab} items={data[activeTab]} addItem={addItem} removeItem={removeItem} />;
      case 'coberturas':
        return <CoberturasList items={data.coberturas} addItem={addItem} removeItem={removeItem} />;
      case 'tareas':
        return <TareasList items={data.tareas} addItem={addItem} removeItem={removeItem} />;
      default: return null;
    }
  };

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
          <button onClick={() => { setUsuario(''); localStorage.removeItem('carbo_usuario_sesion'); }} style={styles.buttonLogout}>Salir ✕</button>
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
        {renderSection()}
      </main>
    </div>
  );
}

// Componentes auxiliares de lista
function GenericList({ section, items, addItem, removeItem }) {
  const [text, setText] = useState('');
  return (
    <div>
      <input placeholder="Descripción..." value={text} onChange={(e) => setText(e.target.value)} style={{ padding: '8px', width: '300px' }} />
      <button onClick={() => { addItem(section, { text }); setText(''); }} style={styles.btnAdd}>Agregar</button>
      <ul style={{ marginTop: '20px' }}>
        {items.map(i => <li key={i.id} style={styles.item}>{i.text} <button onClick={() => removeItem(section, i.id)}>🗑️</button></li>)}
      </ul>
    </div>
  );
}

function CoberturasList({ items, addItem, removeItem }) {
  const [ev, setEv] = useState('');
  return (
    <div>
      <input placeholder="Evento..." value={ev} onChange={(e) => setEv(e.target.value)} style={{ padding: '8px', width: '200px' }} />
      <button onClick={() => { addItem('coberturas', { text: ev }); setEv(''); }} style={styles.btnAdd}>Registrar</button>
      {items.map(i => <div key={i.id} style={styles.item}>{i.text} <button onClick={() => removeItem('coberturas', i.id)}>🗑️</button></div>)}
    </div>
  );
}

function TareasList({ items, addItem, removeItem }) {
  const [t, setT] = useState('');
  return (
    <div>
      <input placeholder="Nueva Tarea..." value={t} onChange={(e) => setT(e.target.value)} style={{ padding: '8px', width: '200px' }} />
      <button onClick={() => { addItem('tareas', { text: t }); setT(''); }} style={styles.btnAdd}>Asignar</button>
      {items.map(i => <div key={i.id} style={styles.item}>{i.text} <button onClick={() => removeItem('tareas', i.id)}>🗑️</button></div>)}
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
  btnAdd: { padding: '8px 16px', marginLeft: '10px', cursor: 'pointer' },
  item: { padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' },
  title: { margin: 0 },
  subtitle: { margin: 0, fontSize: '14px' }
};
