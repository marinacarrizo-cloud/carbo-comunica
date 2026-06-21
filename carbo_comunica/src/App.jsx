import React, { useState, useEffect } from 'react';

// Datos semilla de la Escuela Normal Superior Dr. Alejandro Carbó
const initialActividades = [
  "Organización Día de la Bandera.",
  "Feria de Ciencias - 26/06.",
  "Cobertura aniversario institucional."
];

const initialAgenda = [
  "20/06 - Acto Día de la Bandera.",
  "26/06 - Feria de Ciencias.",
  "Reunión con directivos."
];

const initialGacetillas = [
  "Invitación Feria de Ciencias.",
  "Día de la Bandera."
];

export default function App() {
  // --- ESTADOS CON PERSISTENCIA LOCAL ---
  const [actividades, setActividades] = useState(() => {
    const local = localStorage.getItem('carbo_actividades');
    return local ? JSON.parse(local) : initialActividades;
  });

  const [agenda, setAgenda] = useState(() => {
    const local = localStorage.getItem('carbo_agenda');
    return local ? JSON.parse(local) : initialAgenda;
  });

  const [gacetillas, setGacetillas] = useState(() => {
    const local = localStorage.getItem('carbo_gacetillas');
    return local ? JSON.parse(local) : initialGacetillas;
  });

  const [inputActividad, setInputActividad] = useState('');
  const [inputAgenda, setInputAgenda] = useState('');
  const [inputGacetilla, setInputGacetilla] = useState('');

  // --- EFECTOS DE SINCRONIZACIÓN ---
  useEffect(() => {
    localStorage.setItem('carbo_actividades', JSON.stringify(actividades));
  }, [actividades]);

  useEffect(() => {
    localStorage.setItem('carbo_agenda', JSON.stringify(agenda));
  }, [agenda]);

  useEffect(() => {
    localStorage.setItem('carbo_gacetillas', JSON.stringify(gacetillas));
  }, [gacetillas]);

  // --- MANEJADORES DE LOGICA (ABM) ---
  const handleAdd = (e, input, setInput, setList) => {
    e.preventDefault();
    if (!input.trim()) return;
    setList(prev => [...prev, input.trim()]);
    setInput('');
  };

  const handleRemove = (index, setList) => {
    setList(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div style={styles.container}>
      
      {/* HEADER INSTITUCIONAL */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.title}>Carbó Comunica</h1>
            <p style={styles.subtitle}>Departamento de Comunicación Institucional • ENS Dr. Alejandro Carbó</p>
          </div>
          <div style={styles.badge}>
            <span style={styles.badgeDot}></span>
            <span style={styles.badgeText}>Terminal Operativa Local</span>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main style={styles.main}>
        <div style={styles.banner}>
          <h2 style={styles.bannerTitle}>Panel de Gestión de Contenidos</h2>
          <p style={styles.bannerText}>Modificá, agregá o eliminá las novedades en tiempo real. Los cambios persisten en este navegador de forma gratuita.</p>
        </div>

        {/* REJILLA DE SECCIONES */}
        <div style={styles.grid}>
          
          {/* SECCIÓN: ACTIVIDADES */}
          <section style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>📋 Actividades Recientes</h3>
            </div>
            <div style={styles.cardBody}>
              <form onSubmit={(e) => handleAdd(e, inputActividad, setInputActividad, setActividades)} style={styles.form}>
                <input 
                  type="text" 
                  placeholder="Nueva actividad..." 
                  value={inputActividad}
                  onChange={(e) => setInputActividad(e.target.value)}
                  style={styles.input}
                />
                <button type="submit" style={styles.buttonAdd}>+</button>
              </form>
              <ul style={styles.list}>
                {actividades.map((item, index) => (
                  <li key={index} style={styles.listItem}>
                    <span style={styles.itemText}>{item}</span>
                    <button onClick={() => handleRemove(index, setActividades)} style={styles.buttonDelete}>✕</button>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* SECCIÓN: AGENDA */}
          <section style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>📅 Agenda Institucional</h3>
            </div>
            <div style={styles.cardBody}>
              <form onSubmit={(e) => handleAdd(e, inputAgenda, setInputAgenda, setAgenda)} style={styles.form}>
                <input 
                  type="text" 
                  placeholder="Ej: 26/06 - Evento..." 
                  value={inputAgenda}
                  onChange={(e) => setInputAgenda(e.target.value)}
                  style={styles.input}
                />
                <button type="submit" style={styles.buttonAdd}>+</button>
              </form>
              <ul style={styles.list}>
                {agenda.map((item, index) => (
                  <li key={index} style={styles.listItem}>
                    <span style={styles.itemText}><strong>{item}</strong></span>
                    <button onClick={() => handleRemove(index, setAgenda)} style={styles.buttonDelete}>✕</button>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* SECCIÓN: GACETILLAS */}
          <section style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>📰 Gacetillas Emitidas</h3>
            </div>
            <div style={styles.cardBody}>
              <form onSubmit={(e) => handleAdd(e, inputGacetilla, setInputGacetilla, setGacetillas)} style={styles.form}>
                <input 
                  type="text" 
                  placeholder="Título de gacetilla..." 
                  value={inputGacetilla}
                  onChange={(e) => setInputGacetilla(e.target.value)}
                  style={styles.input}
                />
                <button type="submit" style={styles.buttonAdd}>+</button>
              </form>
              <ul style={styles.list}>
                {gacetillas.map((item, index) => (
                  <li key={index} style={styles.listItem}>
                    <span style={styles.itemText}>{item}</span>
                    <button onClick={() => handleRemove(index, setGacetillas)} style={styles.buttonDelete}>✕</button>
                  </li>
                ))}
              </ul>
            </div>
          </section>

        </div>
      </main>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div>
            <p style={styles.footerSchool}>Escuela Normal Superior Dr. Alejandro Carbó</p>
            <p style={styles.footerLocation}>Córdoba, Argentina • Plataforma de Uso Interno</p>
          </div>
          <div style={styles.footerLinks}>
            <p><strong>IG:</strong> <a href="https://instagram.com/carbo.comunica" target="_blank" rel="noreferrer" style={styles.link}>@carbo.comunica</a></p>
            <p><strong>FB:</strong> Escuela Normal Superior Dr. Alejandro Carbó</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- ESTILOS NATIVOS CSS-IN-JS (Garantizan diseño profesional sin librerías externas) ---
const styles = {
  container: { fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#334155', margin: 0 },
  header: { backgroundColor: '#1e3a8a', color: '#ffffff', padding: '20px 40px', borderBottom: '4px solid #f59e0b', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' },
  headerContent: { maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' },
  title: { margin: 0, fontSize: '28px', fontWeight: 'bold', letterSpacing: '-0.5px' },
  subtitle: { margin: '5px 0 0 0', fontSize: '13px', color: '#93c5fd' },
  badge: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#1e1b4b', padding: '6px 16px', borderRadius: '20px', border: '1px solid #3730a3' },
  badgeDot: { width: '8px', height: '8px', backgroundColor: '#34d399', borderRadius: '50%' },
  badgeText: { fontSize: '11px', color: '#34d399', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' },
  main: { flexGrow: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '40px 20px' },
  banner: { backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  bannerTitle: { margin: 0, fontSize: '20px', color: '#0f172a' },
  bannerText: { margin: '6px 0 0 0', fontSize: '14px', color: '#64748b' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' },
  card: { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  cardHeader: { backgroundColor: '#f8fafc', padding: '16px 20px', borderBottom: '1px solid #e2e8f0' },
  cardTitle: { margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#1e293b' },
  cardBody: { padding: '20px', flexGrow: 1 },
  form: { display: 'flex', gap: '10px', marginBottom: '20px' },
  input: { flexGrow: 1, padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' },
  buttonAdd: { backgroundColor: '#1e3a8a', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' },
  list: { listStyle: 'none', padding: 0, margin: 0 },
  listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '8px', marginBottom: '8px', gap: '10px' },
  itemText: { fontSize: '14px', color: '#334155', lineHeight: '1.5' },
  buttonDelete: { backgroundColor: 'transparent', color: '#94a3b8', border: 'none', fontSize: '14px', cursor: 'pointer', padding: '4px 8px' },
  footer: { backgroundColor: '#0f172a', color: '#94a3b8', padding: '32px 20px', marginTop: '40px', borderTop: '1px solid #1e293b' },
  footerContent: { maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', fontSize: '14px' },
  footerSchool: { margin: 0, fontWeight: 'bold', color: '#f1f5f9' },
  footerLocation: { margin: '4px 0 0 0', fontSize: '12px', color: '#475569' },
  footerLinks: { margin: 0, textAlign: 'right' },
  link: { color: '#38bdf8', textDecoration: 'none' }
};
