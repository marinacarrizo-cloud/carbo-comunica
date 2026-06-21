import React, { useState, useEffect } from 'react';

// Credenciales de acceso
const CLAVES_ACCESO = {
  "carbo2026mar": "Marina Carrizo",
  "carbo2026juan": "Juan Pérez",
  "carbo2026dir": "Prof. Lic. Marcela Rosana Quevedo"
};

const NIVELES_CARBO = ["Institucional (todos los niveles)", "Nivel Inicial", "Nivel Primario", "Nivel Secundario", "Nivel Superior"];
const PERSONAL_AUTORIZADO = ["Marina Carrizo", "Juan Pérez", "Equipo General"];

// Datos semilla
const initialActividades = [{ fecha: "21/06/2026", nivel: "Nivel Superior", texto: "Feria de Ciencias - Coordinación." }];
const initialAgenda = [{ fecha: "26/06/2026", nivel: "Nivel Superior", texto: "Feria de Ciencias - 26/06." }];
const initialGacetillas = [{ fecha: "21/06/2026", nivel: "Nivel Superior", texto: "Invitación Feria de Ciencias." }];
const initialCoberturas = [{ id: 1, evento: "Acto Día de la Bandera", personal: [{ nombre: "Juan Pérez", funcion: "Fotos" }], notas: "Cobertura completa" }];
const initialTareas = [{ id: 1, texto: "Tarea ejemplo", responsable: "Marina Carrizo", fechaSolicitud: "2026-06-21", fechaLimite: "2026-06-25", columna: "pendiente" }];

export default function App() {
  const [usuarioLogueado, setUsuarioLogueado] = useState(() => localStorage.getItem('carbo_usuario_sesion') || '');
  const [inputClave, setInputClave] = useState('');
  const [errorLogin, setErrorLogin] = useState(false);

  const [actividades, setActividades] = useState(() => { const local = localStorage.getItem('carbo_actividades_v13'); return local ? JSON.parse(local) : initialActividades; });
  const [agenda, setAgenda] = useState(() => { const local = localStorage.getItem('carbo_agenda_v13'); return local ? JSON.parse(local) : initialAgenda; });
  const [gacetillas, setGacetillas] = useState(() => { const local = localStorage.getItem('carbo_gacetillas_v13'); return local ? JSON.parse(local) : initialGacetillas; });
  const [coberturas, setCoberturas] = useState(() => { const local = localStorage.getItem('carbo_coberturas_v13'); return local ? JSON.parse(local) : initialCoberturas; });
  const [tareas, setTareas] = useState(() => { const local = localStorage.getItem('carbo_tareas_v13'); return local ? JSON.parse(local) : initialTareas; });

  useEffect(() => { localStorage.setItem('carbo_actividades_v13', JSON.stringify(actividades)); }, [actividades]);
  useEffect(() => { localStorage.setItem('carbo_agenda_v13', JSON.stringify(agenda)); }, [agenda]);
  useEffect(() => { localStorage.setItem('carbo_gacetillas_v13', JSON.stringify(gacetillas)); }, [gacetillas]);
  useEffect(() => { localStorage.setItem('carbo_coberturas_v13', JSON.stringify(coberturas)); }, [coberturas]);
  useEffect(() => { localStorage.setItem('carbo_tareas_v13', JSON.stringify(tareas)); }, [tareas]);

  const handleLogin = (e) => { e.preventDefault(); if (CLAVES_ACCESO[inputClave.trim()]) { setUsuarioLogueado(CLAVES_ACCESO[inputClave.trim()]); localStorage.setItem('carbo_usuario_sesion', CLAVES_ACCESO[inputClave.trim()]); } else { setErrorLogin(true); } };
  const handleLogout = () => { setUsuarioLogueado(''); localStorage.removeItem('carbo_usuario_sesion'); };

  if (!usuarioLogueado) {
    return (
      <div style={{ backgroundColor: '#1e3a8a', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
        <form onSubmit={handleLogin} style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px', width: '300px', textAlign: 'center' }}>
          <h2>Carbó Comunica</h2>
          <input type="password" value={inputClave} onChange={(e) => setInputClave(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px' }} placeholder="Clave..." />
          {errorLogin && <p style={{ color: 'red' }}>Clave incorrecta</p>}
          <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#1e3a8a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Ingresar</button>
        </form>
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
              <p style={styles.subtitle}>Operador/a: <strong>{usuarioLogueado}</strong></p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={handleLogout} style={styles.buttonLogout}>Salir ✕</button>
            <img src="/comunicacion.png" alt="Logo Comunicación" style={styles.logoImg} />
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.banner}>
          <h3>🔗 Enlaces Operativos</h3>
          <div style={styles.categoriesContainer}>
            <a href="https://enscarbo-cba.infd.edu.ar/sitio/" target="_blank" rel="noreferrer" style={styles.btnSolidBlue}>🏛️ Web oficial</a>
            <a href="https://web.whatsapp.com/" target="_blank" rel="noreferrer" style={styles.btnSolidGreen}>💬 WhatsApp</a>
            <a href="https://drive.google.com/drive/u/1/my-drive" target="_blank" rel="noreferrer" style={styles.btnOutline}>📂 Drive</a>
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
  title: { margin: 0, fontSize: '24px' },
  subtitle: { margin: 0, fontSize: '14px', opacity: 0.9 },
  buttonLogout: { backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' },
  main: { maxWidth: '1200px', margin: '20px auto', padding: '20px' },
  banner: { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' },
  categoriesContainer: { display: 'flex', gap: '15px', marginTop: '15px' },
  btnSolidBlue: { backgroundColor: '#1e3a8a', color: '#fff', padding: '10px 15px', textDecoration: 'none', borderRadius: '5px', fontSize: '14px' },
  btnSolidGreen: { backgroundColor: '#16a34a', color: '#fff', padding: '10px 15px', textDecoration: 'none', borderRadius: '5px', fontSize: '14px' },
  btnOutline: { border: '1px solid #1e3a8a', color: '#1e3a8a', padding: '10px 15px', textDecoration: 'none', borderRadius: '5px', fontSize: '14px' }
};
