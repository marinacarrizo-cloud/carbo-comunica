import React, { useState, useEffect } from 'react';

const CLAVES_ACCESO = { "carbo2026mar": "Marina Carrizo", "carbo2026juan": "Juan Pérez" };
const NIVELES_CARBO = ["Nivel Inicial", "Nivel Primario", "Nivel Secundario", "Nivel Superior"];

export default function App() {
  const [usuario, setUsuario] = useState(() => localStorage.getItem('carbo_usuario_sesion') || '');
  const [activeTab, setActiveTab] = useState('actividades');
  
  // Estados para cada sección
  const [actividades, setActividades] = useState(JSON.parse(localStorage.getItem('actividades')) || []);
  const [agenda, setAgenda] = useState(JSON.parse(localStorage.getItem('agenda')) || []);
  const [gacetillas, setGacetillas] = useState(JSON.parse(localStorage.getItem('gacetillas')) || []);
  const [coberturas, setCoberturas] = useState(JSON.parse(localStorage.getItem('coberturas')) || []);
  const [tareas, setTareas] = useState(JSON.parse(localStorage.getItem('tareas')) || []);

  // Persistencia
  useEffect(() => { localStorage.setItem('actividades', JSON.stringify(actividades)); }, [actividades]);
  useEffect(() => { localStorage.setItem('agenda', JSON.stringify(agenda)); }, [agenda]);
  useEffect(() => { localStorage.setItem('gacetillas', JSON.stringify(gacetillas)); }, [gacetillas]);
  useEffect(() => { localStorage.setItem('coberturas', JSON.stringify(coberturas)); }, [coberturas]);
  useEffect(() => { localStorage.setItem('tareas', JSON.stringify(tareas)); }, [tareas]);

  const handleLogout = () => { setUsuario(''); localStorage.removeItem('carbo_usuario_sesion'); };

  if (!usuario) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Acceso Carbó</h2>
        <input type="password" onChange={(e) => { if(CLAVES_ACCESO[e.target.value]) { setUsuario(CLAVES_ACCESO[e.target.value]); localStorage.setItem('carbo_usuario_sesion', CLAVES_ACCESO[e.target.value]); } }} placeholder="Clave" />
      </div>
    );
  }

  const TabButton = ({ name, label }) => (
    <button 
      onClick={() => setActiveTab(name)} 
      style={{ ...styles.tabBtn, backgroundColor: activeTab === name ? '#1e3a8a' : '#ddd', color: activeTab === name ? '#fff' : '#000' }}
    >
      {label}
    </button>
  );

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
        <TabButton name="actividades" label="Actividades" />
        <TabButton name="agenda" label="Agenda" />
        <TabButton name="gacetillas" label="Gacetillas" />
        <TabButton name="coberturas" label="Coberturas" />
        <TabButton name="tareas" label="Tareas" />
      </nav>

      <main style={styles.main}>
        <h3>Sección: {activeTab.toUpperCase()}</h3>
        <p>Panel de gestión activo. Podés empezar a cargar datos.</p>
        {/* Aquí iría la lógica de renderizado de cada sección */}
      </main>
    </div>
  );
}

const styles = {
  container: { fontFamily: 'sans-serif', backgroundColor: '#f1f5f9', minHeight: '100vh' },
  header: { backgroundColor: '#1e3a8a', color: '#ffffff', padding: '20px 40px' },
  headerContent: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' },
  logoImg: { height: '60px', width: 'auto' },
  nav: { display: 'flex', gap: '10px', padding: '20px', justifyContent: 'center' },
  tabBtn: { padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  main: { maxWidth: '1200px', margin: '0 auto', padding: '20px', backgroundColor: '#fff', borderRadius: '8px' },
  buttonLogout: { backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' },
  title: { margin: 0 },
  subtitle: { margin: 0, fontSize: '14px', opacity: 0.9 }
};
