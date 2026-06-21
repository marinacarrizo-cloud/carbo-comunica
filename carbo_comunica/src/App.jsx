import React, { useState, useEffect } from 'react';

// Credenciales operativas locales
const CLAVES_ACCESO = {
  "carbo2026mar": "Marina Carrizo",
  "carbo2026juan": "Juan Pérez",
  "carbo2026dir": "Prof. Lic. Marcela Rosana Quevedo (Directora de la Unidad Académica)"
};

// Opciones de niveles educativos de la escuela
const NIVELES_CARBO = [
  "Institucional (todos los niveles)",
  "Nivel Inicial",
  "Nivel Primario",
  "Nivel Secundario",
  "Nivel Superior"
];

// Opciones cerradas de Personal autorizado
const PERSONAL_AUTORIZADO = [
  "Marina Carrizo",
  "Juan Pérez",
  "Equipo General"
];

// --- DATOS SEMILLA REALES DE LA ESCUELA ---
const initialActividades = [
  { fecha: "21/06/2026", nivel: "Nivel Superior", texto: "Feria de Ciencias - Coordinación del Nivel." },
  { fecha: "19/06/2026", nivel: "Institucional (todos los niveles)", texto: "Organización Día de la Bandera." }
];

const initialAgenda = [
  { fecha: "26/06/2026", nivel: "Nivel Superior", texto: "Feria de Ciencias - 26/06." },
  { fecha: "20/06/2026", nivel: "Institucional (todos los niveles)", texto: "Acto Día de la Bandera." },
  { fecha: "23/06/2026", nivel: "Institucional (todos los niveles)", texto: "Reunión con directivos." }
];

const initialGacetillas = [
  { fecha: "21/06/2026", nivel: "Nivel Superior", texto: "Invitación Feria de Ciencias." },
  { fecha: "19/06/2026", nivel: "Institucional (todos los niveles)", texto: "Día de la Bandera." }
];

const initialCoberturas = [
  { id: 1, evento: "Acto Día de la Bandera", personal: [ { nombre: "Juan Pérez", funcion: "Registró fotos y videos" }, { nombre: "Marina Carrizo", funcion: "Maestra de ceremonias / Locutora" } ], notas: "Cobertura en vivo realizada." }
];

const initialTareas = [
  { id: 1, texto: "Coordinar los resultados de Formación Situada", responsable: "Marina Carrizo", fechaLimite: "2026-06-24", fechaRealizada: "", columna: "pendiente" },
  { id: 2, texto: "Diseñar señalética institucional para el ingreso de la escuela", responsable: "Juan Pérez", fechaLimite: "2026-06-25", fechaRealizada: "", columna: "progreso" }
];

export default function App() {
  // --- CONTROL DE LOGIN LOCAL ---
  const [usuarioLogueado, setUsuarioLogueado] = useState(() => {
    return localStorage.getItem('carbo_usuario_sesion') || '';
  });
  const [inputClave, setInputClave] = useState('');
  const [errorLogin, setErrorLogin] = useState(false);

  // --- ESTADOS CON PERSISTENCIA LOCAL ---
  const [actividades, setActividades] = useState(() => {
    const local = localStorage.getItem('carbo_actividades_v5');
    return local ? JSON.parse(local) : initialActividades;
  });
  const [agenda, setAgenda] = useState(() => {
    const local = localStorage.getItem('carbo_agenda_v5');
    return local ? JSON.parse(local) : initialAgenda;
  });
  const [gacetillas, setGacetillas] = useState(() => {
    const local = localStorage.getItem('carbo_gacetillas_v5');
    return local ? JSON.parse(local) : initialGacetillas;
  });
  const [coberturas, setCoberturas] = useState(() => {
    const local = localStorage.getItem('carbo_coberturas_v5');
    return local ? JSON.parse(local) : initialCoberturas;
  });
  const [tareas, setTareas] = useState(() => {
    const local = localStorage.getItem('carbo_tareas_v5');
    return local ? JSON.parse(local) : initialTareas;
  });

  // Control de inputs canales
  const [textAct, setTextAct] = useState(''); const [dateAct, setDateAct] = useState(''); const [nivelAct, setNivelAct] = useState(NIVELES_CARBO[0]);
  const [textAge, setTextAge] = useState(''); const [dateAge, setDateAge] = useState(''); const [nivelAge, setNivelAge] = useState(NIVELES_CARBO[0]);
  const [textGac, setTextGac] = useState(''); const [dateGac, setDateGac] = useState(''); const [nivelGac, setNivelGac] = useState(NIVELES_CARBO[0]);

  // Control inputs Cobertura
  const [cobEvento, setCobEvento] = useState('');
  const [cobPersona1, setCobPersona1] = useState(PERSONAL_AUTORIZADO[0]); const [cobFuncion1, setCobFuncion1] = useState('');
  const [cobPersona2, setCobPersona2] = useState(PERSONAL_AUTORIZADO[1]); const [cobFuncion2, setCobFuncion2] = useState('');
  const [cobNotas, setCobNotas] = useState('');

  // Control inputs Tareas
  const [nuevaTareaTexto, setNuevaTareaTexto] = useState('');
  const [tareaResp, setTareaResp] = useState(PERSONAL_AUTORIZADO[0]);
  const [tareaLimite, setTareaLimite] = useState('');

  // --- EFECTOS DE SINCRONIZACIÓN ---
  useEffect(() => { localStorage.setItem('carbo_actividades_v5', JSON.stringify(actividades)); }, [actividades]);
  useEffect(() => { localStorage.setItem('carbo_agenda_v5', JSON.stringify(agenda)); }, [agenda]);
  useEffect(() => { localStorage.setItem('carbo_gacetillas_v5', JSON.stringify(gacetillas)); }, [gacetillas]);
  useEffect(() => { localStorage.setItem('carbo_coberturas_v5', JSON.stringify(coberturas)); }, [coberturas]);
  useEffect(() => { localStorage.setItem('carbo_tareas_v5', JSON.stringify(tareas)); }, [tareas]);

  // --- LOGICA DE LOGIN ---
  const handleLogin = (e) => {
    e.preventDefault();
    const nombreUsuario = CLAVES_ACCESO[inputClave.trim()];
    if (nombreUsuario) {
      setUsuarioLogueado(nombreUsuario);
      localStorage.setItem('carbo_usuario_sesion', nombreUsuario);
      setErrorLogin(false);
    } else {
      setErrorLogin(true);
    }
  };

  const handleLogout = () => {
    setUsuarioLogueado('');
    localStorage.removeItem('carbo_usuario_sesion');
  };

  // --- MANEJADORES DE ENTRADA ---
  const handleAddCanal = (e, text, date, nivel, setText, setDate, setNivel, setList) => {
    e.preventDefault();
    if (!text.trim()) return;
    const fechaFormateada = date ? new Date(date).toLocaleDateString('es-AR') : new Date().toLocaleDateString('es-AR');
    const nuevoElemento = { fecha: fechaFormateada, nivel: nivel, texto: text.trim() };
    setList(prev => [nuevoElemento, ...prev]);
    setText(''); setDate(''); setNivel(NIVELES_CARBO[0]);
  };

  const handleRemoveSimple = (index, setList) => {
    setList(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddCobertura = (e) => {
    e.preventDefault();
    if (!cobEvento.trim()) return;
    const personalArray = [];
    if (cobPersona1) personalArray.push({ nombre: cobPersona1, funcion: cobFuncion1.trim() || 'Cobertura General' });
    if (cobPersona2) personalArray.push({ nombre: cobPersona2, funcion: cobFuncion2.trim() || 'Cobertura General' });

    const nueva = { id: Date.now(), evento: cobEvento.trim(), personal: personalArray, notas: cobNotas.trim() };
    setCoberturas(prev => [nueva, ...prev]);
    setCobEvento(''); setCobFuncion1(''); setCobFuncion2(''); setCobNotas('');
  };

  const handleAddTarea = (e) => {
    e.preventDefault();
    if (!nuevaTareaTexto.trim()) return;
    const nueva = { id: Date.now(), texto: nuevaTareaTexto.trim(), responsable: tareaResp, fechaLimite: tareaLimite || 'Sin fecha', fechaRealizada: '', columna: 'pendiente' };
    setTareas(prev => [nueva, ...prev]);
    setNuevaTareaTexto(''); setTareaLimite('');
  };

  const handleMoverTarea = (id, nuevaColumna) => {
    const hoy = new Date().toLocaleDateString('es-AR');
    setTareas(prev => prev.map(t => t.id === id ? { ...t, columna: nuevaColumna, fechaRealizada: nuevaColumna === 'completado' ? hoy : '' } : t));
  };

  const handleRemoveTarea = (id) => {
    setTareas(prev => prev.filter(t => t.id !== id));
  };

  // --- GENERACIÓN DE INFORME SEMANAL ---
  const generarInformeSemanal = () => {
    const tareasListas = tareas.filter(t => t.columna === 'completado').map(t => `• Tarea: ${t.texto}\n  [Ejecutó: ${t.responsable} | Finalizada el: ${t.fechaRealizada}]`).join('\n') || '• Sin tareas finalizadas.';
    const gacetillasListas = gacetillas.map(g => `• [${g.nivel}] ${g.texto} (${g.fecha})`).join('\n') || '• No se emitieron gacetillas.';
    const coberturasListas = coberturas.map(c => {
      const personalStr = c.personal.map(p => `${p.nombre} [${p.funcion}]`).join(', ');
      return `• Evento: ${c.evento}\n  [Roles: ${personalStr} ${c.notas ? `| Notas: ${c.notas}` : ''}]`;
    }).join('\n') || '• No se registraron coberturas.';

    const textoInforme = `===========================================================
📝 INFORME SEMANAL DE GESTIÓN INSTITUCIONAL
DEPARTAMENTO DE COMUNICACIÓN - ENS DR. ALEJANDRO CARBÓ
===========================================================

1. ACCIONES Y TAREAS INTERNAS FINALIZADAS:
${tareasListas}

2. GACETILLAS Y COMUNICADOS EMITIDOS:
${gacetillasListas}

3. COBERTURAS DE EVENTOS REALIZADAS:
${coberturasListas}

-----------------------------------------------------------
Generado automáticamente por el departamento de comunicación del Carbó.`;

    const ventanaInforme = window.open('', '_blank', 'width=650,height=650');
    ventanaInforme.document.write(`
      <html>
        <head><title>Informe Semanal Carbó</title></head>
        <body style="font-family:monospace; padding:25px; background:#f8fafc; color:#0f172a; line-height:1.5;">
          <h3 style="font-family:sans-serif; margin-top:0; color:#1e3a8a;">📋 Reporte Semanal Generado</h3>
          <p style="font-family:sans-serif; font-size:13px; color:#475569;">Copiá el contenido del cuadro de abajo y pegalo directamente en tu WhatsApp o nota de elevación.</p>
          <textarea style="width:100%; height:430px; padding:15px; font-family:monospace; font-size:12px; border:1px solid #cbd5e1; border-radius:8px; background:#fff;" readonly>${textoInforme}</textarea>
          <br/><button onclick="window.close()" style="margin-top:15px; padding:10px 22px; font-family:sans-serif; background:#1e3a8a; color:#fff; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">Entendido, Cerrar</button>
        </body>
      </html>
    `);
  };

  if (!usuarioLogueado) {
    return (
      <div style={{ backgroundColor: '#1e3a8a', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
        <form onSubmit={handleLogin} style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <h2 style={{ color: '#1e3a8a', margin: '0 0 10px 0', fontSize: '24px', fontWeight: 'bold' }}>Carbó Comunica</h2>
          <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 25px 0' }}>Ingresá tu clave operativa del Departamento de Comunicación</p>
          <input 
            type="password" 
            placeholder="Clave de Acceso..." 
            value={inputClave} 
            onChange={(e) => setInputClave(e.target.value)} 
            style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', marginBottom: '15px', boxSizing: 'border-box', outline: 'none' }}
            required
          />
          {errorLogin && <p style={{ color: '#ef4444', fontSize: '12px', margin: '0 0 15px 0', fontWeight: 'bold' }}>❌ Clave incorrecta. Intentá de nuevo.</p>}
          <button type="submit" style={{ width: '100%', backgroundColor: '#1e3a8a', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
            Ingresar al Panel
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      
      {/* HEADER CON LOGOS VECTORIALES COMPLEJOS (DIBUJADOS POR CÓDIGO INFAILIBLE) */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* ESCUDO OFICIAL CARBÓ SVG DETALLADO */}
            <svg style={styles.logoSvg} viewBox="0 0 100 120">
              <path d="M10 10 H90 V85 L50 115 L10 85 Z" fill="#4673a3" stroke="#0f172a" strokeWidth="3"/>
              <rect x="44" y="30" width="12" height="55" fill="#fff" stroke="#0f172a" strokeWidth="2"/>
              <path d="M44 30 L50 12 L56 30 Z" fill="#1e293b"/>
              <text x="50" y="24" fill="#ffffff" fontSize="6.5" fontWeight="bold" textAnchor="middle" letterSpacing="0.2">EDUCAR EN LA VERDAD</text>
              <text x="50" y="65" fill="#b91c1c" fontSize="19" fontWeight="bold" textAnchor="middle" fontFamily="Georgia, serif">Ensac</text>
            </svg>
            <div>
              <h1 style={styles.title}>Carbó Comunica</h1>
              <p style={styles.subtitle}>Panel Técnico de Control • Operador/a actual: <strong>{usuarioLogueado}</strong></p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
            <button onClick={generarInformeSemanal} style={styles.buttonReportHeader}>
              📋 Generar Informe Semanal
            </button>
            <button onClick={handleLogout} style={styles.buttonLogout}>Salir ✕</button>
            {/* LOGO DEPARTAMENTO DE COMUNICACIÓN SVG DETALLADO */}
            <svg style={styles.logoSvg} viewBox="0 0 100 100">
              <path d="M25 50 A 25 25 0 1 1 75 65 L 85 75 L 75 55" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round"/>
              <rect x="45" y="40" width="10" height="35" fill="#fff" stroke="#1e3a8a" strokeWidth="2"/>
              <path d="M45 40 L50 25 L55 40 Z" fill="#f59e0b"/>
              <path d="M60 42 Q68 50 60 58 M65 36 Q77 50 65 64" fill="none" stroke="#93c5fd" strokeWidth="3.5" strokeLinecap="round"/>
              <text x="50" y="94" fill="#ffffff" fontSize="7.5" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">COMUNICACIÓN</text>
            </svg>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main style={styles.main}>
        
        {/* REPOSITORIO DE ENLACES DE TRABAJO RÁPIDO */}
        <div style={styles.banner}>
          <h2 style={styles.bannerTitle}>🔗 Enlaces Operativos Directos (Cuentas Oficiales)</h2>
          <p style={styles.bannerText}>Accesos directos configurados para no interferir con tus sesiones personales de la computadora:</p>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '15px' }}>
            <a href="https://drive.google.com/drive/u/1/my-drive" target="_blank" rel="noreferrer" style={styles.shortcutBtn}>📂 Drive comunicación.carbo@gmail.com</a>
            <a href="https://www.canva.com/folder/all-designs" target="_blank" rel="noreferrer" style={styles.shortcutBtn}>🎨 Workspace Canva Carbó</a>
            <a href="https://business.facebook.com/" target="_blank" rel="noreferrer" style={styles.shortcutBtnMeta}>📊 Meta Business Suite</a>
            <a href="https://instagram.com/carbo.comunica" target="_blank" rel="noreferrer" style={styles.shortcutBtn}>📸 Instagram Oficial</a>
          </div>
        </div>

        {/* MÓDULO 1: TABLONES CON FILTRO DE FECHA Y NIVEL */}
        <h2 style={styles.sectionHeader}>📢 Canales de Difusión y Novedades</h2>
        <div style={styles.grid3}>
          
          {/* ACTIVIDADES */}
          <section style={styles.card}>
            <div style={styles.cardHeader}><h3 style={styles.cardTitle}>📋 Actividades Recientes</h3></div>
            <div style={styles.cardBody}>
              <form onSubmit={(e) => handleAddCanal(e, textAct, dateAct, nivelAct, setTextAct, setDateAct, setNivelAct, setActividades)} style={styles.formVertical}>
                <input type="text" placeholder="¿Qué actividad?" value={textAct} onChange={(e) => setTextAct(e.target.value)} style={styles.input} required/>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="date" value={dateAct} onChange={(e) => setDateAct(e.target.value)} style={{ ...styles.input, flex: 1 }}/>
                  <select value={nivelAct} onChange={(e) => setNivelAct(e.target.value)} style={{ ...styles.select, flex: 1 }}>
                    {NIVELES_CARBO.map((n, i) => <option key={i} value={n}>{n}</option>)}
                  </select>
                </div>
                <button type="submit" style={styles.buttonAddFull}>+ Cargar Actividad</button>
              </form>
              <ul style={styles.list}>
                {actividades.map((item, index) => (
                  <li key={index} style={styles.listItem}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#1e3a8a' }}>{item.fecha} — {item.nivel || 'Institucional'}</span>
                      <span style={styles.itemText}>{item.texto}</span>
                    </div>
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
              <form onSubmit={(e) => handleAddCanal(e, textAge, dateAge, nivelAge, setTextAge, setDateAge, setNivelAge, setAgenda)} style={styles.formVertical}>
                <input type="text" placeholder="¿Qué hito/evento en agenda?" value={textAge} onChange={(e) => setTextAge(e.target.value)} style={styles.input} required/>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="date" value={dateAge} onChange={(e) => setDateAge(e.target.value)} style={{ ...styles.input, flex: 1 }}/>
                  <select value={nivelAge} onChange={(e) => setNivelAge(e.target.value)} style={{ ...styles.select, flex: 1 }}>
                    {NIVELES_CARBO.map((n, i) => <option key={i} value={n}>{n}</option>)}
                  </select>
                </div>
                <button type="submit" style={styles.buttonAddFull}>+ Cargar Agenda</button>
              </form>
              <ul style={styles.list}>
                {agenda.map((item, index) => (
                  <li key={index} style={styles.listItem}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#f59e0b' }}>{item.fecha} — {item.nivel || 'Institucional'}</span>
                      <span style={styles.itemText}><strong>{item.texto}</strong></span>
                    </div>
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
              <form onSubmit={(e) => handleAddCanal(e, textGac, dateGac, nivelGac, setTextGac, setDateGac, setNivelGac, setGacetillas)} style={styles.formVertical}>
                <input type="text" placeholder="Título o asunto de la gacetilla..." value={textGac} onChange={(e) => setTextGac(e.target.value)} style={styles.input} required/>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="date" value={dateGac} onChange={(e) => setDateGac(e.target.value)} style={{ ...styles.input, flex: 1 }}/>
                  <select value={nivelGac} onChange={(e) => setNivelGac(e.target.value)} style={{ ...styles.select, flex: 1 }}>
                    {NIVELES_CARBO.map((n, i) => <option key={i} value={n}>{n}</option>)}
                  </select>
                </div>
                <button type="submit" style={styles.buttonAddFull}>+ Cargar Gacetilla</button>
              </form>
              <ul style={styles.list}>
                {gacetillas.map((item, index) => (
                  <li key={index} style={styles.listItem}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#7c3aed' }}>{item.fecha} — {item.nivel || 'Institucional'}</span>
                      <span style={styles.itemText}>{item.texto}</span>
                    </div>
                    <button onClick={() => handleRemoveSimple(index, setGacetillas)} style={styles.buttonDelete}>✕</button>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* MÓDULO 2: COBERTURAS CON MENÚS CERRADOS */}
        <h2 style={styles.sectionHeader}>📹 Planificación y Cobertura de Eventos</h2>
        <div style={styles.card}>
          <div style={styles.cardHeader}><h3 style={styles.cardTitle}>📍 Registro de Roles y Trabajos Específicos del Personal</h3></div>
          <div style={styles.cardBody}>
            <form onSubmit={handleAddCobertura} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px', backgroundColor: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                <input type="text" placeholder="Nombre del Evento (Ej: Acto del Día de la Bandera)" value={cobEvento} onChange={(e) => setCobEvento(e.target.value)} style={styles.input} required/>
                <input type="text" placeholder="Notas e indicaciones generales" value={cobNotas} onChange={(e) => setCobNotas(e.target.value)} style={styles.input}/>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', borderTop: '1px dashed #cbd5e1', paddingTop: '10px' }}>
                <select value={cobPersona1} onChange={(e) => setCobPersona1(e.target.value)} style={styles.select}>
                  {PERSONAL_AUTORIZADO.map((p, i) => <option key={i} value={p}>{p}</option>)}
                </select>
                <input type="text" placeholder="Trabajo realizado por Personal 1 (Ej: Saco fotos)" value={cobFuncion1} onChange={(e) => setCobFuncion1(e.target.value)} style={styles.input}/>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                <select value={cobPersona2} onChange={(e) => setCobPersona2(e.target.value)} style={styles.select}>
                  {PERSONAL_AUTORIZADO.map((p, i) => <option key={i} value={p}>{p}</option>)}
                </select>
                <input type="text" placeholder="Trabajo realizado por Personal 2 (Ej: Maestra de ceremonias)" value={cobFuncion2} onChange={(e) => setCobFuncion2(e.target.value)} style={styles.input}/>
              </div>
              
              <button type="submit" style={{ ...styles.buttonAdd, alignSelf: 'flex-end', padding: '10px 25px' }}>Registrar Cobertura</button>
            </form>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
              {coberturas.map(c => (
                <div key={c.id} style={{ padding: '20px', borderRadius: '8px', borderLeft: '5px solid #1e3a8a', backgroundColor: '#f8fafc', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                    <h4 style={{ margin: 0, fontSize: '15px', color: '#1e3a8a', fontWeight: 'bold' }}>🎬 {c.evento}</h4>
                    <button onClick={() => handleRemoveCobertura(c.id)} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: '14px' }}>✕</button>
                  </div>
                  <div style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '10px' }}>
                    <p style={{ margin: '0 0 5px 0', fontSize: '12px', fontWeight: 'bold', color: '#475569', textTransform: 'uppercase' }}>Trabajo Desarrollado:</p>
                    {c.personal.map((p, i) => (
                      <p key={i} style={{ margin: '4px 0', fontSize: '13px', color: '#334155' }}>
                        👤 <strong>{p.nombre}:</strong> {p.funcion}
                      </p>
                    ))}
                  </div>
                  {c.notas && <p style={{ margin: '0', fontSize: '12px', color: '#64748b' }}>📝 <em>Notas: {c.notas}</em></p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MÓDULO 3: PANEL KANBAN ARREGLADO CON EL BOTÓN REGISTRAR TAREA */}
        <h2 style={styles.sectionHeader}>🛠️ Organizador de Tareas del Equipo</h2>
        <div style={styles.card}>
          <div style={styles.cardHeader}><h3 style={styles.cardTitle}>🎯 Seguimiento Operativo de Prioridades del Equipo</h3></div>
          <div style={styles.cardBody}>
            
            <form onSubmit={handleAddTarea} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '25px', border: '1px solid #e2e8f0' }}>
              <input type="text" placeholder="Asunto o descripción de la tarea..." value={nuevaTareaTexto} onChange={(e) => setNuevaTareaTexto(e.target.value)} style={{ ...styles.input, flex: '2 1 300px' }} required/>
              
              <select value={tareaResp} onChange={(e) => setTareaResp(e.target.value)} style={styles.select}>
                {PERSONAL_AUTORIZADO.map((p, i) => <option key={i} value={p}>{p}</option>)}
              </select>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: '#475569' }}>Límite:</span>
                <input type="date" value={tareaLimite} onChange={(e) => setTareaLimite(e.target.value)} style={styles.input}/>
              </div>
              
              <button type="submit" style={styles.buttonAdd}>Registrar Tarea</button>
            </form>

            <div style={styles.kanbanGrid}>
              
              {/* COLUMNA PENDIENTE (BOTÓN ELIMINAR CORREGIDO) */}
              <div style={styles.kanbanColumn}>
                <h4 style={{ ...styles.kanbanColTitle, borderBottom: '3px solid #ef4444' }}>📌 Pendientes</h4>
                {tareas.filter(t => t.columna === 'pendiente').map(t => (
                  <div key={t.id} style={styles.kanbanItem}>
                    <p style={styles.kanbanTaskText}>{t.texto}</p>
                    <p style={styles.kanbanMeta}>👤 Responsable: <strong>{t.responsable}</strong></p>
                    <p style={styles.kanbanMeta}>📅 Límite: <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{t.fechaLimite}</span></p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                      <button type="button" onClick={() => handleMoverTarea(t.id, 'progreso')} style={styles.actionTaskBtn}>Iniciar Tarea ➡️</button>
                      <button type="button" onClick={() => handleRemoveTarea(t.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Eliminar</button>
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
                    <p style={styles.kanbanMeta}>👤 Responsable: <strong>{t.responsable}</strong></p>
                    <p style={styles.kanbanMeta}>📅 Límite: <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{t.fechaLimite}</span></p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                      <button type="button" onClick={() => handleMoverTarea(t.id, 'pendiente')} style={styles.actionTaskBtn}>⬅️ Devolver</button>
                      <button type="button" onClick={() => handleMoverTarea(t.id, 'completado')} style={{ ...styles.actionTaskBtn, color: '#10b981' }}>Finalizar ✔️</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* COLUMNA FINALIZADAS */}
              <div style={styles.kanbanColumn}>
                <h4 style={{ ...styles.kanbanColTitle, borderBottom: '3px solid #10b981' }}>🎉 Finalizadas</h4>
                {tareas.filter(t => t.columna === 'completado').map(t => (
                  <div key={t.id} style={{ ...styles.kanbanItem, backgroundColor: '#f0fdf4' }}>
                    <p style={{ ...styles.kanbanTaskText, textDecoration: 'line-through', color: '#166534' }}>{t.texto}</p>
                    <p style={styles.kanbanMeta}>👤 Hizo: <strong>{t.responsable}</strong></p>
                    <p style={styles.kanbanMeta}>📅 Finalizada el: <span style={{ color: '#10b981', fontWeight: 'bold' }}>{t.fechaRealizada}</span></p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                      <button type="button" onClick={() => handleMoverTarea(t.id, 'progreso')} style={styles.actionTaskBtn}>🔄 Reabrir</button>
                      <button type="button" onClick={() => handleRemoveTarea(t.id)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '11px' }}>Archivar</button>
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
            <p style={styles.footerLocation}>Córdoba, Argentina • Panel de Control Técnico Autorizado</p>
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

// --- ESTILOS VISUALES EN LÍNEA ---
const styles = {
  container: { fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', backgroundColor: '#f1f5f9', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#334155', margin: 0 },
  header: { backgroundColor: '#1e3a8a', color: '#ffffff', padding: '15px 40px', borderBottom: '4px solid #f59e0b', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' },
  headerContent: { maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' },
  title: { margin: 0, fontSize: '24px', fontWeight: 'bold', letterSpacing: '-0.5px' },
  subtitle: { margin: '3px 0 0 0', fontSize: '12px', color: '#93c5fd' },
  logoSvg: { height: '60px', width: '60px' },
  badge: { display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#1e1b4b', padding: '6px 14px', borderRadius: '20px', border: '1px solid #3730a3' },
  badgeDot: { width: '8px', height: '8px', backgroundColor: '#34d399', borderRadius: '50%' },
  badgeText: { fontSize: '10px', color: '#34d399', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' },
  main: { flexGrow: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '30px 20px' },
  banner: { backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  bannerTitle: { margin: 0, fontSize: '18px', color: '#0f172a', fontWeight: 'bold' },
  bannerText: { margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' },
  shortcutBtn: { textDecoration: 'none', backgroundColor: '#f1f5f9', color: '#1e3a8a', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', border: '1px solid #cbd5e1' },
  shortcutBtnMeta: { textDecoration: 'none', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', border: '1px solid #bae6fd' },
  buttonReportHeader: { backgroundColor: '#10b981', color: '#ffffff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(16,185,129,0.2)' },
  buttonLogout: { backgroundColor: 'transparent', color: '#93c5fd', border: '1px solid #3b82f6', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' },
  sectionHeader: { fontSize: '18px', fontWeight: 'bold', color: '#1e3a8a', marginTop: '40px', marginBottom: '15px', borderLeft: '4px solid #f59e0b', paddingLeft: '10px' },
  grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' },
  card: { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '20px' },
  cardHeader: { backgroundColor: '#f8fafc', padding: '14px 20px', borderBottom: '1px solid #e2e8f0' },
  cardTitle: { margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#1e293b' },
  cardBody: { padding: '20px', flexGrow: 1 },
  formVertical: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' },
  input: { padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', outline: 'none', backgroundColor: '#fff' },
  select: { padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', backgroundColor: '#fff', outline: 'none', cursor: 'pointer' },
  buttonAddFull: { backgroundColor: '#1e3a8a', color: '#ffffff', border: 'none', padding: '9px', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' },
  buttonAdd: { backgroundColor: '#1e3a8a', color: '#ffffff', border: 'none', padding: '9px 18px', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' },
  list: { listStyle: 'none', padding: 0, margin: 0 },
  listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '8px', marginBottom: '8px', gap: '10px' },
  itemText: { fontSize: '13px', color: '#334155', lineHeight: '1.4' },
  buttonDelete: { backgroundColor: 'transparent', color: '#94a3b8', border: 'none', fontSize: '13px', cursor: 'pointer', padding: '2px 6px' },
  kanbanGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '15px' },
  kanbanColumn: { backgroundColor: '#f8fafc', borderRadius: '8px', padding: '15px', border: '1px solid #e2e8f0' },
  kanbanColTitle: { margin: '0 0 15px 0', fontSize: '14px', fontWeight: 'bold', color: '#334155', paddingBottom: '5px' },
  kanbanItem: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px', marginBottom: '10px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
  kanbanTaskText: { margin: '0 0 8px 0', fontSize: '13px', fontWeight: '500', color: '#1e293b' },
  kanbanMeta: { margin: '2px 0', fontSize: '11px', color: '#64748b' },
  actionTaskBtn: { background: 'none', border: 'none', color: '#3b82f6', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', padding: 0 },
  footer: { backgroundColor: '#0f172a', color: '#94a3b8', padding: '30px 20px', marginTop: '50px', borderTop: '1px solid #1e293b' },
  footerContent: { maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', fontSize: '13px' },
  link: { color: '#38bdf8', textDecoration: 'none' }
};
