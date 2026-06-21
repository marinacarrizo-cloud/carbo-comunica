import React, { useState, useEffect } from 'react';

// Datos semilla reales de la Escuela Normal Superior Dr. Alejandro Carbó
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
  { id: 1, evento: "Acto Día de la Bandera", personal: [ { nombre: "Prof. Juan Pérez", funcion: "Registró fotos y videos" }, { nombre: "Marina Carrizo", funcion: "Maestra de ceremonias / Locutora" } ], notas: "Subir historias destacadas a Instagram." }
];

const initialTareas = [
  { id: 1, texto: "Diseñar plantilla para gacetilla en Canva", responsable: "Marina Carrizo", fechaLimite: "2026-06-23", fechaRealizada: "", columna: "pendiente" },
  { id: 2, texto: "Redactar comunicado institucional de la Feria", responsable: "Juan Pérez", fechaLimite: "2026-06-25", fechaRealizada: "", columna: "progreso" }
];

export default function App() {
  // --- ESTADOS CON PERSISTENCIA LOCAL ---
  const [actividades, setActividades] = useState(() => {
    const local = localStorage.getItem('carbo_actividades_v2');
    return local ? JSON.parse(local) : initialActividades;
  });
  const [agenda, setAgenda] = useState(() => {
    const local = localStorage.getItem('carbo_agenda_v2');
    return local ? JSON.parse(local) : initialAgenda;
  });
  const [gacetillas, setGacetillas] = useState(() => {
    const local = localStorage.getItem('carbo_gacetillas_v2');
    return local ? JSON.parse(local) : initialGacetillas;
  });
  const [coberturas, setCoberturas] = useState(() => {
    const local = localStorage.getItem('carbo_coberturas_v2');
    return local ? JSON.parse(local) : initialCoberturas;
  });
  const [tareas, setTareas] = useState(() => {
    const local = localStorage.getItem('carbo_tareas_v2');
    return local ? JSON.parse(local) : initialTareas;
  });

  // Control de inputs simples
  const [inputActividad, setInputActividad] = useState('');
  const [inputAgenda, setInputAgenda] = useState('');
  const [inputGacetilla, setInputGacetilla] = useState('');

  // Control inputs Cobertura
  const [cobEvento, setCobEvento] = useState('');
  const [cobPersona1, setCobPersona1] = useState('');
  const [cobFuncion1, setCobFuncion1] = useState('');
  const [cobPersona2, setCobPersona2] = useState('');
  const [cobFuncion2, setCobFuncion2] = useState('');
  const [cobNotas, setCobNotas] = useState('');

  // Control inputs Tareas
  const [nuevaTareaTexto, setNuevaTareaTexto] = useState('');
  const [tareaResp, setTareaResp] = useState('Marina Carrizo');
  const [tareaLimite, setTareaLimite] = useState('');

  // --- EFECTOS DE SINCRONIZACIÓN ---
  useEffect(() => { localStorage.setItem('carbo_actividades_v2', JSON.stringify(actividades)); }, [actividades]);
  useEffect(() => { localStorage.setItem('carbo_agenda_v2', JSON.stringify(agenda)); }, [agenda]);
  useEffect(() => { localStorage.setItem('carbo_gacetillas_v2', JSON.stringify(gacetillas)); }, [gacetillas]);
  useEffect(() => { localStorage.setItem('carbo_coberturas_v2', JSON.stringify(coberturas)); }, [coberturas]);
  useEffect(() => { localStorage.setItem('carbo_tareas_v2', JSON.stringify(tareas)); }, [tareas]);

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
    
    const personalArray = [];
    if (cobPersona1.trim()) personalArray.push({ nombre: cobPersona1.trim(), funcion: cobFuncion1.trim() || 'Cobertura General' });
    if (cobPersona2.trim()) personalArray.push({ nombre: cobPersona2.trim(), funcion: cobFuncion2.trim() || 'Cobertura General' });

    const nueva = {
      id: Date.now(),
      evento: cobEvento.trim(),
      personal: personalArray.length > 0 ? personalArray : [{ nombre: 'Equipo de Medios', funcion: 'Cobertura General' }],
      notas: cobNotas.trim()
    };
    
    setCoberturas(prev => [...prev, nueva]);
    setCobEvento(''); setCobPersona1(''); setCobFuncion1(''); setCobPersona2(''); setCobFuncion2(''); setCobNotas('');
  };

  const handleRemoveCobertura = (id) => {
    setCoberturas(prev => prev.filter(c => c.id !== id));
  };

  const handleAddTarea = (e) => {
    e.preventDefault();
    if (!nuevaTareaTexto.trim()) return;
    const nueva = {
      id: Date.now(),
      texto: nuevaTareaTexto.trim(),
      responsable: tareaResp,
      fechaLimite: tareaLimite || 'Sin fecha',
      fechaRealizada: '',
      columna: 'pendiente'
    };
    setTareas(prev => [...prev, nueva]);
    setNuevaTareaTexto(''); setTareaLimite('');
  };

  const handleMoverTarea = (id, nuevaColumna) => {
    const hoy = new Date().toLocaleDateString('es-AR');
    setTareas(prev => prev.map(t => {
      if (t.id === id) {
        return { 
          ...t, 
          columna: nuevaColumna,
          fechaRealizada: nuevaColumna === 'completado' ? hoy : ''
        };
      }
      return t;
    }));
  };

  const handleRemoveTarea = (id) => {
    setTareas(prev => prev.filter(t => t.id !== id));
  };

  // --- GENERACIÓN DE INFORME SEMANAL EN VENTANA ---
  const generarInformeSemanal = () => {
    const tareasListas = tareas.filter(t => t.columna === 'completado').map(t => `• ${t.texto}\n  [Responsable: ${t.responsable} | Límite: ${t.fechaLimite} | Realizado: ${t.fechaRealizada}]`).join('\n') || '• Sin novedades completadas.';
    const tareasEnProceso = tareas.filter(t => t.columna === 'progreso').map(t => `• ${t.texto}\n  [Responsable: ${t.responsable} | Límite: ${t.fechaLimite}]`).join('\n') || '• Sin tareas en desarrollo.';
    const gacetillasListas = gacetillas.map(g => `• ${g}`).join('\n') || '• No se emitieron gacetillas.';
    
    const coberturasListas = coberturas.map(c => {
      const personalStr = c.personal.map(p => `${p.nombre} (${p.funcion})`).join(', ');
      return `• Evento: ${c.evento}\n  [Personal: ${personalStr} ${c.notas ? `| Notas: ${c.notas}` : ''}]`;
    }).join('\n') || '• No se registraron coberturas.';

    const textoInforme = `===========================================================
📝 INFORME SEMANAL DE GESTIÓN INSTITUCIONAL
DEPARTAMENTO DE COMUNICACIÓN - ENS DR. ALEJANDRO CARBÓ
===========================================================

1. TAREAS PROCESADAS Y PUBLICADAS (COMPLETADAS):
${tareasListas}

2. GACETILLAS EMITIDAS:
${gacetillasListas}

3. COBERTURAS DE EVENTOS REGISTRADAS:
${coberturasListas}

4. ACCIONES EN CURSO / PRÓXIMA SEMANA:
${tareasEnProceso}

-----------------------------------------------------------
Generado automáticamente desde la Terminal Interna de Carbó Comunica.`;

    // Abrir una ventana limpia para copiar sin bloqueos de navegador
    const ventanaInforme = window.open('', '_blank', 'width=600,height=650');
    ventanaInforme.document.write(`
      <html>
        <head><title>Informe Semanal Carbó Comunica</title></head>
        <body style="font-family:monospace; padding:20px; background:#f8fafc; color:#0f172a;">
          <h3 style="margin-top:0;">📋 Informe Listo para Copiar</h3>
          <p style="font-family:sans-serif; font-size:13px; color:#475569;">Seleccioná el texto de abajo, copialo (Ctrl+C) y pegalo en tu WhatsApp, Word o Mail institucional.</p>
          <textarea style="width:100%; height:450px; padding:15px; font-family:monospace; font-size:12px; border:1px solid #cbd5e1; border-radius:8px;" readonly>${textoInforme}</textarea>
          <br/><button onclick="window.close()" style="margin-top:15px; padding:10px 20px; font-family:sans-serif; background:#1e3a8a; color:#fff; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">Cerrar Ventana</button>
        </body>
      </html>
    `);
  };

  return (
    <div style={styles.container}>
      
      {/* HEADER INSTITUCIONAL CON ESCUDOS VECTORIALES BLINDADOS */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Escudo del Carbó en SVG puro */}
            <svg style={styles.logoSvg} viewBox="0 0 100 120">
              <path d="M10 10 H90 V90 L50 115 L10 90 Z" fill="#5c82a6" stroke="#2b4c7e" strokeWidth="4"/>
              <rect x="42" y="25" width="16" height="65" fill="#fff" stroke="#2b4c7e" strokeWidth="2"/>
              <path d="M42 25 L50 10 L58 25 Z" fill="#334155"/>
              <text x="50" y="20" fill="#0f172a" fontSize="8" fontWeight="bold" textAnchor="middle">EDUCAR EN LA VERDAD</text>
              <text x="50" y="65" fill="#b91c1c" fontSize="24" fontWeight="bold" textAnchor="middle" fontFamily="serif">Ensac</text>
            </svg>
            <div>
              <h1 style={styles.title}>Carbó Comunica</h1>
              <p style={styles.subtitle}>Sistema de Gestión Integral para el Departamento de Comunicación • ENS Dr. Alejandro Carbó</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
            <button onClick={generarInformeSemanal} style={styles.buttonReportHeader}>
              📋 Generar Informe Semanal
            </button>
            {/* Logo de Comunicación en SVG puro */}
            <svg style={styles.logoSvg} viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#1e3a8a" strokeWidth="8" strokeDasharray="250 50"/>
              <rect x="44" y="35" width="12" height="40" fill="#fff" stroke="#1e3a8a" strokeWidth="2"/>
              <path d="M44 35 L50 22 L56 35 Z" fill="#334155"/>
              <path d="M62 40 Q72 50 62 60 M68 34 Q82 50 68 66" fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round"/>
              <text x="50" y="92" fill="#1e3a8a" fontSize="9" fontWeight="bold" textAnchor="middle">COMUNICACIÓN</text>
            </svg>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main style={styles.main}>
        
        {/* REPOSITORIO DE ENLACES DE TRABAJO RÁPIDO */}
        <div style={styles.banner}>
          <h2 style={styles.bannerTitle}>🔗 Enlaces Operativos Directos (Cuentas del Carbó)</h2>
          <p style={styles.bannerText}>Accesos configurados para abrir directamente los perfiles institucionales:</p>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '15px' }}>
            <a href="https://drive.google.com/drive/u/1/my-drive" target="_blank" rel="noreferrer" style={styles.shortcutBtn}>📂 Drive comunicación.carbo@gmail.com</a>
            <a href="https://www.canva.com/folder/all-designs" target="_blank" rel="noreferrer" style={styles.shortcutBtn}>🎨 Workspace Canva Carbó</a>
            <a href="https://business.facebook.com/" target="_blank" rel="noreferrer" style={styles.shortcutBtnMeta}>📊 Meta Business Suite</a>
            <a href="https://instagram.com/carbo.comunica" target="_blank" rel="noreferrer" style={styles.shortcutBtn}>📸 Instagram Oficial</a>
          </div>
        </div>

        {/* MÓDULO 1: TABLONES DE REDACCIÓN Y COMUNICADOS */}
        <h2 style={styles.sectionHeader}>📢 Canales de Difusión y Novedades</h2>
        <div style={styles.grid3}>
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

        {/* MÓDULO 2: GESTIÓN DE COBERTURAS DETALLADAS */}
        <h2 style={styles.sectionHeader}>📹 Planificación y Cobertura de Eventos</h2>
        <div style={styles.card}>
          <div style={styles.cardHeader}><h3 style={styles.cardTitle}>📍 Registro de Roles y Tareas en Coberturas en Vivo</h3></div>
          <div style={styles.cardBody}>
            <form onSubmit={handleAddCobertura} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px', backgroundColor: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                <input type="text" placeholder="Nombre del Evento (Ej: Acto del Día de la Bandera)" value={cobEvento} onChange={(e) => setCobEvento(e.target.value)} style={styles.input} required/>
                <input type="text" placeholder="Notas Generales del Evento" value={cobNotas} onChange={(e) => setCobNotas(e.target.value)} style={styles.input}/>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', borderTop: '1px dashed #cbd5e1', paddingTop: '10px' }}>
                <input type="text" placeholder="Personal 1 (Ej: Prof. Juan Pérez)" value={cobPersona1} onChange={(e) => setCobPersona1(e.target.value)} style={styles.input}/>
                <input type="text" placeholder="Función 1 (Ej: Registró fotos y videos)" value={cobFuncion1} onChange={(e) => setCobFuncion1(e.target.value)} style={styles.input}/>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                <input type="text" placeholder="Personal 2 (Ej: Marina Carrizo)" value={cobPersona2} onChange={(e) => setCobPersona2(e.target.value)} style={styles.input}/>
                <input type="text" placeholder="Función 2 (Ej: Maestra de ceremonias/locutora)" value={cobFuncion2} onChange={(e) => setCobFuncion2(e.target.value)} style={styles.input}/>
              </div>
              
              <button type="submit" style={{ ...styles.buttonAdd, alignSelf: 'flex-end', padding: '10px 25px' }}>Registrar Cobertura Completa</button>
            </form>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
              {coberturas.map(c => (
                <div key={c.id} style={{ padding: '20px', borderRadius: '8px', borderLeft: '5px solid #1e3a8a', backgroundColor: '#f8fafc', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                    <h4 style={{ margin: 0, fontSize: '16px', color: '#1e3a8a', fontWeight: 'bold' }}>🎬 {c.evento}</h4>
                    <button onClick={() => handleRemoveCobertura(c.id)} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: '14px' }}>✕</button>
                  </div>
                  <div style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '10px' }}>
                    <p style={{ margin: '0 0 5px 0', fontSize: '12px', fontWeight: 'bold', color: '#475569', textTransform: 'uppercase' }}>Roles Asignados:</p>
                    {c.personal.map((p, i) => (
                      <p key={i} style={{ margin: '3px 0', fontSize: '13px', color: '#334155' }}>
                        👤 <strong>{p.nombre}:</strong> {p.funcion}
                      </p>
                    ))}
                  </div>
                  {c.notas && <p style={{ margin: '0', fontSize: '12px', color: '#64748b', italic: 'true' }}>📝 <em>Notas: {c.notas}</em></p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MÓDULO 3: PANEL KANBAN CON RESPONSABLES Y FECHAS DE CONTROL */}
        <h2 style={styles.sectionHeader}>🛠️ Organizador de Tareas del Equipo</h2>
        <div style={styles.card}>
          <div style={styles.cardHeader}><h3 style={styles.cardTitle}>🎯 Asignación con Fechas Límites y de Ejecución Real</h3></div>
          <div style={styles.cardBody}>
            
            <form onSubmit={handleAddTarea} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '25px', border: '1px solid #e2e8f0' }}>
              <input type="text" placeholder="¿Qué tarea interna hay que hacer?" value={nuevaTareaTexto} onChange={(e) => setNuevaTareaTexto(e.target.value)} style={{ ...styles.input, flex: '2 1 300px' }} required/>
              
              <select value={tareaResp} onChange={(e) => setTareaResp(e.target.value)} style={styles.select}>
                <option value="Marina Carrizo">Marina Carrizo</option>
                <option value="Juan Pérez">Juan Pérez</option>
                <option value="Equipo General">Equipo General</option>
              </select>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: '#475569' }}>Límite:</span>
                <input type="date" value={tareaLimite} onChange={(e) => setTareaLimite(e.target.value)} style={styles.input}/>
              </div>
              
              <button type="submit" style={styles.buttonAdd}>Asignar Tarea</button>
            </form>

            <div style={styles.kanbanGrid}>
              {/* COLUMNA PENDIENTE */}
              <div style={styles.kanbanColumn}>
                <h4 style={{ ...styles.kanbanColTitle, borderBottom: '3px solid #ef4444' }}>📌 Pendientes</h4>
                {tareas.filter(t => t.columna === 'pendiente').map(t => (
                  <div key={t.id} style={styles.kanbanItem}>
                    <p style={styles.kanbanTaskText}>{t.texto}</p>
                    <p style={styles.kanbanMeta}>👤 Encargado: <strong>{t.responsable}</strong></p>
                    <p style={styles.kanbanMeta}>📅 Límite: <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{t.fechaLimite}</span></p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                      <button type="button" onClick={() => handleMoverTarea(t.id, 'progreso')} style={styles.actionTaskBtn}>Iniciar ➡️</button>
                      <button type="button" onClick={() => handleRemoveTarea(t.id)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '11px' }}>Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* COLUMNA EN PROCESO */}
              <div style={styles.kanbanColumn}>
                <h4 style={{ ...styles.kanbanColTitle, borderBottom: '3px solid #f59e0b' }}>⚡ En Proceso</h4>
                {tareas.filter(t => t.columna === 'progreso').map(t => (
                  <div key={t.id} style={styles.kanbanItem}>
                    <p style={styles.kanbanTaskText}>{t.texto}</p>
                    <p style={styles.kanbanMeta}>👤 Encargado: <strong>{t.responsable}</strong></p>
                    <p style={styles.kanbanMeta}>📅 Límite: <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{t.fechaLimite}</span></p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                      <button type="button" onClick={() => handleMoverTarea(t.id, 'pendiente')} style={styles.actionTaskBtn}>⬅️ Devolver</button>
                      <button type="button" onClick={() => handleMoverTarea(t.id, 'completado')} style={{ ...styles.actionTaskBtn, color: '#10b981' }}>Listo ✔️</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* COLUMNA COMPLETADO */}
              <div style={styles.kanbanColumn}>
                <h4 style={{ ...styles.kanbanColTitle, borderBottom: '3px solid #10b981' }}>🎉 Listas / Publicadas</h4>
                {tareas.filter(t => t.columna === 'completado').map(t => (
                  <div key={t.id} style={{ ...styles.kanbanItem, backgroundColor: '#f0fdf4' }}>
                    <p style={{ ...styles.kanbanTaskText, textDecoration: 'line-through', color: '#166534' }}>{t.texto}</p>
                    <p style={styles.kanbanMeta}>👤 Hizo: <strong>{t.responsable}</strong></p>
                    <p style={styles.kanbanMeta}>📅 Realizado el: <span style={{ color: '#10b981', fontWeight: 'bold' }}>{t.fechaRealizada}</span></p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
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

// --- CONFIGURACIÓN DE ESTILOS ROBUSTOS ---
const styles = {
  container: { fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', backgroundColor: '#f1f5f9', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#334155', margin: 0 },
  header: { backgroundColor: '#1e3a8a', color: '#ffffff', padding: '12px 40px', borderBottom: '4px solid #f59e0b', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' },
  headerContent: { maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' },
  title: { margin: 0, fontSize: '26px', fontWeight: 'bold', letterSpacing: '-0.5px' },
  subtitle: { margin: '3px 0 0 0', fontSize: '12px', color: '#93c5fd' },
  logoSvg: { height: '55px', width: '55px' },
  badge: { display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#1e1b4b', padding: '6px 14px', borderRadius: '20px', border: '1px solid #3730a3' },
  badgeDot: { width: '8px', height: '8px', backgroundColor: '#34d399', borderRadius: '50%' },
  badgeText: { fontSize: '10px', color: '#34d399', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' },
  main: { flexGrow: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '30px 20px' },
  banner: { backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  bannerTitle: { margin: 0, fontSize: '18px', color: '#0f172a', fontWeight: 'bold' },
  bannerText: { margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' },
  shortcutBtn: { textDecoration: 'none', backgroundColor: '#f1f5f9', color: '#1e3a8a', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', border: '1px solid #cbd5e1' },
  shortcutBtnMeta: { textDecoration: 'none', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', border: '1px solid #bae6fd' },
  buttonReportHeader: { backgroundColor: '#10b981', color: '#ffffff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(16,185,129,0.2)', transition: 'transform 0.1s active' },
  sectionHeader: { fontSize: '17px', fontWeight: 'bold', color: '#1e3a8a', marginTop: '40px', marginBottom: '15px', borderLeft: '4px solid #f59e0b', paddingLeft: '10px' },
  grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' },
  card: { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '20px' },
  cardHeader: { backgroundColor: '#f8fafc', padding: '14px 20px', borderBottom: '1px solid #e2e8f0' },
  cardTitle: { margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#1e293b' },
  cardBody: { padding: '20px', flexGrow: 1 },
  form: { display: 'flex', gap: '10px', marginBottom: '15px' },
  input: { padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', outline: 'none', backgroundColor: '#fff' },
  select: { padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', backgroundColor: '#fff', outline: 'none', cursor: 'pointer' },
  buttonAdd: { backgroundColor: '#1e3a8a', color: '#ffffff', border: 'none', padding: '9px 18px', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' },
  list: { listStyle: 'none', padding: 0, margin: 0 },
  listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '8px', marginBottom: '8px', gap: '10px' },
  itemText: { fontSize: '13px', color: '#334155', lineHeight: '1.4' },
  buttonDelete: { backgroundColor: 'transparent', color: '#94a3b8', border: 'none', fontSize: '13px', cursor: 'pointer', padding: '2px 6px' },
  smallStateBtn: { border: 'none', padding: '4px 10px', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' },
  kanbanGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '15px' },
  kanbanColumn: { backgroundColor: '#f8fafc', borderRadius: '8px', padding: '15px', border: '1px solid #e2e8f0' },
  kanbanColTitle: { margin: '0 0 15px 0', fontSize: '14px', fontWeight: 'bold', color: '#334155', paddingBottom: '5px' },
  kanbanItem: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px', marginBottom: '10px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
  kanbanTaskText: { margin: '0 0 8px 0', fontSize: '13px', fontWeight: '500', color: '#1e293b' },
  kanbanMeta: { margin: '2px 0', fontSize: '11px', color: '#64748b' },
  actionTaskBtn: { background: 'none', border: 'none', color: '#3b82f6', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', padding: 0 },
  footer: { backgroundColor: '#0f172a', color: '#94a3b8', padding: '30px 20px', marginTop: '50px', borderTop: '1px solid #1e293b' },
  footerContent: { maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', fontSize: '13px' },
  footerSchool: { margin: 0, fontWeight: 'bold', color: '#f1f5f9' },
  footerLocation: { margin: '4px 0 0 0', fontSize: '11px', color: '#475569' },
  footerLinks: { margin: 0, textAlign: 'right' },
  link: { color: '#38bdf8', textDecoration: 'none' }
};
