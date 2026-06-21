import React, { useState, useEffect } from 'react';

// Credenciales
const CLAVES_ACCESO = {
  "carbo2026mar": "Marina Carrizo",
  "carbo2026juan": "Juan Pérez",
  "carbo2026dir": "Prof. Lic. Marcela Rosana Quevedo (Directora de la Unidad Académica)"
};

const NIVELES_CARBO = ["Institucional (todos los niveles)", "Nivel Inicial", "Nivel Primario", "Nivel Secundario", "Nivel Superior"];
const PERSONAL_AUTORIZADO = ["Marina Carrizo", "Juan Pérez", "Equipo General"];

export default function App() {
  const [usuarioLogueado, setUsuarioLogueado] = useState(() => localStorage.getItem('carbo_usuario_sesion') || '');
  const [inputClave, setInputClave] = useState('');
  const [errorLogin, setErrorLogin] = useState(false);

  // Estados de datos
  const [actividades, setActividades] = useState(() => JSON.parse(localStorage.getItem('carbo_actividades')) || []);
  const [agenda, setAgenda] = useState(() => JSON.parse(localStorage.getItem('carbo_agenda')) || []);
  const [gacetillas, setGacetillas] = useState(() => JSON.parse(localStorage.getItem('carbo_gacetillas')) || []);
  const [coberturas, setCoberturas] = useState(() => JSON.parse(localStorage.getItem('carbo_coberturas')) || []);
  const [tareas, setTareas] = useState(() => JSON.parse(localStorage.getItem('carbo_tareas')) || []);

  // Persistencia
  useEffect(() => { localStorage.setItem('carbo_actividades', JSON.stringify(actividades)); }, [actividades]);
  useEffect(() => { localStorage.setItem('carbo_agenda', JSON.stringify(agenda)); }, [agenda]);
  useEffect(() => { localStorage.setItem('carbo_gacetillas', JSON.stringify(gacetillas)); }, [gacetillas]);
  useEffect(() => { localStorage.setItem('carbo_coberturas', JSON.stringify(coberturas)); }, [coberturas]);
  useEffect(() => { localStorage.setItem('carbo_tareas', JSON.stringify(tareas)); }, [tareas]);

  const handleLogin = (e) => {
    e.preventDefault();
    const user = CLAVES_ACCESO[inputClave.trim()];
    if (user) { setUsuarioLogueado(user); localStorage.setItem('carbo_usuario_sesion', user); }
    else { setErrorLogin(true); }
  };

  const handleLogout = () => { setUsuarioLogueado(''); localStorage.removeItem('carbo_usuario_sesion'); };

  const generarInformeSemanal = () => {
    const ventanaInforme = window.open('', '_blank', 'width=700,height=600');
    ventanaInforme.document.write(`<pre>INFORME SEMANAL\n----------------\nTareas completadas: ${tareas.filter(t => t.columna === 'completado').length}</pre>`);
  };

  if (!usuarioLogueado) {
    return (
      <div style={{ backgroundColor: '#1e3a8a', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <form onSubmit={handleLogin} style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px', width: '300px' }}>
          <h2>Carbó Comunica</h2>
          <input type="password" placeholder="Clave..." onChange={(e) => setInputClave(e.target.value)} style={{ width: '100%', padding: '10px' }} />
          <button type="submit" style={{ width: '100%', marginTop: '10px' }}>Ingresar</button>
        </form>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <img src="/escudo.png" alt="Logo" style={styles.logoImg} />
            <div>
              <h1 style={styles.title}>Carbó Comunica</h1>
              <p style={styles.subtitle}>Operador/a: {usuarioLogueado}</p>
            </div>
          </div>
          <button onClick={generarInformeSemanal}>📋 Informe</button>
          <button onClick={handleLogout} style={{ backgroundColor: '#ef4444', color: '#fff' }}>Salir ✕</button>
          <img src="/comunicacion.png" alt="Logo" style={styles.logoImg} />
        </div>
      </header>

      <main style={styles.main}>
        {/* Aquí va tu lógica de secciones que ya tenías */}
        <h3>Gestión de Contenidos</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {/* Actividades */}
          <div style={styles.card}>
            <h4>Actividades</h4>
            {actividades.map((a, i) => <div key={i}>{a.texto}</div>)}
          </div>
          {/* Agenda */}
          <div style={styles.card}>
            <h4>Agenda</h4>
            {agenda.map((a, i) => <div key={i}>{a.texto}</div>)}
          </div>
          {/* Tareas (Kanban) */}
          <div style={styles.card}>
            <h4>Tareas (Kanban)</h4>
            {tareas.map((t, i) => <div key={i}>{t.texto} - {t.columna}</div>)}
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
  title: { margin: 0 },
  subtitle: { margin: 0, fontSize: '14px' },
  card: { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' },
  main: { maxWidth: '1200px', margin: '20px auto', padding: '20px' }
};
