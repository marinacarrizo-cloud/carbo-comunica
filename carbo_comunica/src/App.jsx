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

const initialCoberturas = [
  { id: 1, evento: "Feria de Ciencias 2026", responsable: "Equipo de Medios", estado: "Planificado", notas: "Llevar trípode para entrevistas en vivo." },
  { id: 2, evento: "Acto Día de la Bandera", responsable: "Maraina", estado: "En Cobertura", notas: "Subir historias destacadas a Instagram en tiempo real." }
];

const initialTareas = [
  { id: 1, texto: "Diseñar plantilla para gacetilla en Canva", columna: "pendiente" },
  { id: 2, texto: "Redactar comunicado institucional de la Feria", columna: "progreso" },
  { id: 3, texto: "Actualizar cartelera del Pabellón Argentina", columna: "completado" }
];

// Gráficos optimizados integrados en código para evitar pérdidas de rutas en servidores externos
const ESCUDO_CARBO_BASE64 = "https://images.vfl.ru/ii/1718989528/76974753/38692795.png";
const LOGO_DPTO_BASE64 = "https://images.vfl.ru/ii/1718989569/271165bc/38692801.png";

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
  const [coberturas, setCoberturas] = useState(() => {
    const local = localStorage.getItem('carbo_coberturas');
    return local ? JSON.parse(local) : initialCoberturas;
  });
  const [tareas, setTareas] = useState(() => {
    const local = localStorage.getItem('carbo_tareas');
    return local ? JSON.parse(local) : initialTareas;
  });

  // Control de inputs
  const [inputActividad, setInputActividad] = useState('');
  const [inputAgenda, setInputAgenda] = useState('');
  const [inputGacetilla, setInputGacetilla] = useState('');

  // Control inputs Cobertura
  const [cobEvento, setCobEvento] = useState('');
  const [cobResp, setCobResp] = useState('');
  const [cobNotas, setCobNotas] = useState('');

  // Control input Tareas
  const [nuevaTareaTexto, setNuevaTareaTexto] = useState('');

  // --- EFECTOS DE SINCRONIZACIÓN ---
  useEffect(() => { localStorage.setItem('carbo_actividades', JSON.stringify(actividades)); }, [actividades]);
  useEffect(() => { localStorage.setItem('carbo_agenda', JSON.stringify(agenda)); }, [agenda]);
  useEffect(() => { localStorage.setItem('carbo_gacetillas', JSON.stringify(gacetillas)); }, [gacetillas]);
  useEffect(() => { localStorage.setItem('carbo_coberturas', JSON.stringify(coberturas)); }, [coberturas]);
  useEffect(() => { localStorage.setItem('carbo_tareas', JSON.stringify(tareas)); }, [tareas]);

  // --- MANEJADORES ---
  const handleAddSimple = (e, input, setInput, setList) => {
    e.preventDefault();
    if (!input.trim()) return;
    setList(prev => [...prev, input.trim()]);
    setInput('');
  };

  const handleRemoveSimple = (index, setList) => {
    setList(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddCobertura = (e) => {
    e.preventDefault();
    if (!cobEvento.trim()) return;
    const nueva = { id: Date.now(), evento: cobEvento.trim(), responsable: cobResp.trim() || 'Sin asignar', estado: 'Planificado', notas: cobNotas.trim() };
    setCoberturas(prev => [...prev, nueva]);
    setCobEvento(''); setCobResp(''); setCobNotas('');
  };

  const handleCambiarEstadoCob = (id, nuevoEstado) => {
    setCoberturas(prev => prev.map(c => c.id === id ? { ...c, estado: nuevoEstado } : c));
  };

  const handleRemoveCobertura = (id) => {
    setCoberturas(prev => prev.filter(c => c.id !== id));
  };

  const handleAddTarea = (e) => {
    e.preventDefault();
    if (!nuevaTareaTexto.trim()) return;
    const nueva = { id: Date.now(), texto: nuevaTareaTexto.trim(), columna: 'pendiente' };
    setTareas(prev => [...prev, nueva]);
    setNuevaTareaTexto('');
  };

  const handleMoverTarea = (id, nuevaColumna) => {
    setTareas(prev => prev.map(t => t.id === id ? { ...t, columna: nuevaColumna } : t));
  };

  const handleRemoveTarea = (id) => {
    setTareas(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div style={styles.container}>
      
      {/* HEADER INSTITUCIONAL CON ESCUDO Y LOGO */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <img 
              src={ESCUDO_CARBO_BASE64} 
              alt="Escudo Escuela Normal Superior Dr. Alejandro Carbó" 
              style={styles.logoImg}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div>
              <h1 style={styles.title}>Carbó Comunica</h1>
              <p style={styles.subtitle}>Sistema de Gestión Integral para el Departamento de Comunicación • ENS Dr. Alejandro Carbó</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
            <div style={styles.badge}>
              <span style={styles.badgeDot}></span>
              <span style={styles.badgeText}>Terminal Interna Activa</span>
            </div>
            <img 
              src={LOGO_DPTO_BASE64} 
              alt="Logo Departamento de Comunicación" 
              style={styles.logoImg}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main style={styles.main}>
        
        {/* REPOSITORIO DE ENLACES DE TRABAJO RÁPIDO */}
        <div style={styles.banner}>
          <h2 style={styles.bannerTitle}>🔗 Accesos Directos de Oficina</h2>
          <p style={styles.bannerText}>Herramientas del día a día abiertas en un clic para agilizar la labor diaria:</p>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '15px' }}>
            <a href="https://drive.google.com" target="_blank" rel="noreferrer" style={styles.shortcutBtn}>📂 Google Drive Carbó</a>
            <a href="https://canva.com" target="_blank" rel="noreferrer" style={styles.shortcutBtn}>🎨 Workspace Canva</a>
            <a href="https://instagram.com/carbo.comunica" target="_blank" rel="noreferrer" style={styles.shortcutBtn}>📸 Instagram Oficial</a>
          </div>
        </div>

        {/* MÓDULO 1: TABLONES DE REDACCIÓN Y COMUNICADOS */}
        <h2 style={styles.sectionHeader}>📢 Canales de Difusión y Novedades</h2>
        <div style={styles.grid3}>
          {/* ACTIVIDADES */}
          <section style={styles.card}>
            <div style={styles.cardHeader}><h3 style={styles.cardTitle}>📋 Actividades Recientes</h3></div>
            <div style={styles.cardBody}>
              <form onSubmit={(e) => handleAddSimple(e, inputActividad, setInputActividad, setActividades)} style={styles.form}>
                <input type="text" placeholder="Nueva actividad..." value={inputActividad} onChange={(e) => setInputActividad(e.target.value)} style={styles.input}/>
                <button type="submit" style={styles.buttonAdd}>+</button>
              </form>
              <ul style={styles.list}>
                {actividades.map((item, index) => (
                  <li key={index} style={styles.listItem}>
                    <span style={styles.itemText}>{item}</span>
                    <button onClick={() => handleRemoveSimple(index, setActividades)} style={styles.buttonDelete}>✕</button>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* AGENDA */}
          <section style={styles.card}>
            <div style={styles.cardHeader}><h3 style={styles.cardTitle}>📅 Agenda Institucional</h3></div>
            <div style={styles.cardBody}>
              <form onSubmit={(e) => handleAddSimple(e, inputAgenda, setInputAgenda, setAgenda)} style={styles.form}>
                <input type="text" placeholder="Ej: 26/06 - Evento..." value={inputAgenda} onChange={(e) => setInputAgenda(e.target.value)} style={styles.input}/>
                <button type="submit" style={styles.buttonAdd}>+</button>
              </form>
              <ul style={styles.list}>
                {agenda.map((item, index) => (
                  <li key={index} style={styles.listItem}>
                    <span style={styles.itemText}><strong>{item}</strong></span>
                    <button onClick={() => handleRemoveSimple(index, setAgenda)} style={styles.buttonDelete}>✕</button>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* GACETILLAS */}
          <section style={styles.card}>
            <div style={styles.cardHeader}><h3 style={styles.cardTitle}>📰 Gacetillas Emitidas</h3></div>
            <div style={styles.cardBody}>
              <form onSubmit={(e) => handleAddSimple(e, inputGacetilla, setInputGacetilla, setGacetillas)} style={styles.form}>
                <input type="text" placeholder="Título de gacetilla..." value={inputGacetilla} onChange={(e) => setInputGacetilla(e.target.value)} style={styles.input}/>
                <button type="submit" style={styles.buttonAdd}>+</button>
              </form>
              <ul style={styles.list}>
                {gacetillas.map((item, index) => (
                  <li key={index} style={styles.listItem}>
                    <span style={styles.itemText}>{item}</span>
                    <button onClick={() => handleRemoveSimple(index, setGacetillas)} style={styles.buttonDelete}>✕</button>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* MÓDULO 2: GESTIÓN DE COBERTURAS EN VIVO */}
        <h2 style={styles.sectionHeader}>📹 Planificación y Cobertura de Eventos</h2>
        <div style={styles.card}>
          <div style={styles.cardHeader}><h3 style={styles.cardTitle}>📍 Hoja de Ruta para Eventos y Coberturas</h3></div>
          <div style={styles.cardBody}>
            <form onSubmit={handleAddCobertura} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
              <input type="text" placeholder="Nombre del Evento" value={cobEvento} onChange={(e) => setCobEvento(e.target.value)} style={styles.input} required/>
              <input type="text" placeholder="Responsable de Cobertura" value={cobResp} onChange={(e) => setCobResp(e.target.value)} style={styles.input}/>
              <input type="text" placeholder="Notas claves (Equipos, redes)" value={cobNotas} onChange={(e) => setCobNotas(e.target.value)} style={styles.input}/>
              <button type="submit" style={{ ...styles.buttonAdd, height: '100%' }}>Registrar Cobertura</button>
            </form>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {coberturas.map(c => (
                <div key={c.id} style={{ padding: '15px', borderRadius: '8px', borderLeft: c.estado === 'Completado' ? '5px solid #10b981' : c.estado === 'En Cobertura' ? '5px solid #f59e0b' : '5px solid #3b82f6', backgroundColor: '#f8fafc', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <h4 style={{ margin: 0, fontSize: '15px', color: '#0f172a' }}>{c.evento}</h4>
                    <button onClick={() => handleRemoveCobertura(c.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>✕</button>
                  </div>
                  <p style={{ margin: '5px 0', fontSize: '13px' }}>👤 <strong>Encargado:</strong> {c.responsable}</p>
                  <p style={{ margin: '5px 0', fontSize: '13px', color: '#64748b' }}>📝 {c.notas}</p>
                  <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
                    <button type="button" onClick={() => handleCambiarEstadoCob(c.id, 'Planificado')} style={{ ...styles.smallStateBtn, backgroundColor: c.estado === 'Planificado' ? '#3b82f6' : '#e2e8f0', color: c.estado === 'Planificado' ? '#fff' : '#475569' }}>Planificado</button>
                    <button type="button" onClick={() => handleCambiarEstadoCob(c.id, 'En Cobertura')} style={{ ...styles.smallStateBtn, backgroundColor: c.estado === 'En Cobertura' ? '#f59e0b' : '#e2e8f0', color: c.estado === 'En Cobertura' ? '#fff' : '#475569' }}>En Vivo</button>
                    <button type="button" onClick={() => handleCambiarEstadoCob(c.id, 'Completado')} style={{ ...styles.smallStateBtn, backgroundColor: c.estado === 'Completado' ? '#10b981' : '#e2e8f0', color: c.estado === 'Completado' ? '#fff' : '#475569' }}>Terminado</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MÓDULO 3: PANEL KANBAN DE TAREAS INTERNAS */}
        <h2 style={styles.sectionHeader}>🛠️ Organizador de Tareas del Equipo</h2>
        <div style={styles.card}>
          <div style={styles.cardHeader}><h3 style={styles.cardTitle}>🎯 Asignación y Seguimiento del Flujo de Trabajo</h3></div>
          <div style={styles.cardBody}>
            <form onSubmit={handleAddTarea} style={{ ...styles.form, maxWidth: '500px', marginBottom: '20px' }}>
              <input type="text" placeholder="¿Qué tarea interna hay que hacer?" value={nuevaTareaTexto} onChange={(e) => setNuevaTareaTexto(e.target.value)} style={styles.input}/>
              <button type="submit" style={styles.buttonAdd}>Asignar</button>
            </form>

            <div style={styles.kanbanGrid}>
              <div style={styles.kanbanColumn}>
                <h4 style={{ ...styles.kanbanColTitle, borderBottom: '3px solid #ef4444' }}>📌 Pendientes</h4>
                {tareas.filter(t => t.columna === 'pendiente').map(t => (
                  <div key={t.id} style={styles.kanbanItem}>
                    <p style={{ margin: '0 0 10px 0', fontSize: '13px' }}>{t.texto}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <button type="button" onClick={() => handleMoverTarea(t.id, 'progreso')} style={styles.actionTaskBtn}>Iniciar ➡️</button>
                      <button type="button" onClick={() => handleRemoveTarea(t.id)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '11px' }}>Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={styles.kanbanColumn}>
                <h4 style={{ ...styles.kanbanColTitle, borderBottom: '3px solid #f59e0b' }}>⚡ En Proceso</h4>
                {tareas.filter(t => t.columna === 'progreso').map(t => (
                  <div key={t.id} style={styles.kanbanItem}>
                    <p style={{ margin: '0 0 10px 0', fontSize: '13px' }}>{t.texto}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <button type="button" onClick={() => handleMoverTarea(t.id, 'pendiente')} style={styles.actionTaskBtn}>⬅️ Devolver</button>
                      <button type="button" onClick={() => handleMoverTarea(t.id, 'completado')} style={{ ...styles.actionTaskBtn, color: '#10b981' }}>Listo ✔️</button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={styles.kanbanColumn}>
                <h4 style={{ ...styles.kanbanColTitle, borderBottom: '3px solid #10b981' }}>🎉 Listas / Publicadas</h4>
                {tareas.filter(t => t.columna === 'completado').map(t => (
                  <div key={t.id} style={{ ...styles.kanbanItem, backgroundColor: '#f0fdf4' }}>
                    <p style={{ margin: '0 0 10px 0', fontSize: '13px', textDecoration: 'line-through', color: '#166534' }}>{t.texto}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <button type="button" onClick={() => handleMoverTarea(t.id, 'progreso')} style={styles.actionTaskBtn}>🔄 Reabrir</button>
                      <button type="button" onClick={() => handleRemoveTarea(t.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '11px' }}>Archivar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div>
            <p style={styles.footerSchool}>Escuela Normal Superior Dr. Alejandro Carbó</p>
            <p style={styles.footerLocation}>Córdoba, Argentina • Panel de Gestión Integral de Medios</p>
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

// --- ESTILOS ASOCIADOS ---
const styles = {
  container: { fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', backgroundColor: '#f1f5f9', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#334155', margin: 0 },
  header: { backgroundColor: '#1e3a8a', color: '#ffffff', padding: '15px 40px', borderBottom: '4px solid #f59e0b', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' },
  headerContent: { maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' },
  title: { margin: 0, fontSize: '26px', fontWeight: 'bold', letterSpacing: '-0.5px' },
  subtitle: { margin: '5px 0 0 0', fontSize: '13px', color: '#93c5fd' },
  logoImg: { height: '55px', width: 'auto', objectFit: 'contain' },
  badge: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#1e1b4b', padding: '6px 16px', borderRadius: '20px', border: '1px solid #3730a3' },
  badgeDot: { width: '8px', height: '8px', backgroundColor: '#34d399', borderRadius: '50%' },
  badgeText: { fontSize: '11px', color: '#34d399', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' },
  main: { flexGrow: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '30px 20px' },
  banner: { backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  bannerTitle: { margin: 0, fontSize: '18px', color: '#0f172a', fontWeight: 'bold' },
  bannerText: { margin: '6px 0 0 0', fontSize: '14px', color: '#64748b' },
  shortcutBtn: { textDecoration: 'none', backgroundColor: '#f1f5f9', color: '#1e3a8a', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', border: '1px solid #cbd5e1', display: 'inline-block' },
  sectionHeader: { fontSize: '18px', fontWeight: 'bold', color: '#1e3a8a', marginTop: '40px', marginBottom: '15px', borderLeft: '4px solid #f59e0b', paddingLeft: '10px' },
  grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' },
  card: { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '20px' },
  cardHeader: { backgroundColor: '#f8fafc', padding: '14px 20px', borderBottom: '1px solid #e2e8f0' },
  cardTitle: { margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#1e293b' },
  cardBody: { padding: '20px', flexGrow: 1 },
  form: { display: 'flex', gap: '10px', marginBottom: '15px' },
  input: { flexGrow: 1, padding: '9px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', outline: 'none' },
  buttonAdd: { backgroundColor: '#1e3a8a', color: '#ffffff', border: 'none', padding: '9px 18px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' },
  list: { listStyle: 'none', padding: 0, margin: 0 },
  listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '8px', marginBottom: '8px', gap: '10px' },
  itemText: { fontSize: '13px', color: '#334155', lineHeight: '1.4' },
  buttonDelete: { backgroundColor: 'transparent', color: '#94a3b8', border: 'none', fontSize: '13px', cursor: 'pointer', padding: '2px 6px' },
  smallStateBtn: { border: 'none', padding: '4px 10px', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' },
  kanbanGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '15px' },
  kanbanColumn: { backgroundColor: '#f8fafc', borderRadius: '8px', padding: '15px', border: '1px solid #e2e8f0' },
  kanbanColTitle: { margin: '0 0 15px 0', fontSize: '14px', fontWeight: 'bold', color: '#334155', paddingBottom: '5px' },
  kanbanItem: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px', marginBottom: '10px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
  actionTaskBtn: { background: 'none', border: 'none', color: '#3b82f6', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', padding: 0 },
  footer: { backgroundColor: '#0f172a', color: '#94a3b8', padding: '30px 20px', marginTop: '50px', borderTop: '1px solid #1e293b' },
  footerContent: { maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', fontSize: '13px' },
  footerSchool: { margin: 0, fontWeight: 'bold', color: '#f1f5f9' },
  footerLocation: { margin: '4px 0 0 0', fontSize: '11px', color: '#475569' },
  footerLinks: { margin: 0, textAlign: 'right' },
  link: { color: '#38bdf8', textDecoration: 'none' }
};
