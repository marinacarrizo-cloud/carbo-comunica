import React, { useState, useEffect } from 'react';

// Credenciales operativas locales
const CLAVES_ACCESO = {
  "carbo2026mar": "Marina Carrizo",
  "carbo2026juan": "Juan Pérez",
  "carbo2026dir": "Prof. Lic. Marcela Rosana Quevedo (Directora de la Unidad Académica)"
};

const NIVELES_CARBO = ["Institucional (todos los niveles)", "Nivel Inicial", "Nivel Primario", "Nivel Secundario", "Nivel Superior"];
const PERSONAL_AUTORIZADO = ["Marina Carrizo", "Juan Pérez", "Equipo General"];

// --- DATOS SEMILLA REALES ---
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
  { id: 1, texto: "Coordinar los resultados de Formación Situada", responsable: "Marina Carrizo", fechaSolicitud: "2026-02-15", fechaLimite: "2026-02-28", fechaRealizada: "28/02/2026", columna: "completado" },
  { id: 2, texto: "Diseñar señalética institucional para el ingreso de la escuela", responsable: "Juan Pérez", fechaSolicitud: "2026-06-18", fechaLimite: "2026-06-25", fechaRealizada: "", columna: "progreso" }
];

export default function App() {
  const [usuarioLogueado, setUsuarioLogueado] = useState(() => localStorage.getItem('carbo_usuario_sesion') || '');
  const [inputClave, setInputClave] = useState('');
  const [errorLogin, setErrorLogin] = useState(false);

  const [actividades, setActividades] = useState(() => { const local = localStorage.getItem('carbo_actividades_v12'); return local ? JSON.parse(local) : initialActividades; });
  const [agenda, setAgenda] = useState(() => { const local = localStorage.getItem('carbo_agenda_v12'); return local ? JSON.parse(local) : initialAgenda; });
  const [gacetillas, setGacetillas] = useState(() => { const local = localStorage.getItem('carbo_gacetillas_v12'); return local ? JSON.parse(local) : initialGacetillas; });
  const [coberturas, setCoberturas] = useState(() => { const local = localStorage.getItem('carbo_coberturas_v12'); return local ? JSON.parse(local) : initialCoberturas; });
  const [tareas, setTareas] = useState(() => { const local = localStorage.getItem('carbo_tareas_v12'); return local ? JSON.parse(local) : initialTareas; });

  const [textAct, setTextAct] = useState(''); const [dateAct, setDateAct] = useState(''); const [nivelAct, setNivelAct] = useState(NIVELES_CARBO[0]);
  const [textAge, setTextAge] = useState(''); const [dateAge, setDateAge] = useState(''); const [nivelAge, setNivelAge] = useState(NIVELES_CARBO[0]);
  const [textGac, setTextGac] = useState(''); const [dateGac, setDateGac] = useState(''); const [nivelGac, setNivelGac] = useState(NIVELES_CARBO[0]);

  const [cobEvento, setCobEvento] = useState('');
  const [cobPersona1, setCobPersona1] = useState(PERSONAL_AUTORIZADO[0]); const [cobFuncion1, setCobFuncion1] = useState('');
  const [cobPersona2, setCobPersona2] = useState(PERSONAL_AUTORIZADO[1]); const [cobFuncion2, setCobFuncion2] = useState('');
  const [cobNotas, setCobNotas] = useState('');

  const [nuevaTareaTexto, setNuevaTareaTexto] = useState('');
  const [tareaResp, setTareaResp] = useState(PERSONAL_AUTORIZADO[0]);
  const [tareaSolicitud, setTareaSolicitud] = useState('');
  const [tareaLimite, setTareaLimite] = useState('');
  const [columnaInicial, setColumnaInicial] = useState('pendiente');
  const [tareaFinalizacionManual, setTareaFinalizacionManual] = useState('');

  useEffect(() => { localStorage.setItem('carbo_actividades_v12', JSON.stringify(actividades)); }, [actividades]);
  useEffect(() => { localStorage.setItem('carbo_agenda_v12', JSON.stringify(agenda)); }, [agenda]);
  useEffect(() => { localStorage.setItem('carbo_gacetillas_v12', JSON.stringify(gacetillas)); }, [gacetillas]);
  useEffect(() => { localStorage.setItem('carbo_coberturas_v12', JSON.stringify(coberturas)); }, [coberturas]);
  useEffect(() => { localStorage.setItem('carbo_tareas_v12', JSON.stringify(tareas)); }, [tareas]);

  const handleLogin = (e) => {
    e.preventDefault();
    const nombreUsuario = CLAVES_ACCESO[inputClave.trim()];
    if (nombreUsuario) { setUsuarioLogueado(nombreUsuario); localStorage.setItem('carbo_usuario_sesion', nombreUsuario); setErrorLogin(false); } 
    else { setErrorLogin(true); }
  };

  const handleLogout = () => { setUsuarioLogueado(''); localStorage.removeItem('carbo_usuario_sesion'); };

  const handleAddCanal = (e, text, date, nivel, setText, setDate, setNivel, setList) => {
    e.preventDefault();
    if (!text.trim()) return;
    const fechaFormateada = date ? new Date(date).toLocaleDateString('es-AR') : new Date().toLocaleDateString('es-AR');
    setList(prev => [{ fecha: fechaFormateada, nivel: nivel, texto: text.trim() }, ...prev]);
    setText(''); setDate(''); setNivel(NIVELES_CARBO[0]);
  };

  const handleRemoveSimple = (index, setList) => setList(prev => prev.filter((_, i) => i !== index));

  const handleAddCobertura = (e) => {
    e.preventDefault();
    if (!cobEvento.trim()) return;
    const personalArray = [];
    if (cobPersona1) personalArray.push({ nombre: cobPersona1, funcion: cobFuncion1.trim() || 'Cobertura General' });
    if (cobPersona2) personalArray.push({ nombre: cobPersona2, funcion: cobFuncion2.trim() || 'Cobertura General' });
    setCoberturas(prev => [{ id: Date.now(), evento: cobEvento.trim(), personal: personalArray, notas: cobNotas.trim() }, ...prev]);
    setCobEvento(''); setCobFuncion1(''); setCobFuncion2(''); setCobNotas('');
  };

  const handleRemoveCobertura = (id) => setCoberturas(prev => prev.filter(c => c.id !== id));

  const handleAddTarea = (e) => {
    e.preventDefault();
    if (!nuevaTareaTexto.trim()) return;
    const fechaFinFormateada = columnaInicial === 'completado' && tareaFinalizacionManual ? new Date(tareaFinalizacionManual).toLocaleDateString('es-AR') : (columnaInicial === 'completado' ? new Date().toLocaleDateString('es-AR') : '');
    setTareas(prev => [{ id: Date.now(), texto: nuevaTareaTexto.trim(), responsable: tareaResp, fechaSolicitud: tareaSolicitud || new Date().toISOString().split('T')[0], fechaLimite: tareaLimite || 'Sin fecha', fechaRealizada: fechaFinFormateada, columna: columnaInicial }, ...prev]);
    setNuevaTareaTexto(''); setTareaSolicitud(''); setTareaLimite(''); setTareaFinalizacionManual(''); setColumnaInicial('pendiente');
  };

  const handleMoverTarea = (id, nuevaColumna) => {
    const hoy = new Date().toLocaleDateString('es-AR');
    setTareas(prev => prev.map(t => {
      if (t.id === id) {
        let fechaFin = t.fechaRealizada;
        if (nuevaColumna === 'completado' && !t.fechaRealizada) {
          const customFecha = prompt("Ingresá la fecha de finalización (DD/MM/AAAA) o dejá vacío para hoy:", hoy);
          fechaFin = customFecha ? (customFecha.trim() || hoy) : hoy;
        } else if (nuevaColumna !== 'completado') { fechaFin = ''; }
        return { ...t, columna: nuevaColumna, fechaRealizada: fechaFin };
      }
      return t;
    }));
  };

  const handleRemoveTarea = (id) => setTareas(prev => prev.filter(t => t.id !== id));

  const generarInformeSemanal = () => {
    const tareasListas = tareas.filter(t => t.columna === 'completado').map(t => `• Tarea: ${t.texto}\n  [Responsable: ${t.responsable} | Solicitada: ${t.fechaSolicitud} | Límite: ${t.fechaLimite} | Finalizada: ${t.fechaRealizada}]`).join('\n') || '• Sin tareas finalizadas.';
    const gacetillasListas = gacetillas.map(g => `• [${g.nivel}] ${g.texto} (${g.fecha})`).join('\n') || '• No se emitieron gacetillas.';
    const coberturasListas = coberturas.map(c => {
      const personalStr = c.personal.map(p => `${p.nombre} [${p.funcion || p.function}]`).join(', ');
      return `• Evento: ${c.evento}\n  [Roles: ${personalStr} ${c.notas ? `| Notas: ${c.notas}` : ''}]`;
    }).join('\n') || '• No se registraron coberturas.';

    const textoInforme = `======================================================================
📝 INFORME SEMANAL DE GESTIÓN INSTITUCIONAL
DEPARTAMENTO DE COMUNICACIÓN - ENS DR. ALEJANDRO CARBÓ
======================================================================

1. ACCIONES Y TAREAS INTERNAS FINALIZADAS DE LA SEMANA:
${tareasListas}

2. GACETILLAS Y COMUNICADOS EMITIDOS:
${gacetillasListas}

3. COBERTURAS DE EVENTOS REALIZADAS:
${coberturasListas}

----------------------------------------------------------------------
Generado automáticamente por el departamento de comunicación del Carbó.`;

    const ventanaInforme = window.open('', '_blank', 'width=700,height=650');
    ventanaInforme.document.write(`<html><head><title>Informe Semanal Carbó</title></head><body style="font-family:monospace; padding:25px; background:#f8fafc; color:#0f172a; line-height:1.5;"><h3 style="font-family:sans-serif; margin-top:0; color:#1e3a8a;">📋 Reporte Semanal Generado</h3><textarea style="width:100%; height:430px; padding:15px; font-family:monospace; font-size:12px; border:1px solid #cbd5e1; border-radius:8px; background:#fff;" readonly>${textoInforme}</textarea><br/><button onclick="window.close()" style="margin-top:15px; padding:10px 22px; font-family:sans-serif; background:#1e3a8a; color:#fff; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">Entendido, Cerrar</button></body></html>`);
  };

  if (!usuarioLogueado) {
    return (
      <div style={{ backgroundColor: '#1e3a8a', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
        <form onSubmit={handleLogin} style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <h2 style={{ color: '#1e3a8a', margin: '0 0 10px 0', fontSize: '24px', fontWeight: 'bold' }}>Carbó Comunica</h2>
          <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 25px 0' }}>Ingresá tu clave operativa</p>
          <input type="password" placeholder="Clave de Acceso..." value={inputClave} onChange={(e) => setInputClave(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', marginBottom: '15px', boxSizing: 'border-box' }} required />
          {errorLogin && <p style={{ color: '#ef4444', fontSize: '12px', margin: '0 0 15px 0', fontWeight: 'bold' }}>❌ Clave incorrecta.</p>}
          <button type="submit" style={{ width: '100%', backgroundColor: '#1e3a8a', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Ingresar al Panel</button>
        </form>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* HEADER: AHORA BUSCA DIRECTO DE TU REPOSITORIO GITHUB (SIN DEPENDER DE PUBLIC) */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <img src="https://raw.githubusercontent.com/marinacarrizo/carbo-comunica/main/escudo.png.png" alt="Escudo Carbó Oficial" style={styles.logoImg} />
            <div>
              <h1 style={styles.title}>Carbó Comunica</h1>
              <p style={styles.subtitle}>Panel Técnico de Control • Operador/a: <strong>{usuarioLogueado}</strong></p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button onClick={generarInformeSemanal} style={styles.buttonReportHeader}>📋 Generar Informe</button>
            <button onClick={handleLogout} style={styles.buttonLogout}>Salir ✕</button>
            <img src="https://raw.githubusercontent.com/marinacarrizo/carbo-comunica/main/comunicacion.png.jpg" alt="Logo Comunicación Oficial" style={styles.logoImg} />
          </div>
        </div>
      </header>

      <main style={styles.main}>
        {/* ENLACES OPERATIVOS: CON LOS ÍCONOS DE VUELTA Y RUTAS EXACTAS */}
        <div style={styles.banner}>
          <h2 style={styles.bannerTitle}>🔗 Enlaces Operativos Directos</h2>
          <p style={styles.bannerText}>Herramientas del departamento organizadas por área de trabajo:</p>
          
          <div style={styles.categoriesContainer}>
            <div style={styles.categoryBox}>
              <h4 style={styles.categoryTitle}>🏛️ Institucional y Contacto</h4>
              <div style={styles.linksGroup}>
                <a href="https://enscarbo-cba.infd.edu.ar/sitio/" target="_blank" rel="noreferrer" style={styles.btnSolidBlue}>🏛️ Web oficial</a>
                <a href="https://web.whatsapp.com/" target="_blank" rel="noreferrer" style={styles.btnSolidGreen}>💬 WhatsApp Web</a>
              </div>
            </div>

            <div style={styles.categoryBox}>
              <h4 style={styles.categoryTitle}>📂 Gestión y Diseño</h4>
              <div style={styles.linksGroup}>
                <a href="https://drive.google.com/drive/u/1/my-drive" target="_blank" rel="noreferrer" style={styles.btnOutline}>📂 Google Drive Gestión</a>
                <a href="https://www.canva.com/folder/all-designs" target="_blank" rel="noreferrer" style={styles.btnOutline}>🎨 Workspace Canva</a>
              </div>
            </div>

            <div style={styles.categoryBox}>
              <h4 style={styles.categoryTitle}>📱 Redes Sociales</h4>
              <div style={styles.linksGroup}>
                <a href="https://business.facebook.com/" target="_blank" rel="noreferrer" style={styles.btnOutlineMeta}>📊 Meta Business Suite</a>
                <a href="https://instagram.com/carbo.comunica" target="_blank" rel="noreferrer" style={styles.btnOutline}>📸 Instagram Institucional</a>
              </div>
            </div>
          </div>
        </div>

        {/* RESTO DEL SISTEMA INTACTO */}
        <h2 style={styles.sectionHeader}>📢 Canales de Difusión y Novedades</h2>
        <div style={styles.grid3}>
          <section style={styles.card}>
            <div style={styles.cardHeader}><h3 style={styles.cardTitle}>📋 Actividades Recientes</h3></div>
            <div style={styles.cardBody}>
              <form onSubmit={(e) => handleAddCanal(e, textAct, dateAct, nivelAct, setTextAct, setDateAct, setNivelAct, setActividades)} style={styles.formVertical}>
                <input type="text" placeholder="¿Qué actividad?" value={textAct} onChange={(e) => setTextAct(e.target.value)} style={styles.input} required/>
                <div style={{ display: 'flex', gap: '10px' }}><input type="date" value={dateAct} onChange={(e) => setDateAct(e.target.value)} style={{ ...styles.input, flex: 1 }}/><select value={nivelAct} onChange={(e) => setNivelAct(e.target.value)} style={{ ...styles.select, flex: 1 }}>{NIVELES_CARBO.map((n, i) => <option key={i} value={n}>{n}</option>)}</select></div>
                <button type="submit" style={styles.buttonAddFull}>+ Cargar Actividad</button>
              </form>
              <ul style={styles.list}>{actividades.map((item, index) => (<li key={index} style={styles.listItem}><div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}><span style={{ fontSize: '11px', fontWeight: 'bold', color: '#1e3a8a' }}>{item.fecha} — {item.nivel || 'Institucional'}</span><span style={styles.itemText}>{item.texto}</span></div><button onClick={() => handleRemoveSimple(index, setActividades)} style={styles.buttonDelete}>✕</button></li>))}</ul>
            </div>
          </section>

          <section style={styles.card}>
            <div style={styles.cardHeader}><h3 style={styles.cardTitle}>📅 Agenda Institucional</h3></div>
            <div style={styles.cardBody}>
              <form onSubmit={(e) => handleAddCanal(e, textAge, dateAge, nivelAge, setTextAge, setDateAge, setNivelAge, setAgenda)} style={styles.formVertical}>
                <input type="text" placeholder="¿Qué hito/evento en agenda?" value={textAge} onChange={(e) => setTextAge(e.target.value)} style={styles.input} required/>
                <div style={{ display: 'flex', gap: '10px' }}><input type="date" value={dateAge} onChange={(e) => setDateAge(e.target.value)} style={{ ...styles.input, flex: 1 }}/><select value={nivelAge} onChange={(e) => setNivelAge(e.target.value)} style={{ ...styles.select, flex: 1 }}>{NIVELES_CARBO.map((n, i) => <option key={i} value={n}>{n}</option>)}</select></div>
                <button type="submit" style={styles.buttonAddFull}>+ Cargar Agenda</button>
              </form>
              <ul style={styles.list}>{agenda.map((item, index) => (<li key={index} style={styles.listItem}><div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}><span style={{ fontSize: '11px', fontWeight: 'bold', color: '#f59e0b' }}>{item.fecha} — {item.nivel || 'Institucional'}</span><span style={styles.itemText}><strong>{item.texto}</strong></span></div><button onClick={() => handleRemoveSimple(index, setAgenda)} style={styles.buttonDelete}>✕</button></li>))}</ul>
            </div>
          </section>

          <section style={styles.card}>
            <div style={styles.cardHeader}><h3 style={styles.cardTitle}>📰 Gacetillas Emitidas</h3></div>
            <div style={styles.cardBody}>
              <form onSubmit={(e) => handleAddCanal(e, textGac, dateGac, nivelGac, setTextGac, setDateGac, setNivelGac, setGacetillas)} style={styles.formVertical}>
                <input type="text" placeholder="Título o asunto de la gacetilla..." value={textGac} onChange={(e) => setTextGac(e.target.value)} style={styles.input} required/>
                <div style={{ display: 'flex', gap: '10px' }}><input type="date" value={dateGac} onChange={(e) => setDateGac(e.target.value)} style={{ ...styles.input, flex: 1 }}/><select value={nivelGac} onChange={(e) => setNivelGac(e.target.value)} style={{ ...styles.select, flex: 1 }}>{NIVELES_CARBO.map((n, i) => <option key={i} value={n}>{n}</option>)}</select></div>
                <button type="submit" style={styles.buttonAddFull}>+ Cargar Gacetilla</button>
              </form>
              <ul style={styles.list}>{gacetillas.map((item, index) => (<li key={index} style={styles.listItem}><div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}><span style={{ fontSize: '11px', fontWeight: 'bold', color: '#7c3aed' }}>{item.fecha} — {item.nivel || 'Institucional'}</span><span style={styles.itemText}>{item.texto}</span></div><button onClick={() => handleRemoveSimple(index, setGacetillas)} style={styles.buttonDelete}>✕</button></li>))}</ul>
            </div>
          </section>
        </div>

        <h2 style={styles.sectionHeader}>📹 Planificación y Cobertura de Eventos</h2>
        <div style={styles.card}>
          <div style={styles.cardHeader}><h3 style={styles.cardTitle}>📍 Registro de Roles y Trabajos Específicos del Personal</h3></div>
          <div style={styles.cardBody}>
            <form onSubmit={handleAddCobertura} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px', backgroundColor: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}><input type="text" placeholder="Nombre del Evento (Ej: Acto del Día de la Bandera)" value={cobEvento} onChange={(e) => setCobEvento(e.target.value)} style={styles.input} required/><input type="text" placeholder="Notas e indicaciones generales" value={cobNotas} onChange={(e) => setCobNotas(e.target.value)} style={styles.input}/></div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', borderTop: '1px dashed #cbd5e1', paddingTop: '10px' }}><select value={cobPersona1} onChange={(e) => setCobPersona1(e.target.value)} style={styles.select}>{PERSONAL_AUTORIZADO.map((p, i) => <option key={i} value={p}>{p}</option>)}</select><input type="text" placeholder="Trabajo realizado por Personal 1 (Ej: Saco fotos)" value={cobFuncion1} onChange={(e) => setCobFuncion1(e.target.value)} style={styles.input}/></div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}><select value={cobPersona2} onChange={(e) => setCobPersona2(e.target.value)} style={styles.select}>{PERSONAL_AUTORIZADO.map((p, i) => <option key={i} value={p}>{p}</option>)}</select><input type="text" placeholder="Trabajo realizado por Personal 2 (Ej: Maestra de ceremonias)" value={cobFuncion2} onChange={(e) => setCobFuncion2(e.target.value)} style={styles.input}/></div>
              <button type="submit" style={{ ...styles.buttonAdd, alignSelf: 'flex-end', padding: '10px 25px' }}>Registrar Cobertura</button>
            </form>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
              {coberturas.map(c => (
                <div key={c.id} style={{ padding: '20px', borderRadius: '8px', borderLeft: '5px solid #1e3a8a', backgroundColor: '#f8fafc', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}><h4 style={{ margin: 0, fontSize: '15px', color: '#1e3a8a', fontWeight: 'bold' }}>🎬 {c.evento}</h4><button onClick={() => handleRemoveCobertura(c.id)} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: '14px' }}>✕</button></div>
                  <div style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '10px' }}><p style={{ margin: '0 0 5px 0', fontSize: '12px', fontWeight: 'bold', color: '#475569', textTransform: 'uppercase' }}>Trabajo Desarrollado:</p>{c.personal.map((p, i) => (<p key={i} style={{ margin: '4px 0', fontSize: '13px', color: '#334155' }}>👤 <strong>{p.nombre}:</strong> {p.funcion || p.function}</p>))}</div>
                  {c.notas && <p style={{ margin: '0', fontSize: '12px', color: '#64748b' }}>📝 <em>Notas: {c.notas}</em></p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <h2 style={styles.sectionHeader}>🛠️ Organizador de Tareas del Equipo</h2>
        <div style={styles.card}>
          <div style={styles.cardHeader}><h3 style={styles.cardTitle}>🎯 Seguimiento Operativo de Prioridades del Equipo</h3></div>
          <div style={styles.cardBody}>
            <form onSubmit={handleAddTarea} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '25px', border: '1px solid #e2e8f0', alignItems: 'center' }}>
              <input type="text" placeholder="Asunto o descripción de la tarea..." value={nuevaTareaTexto} onChange={(e) => setNuevaTareaTexto(e.target.value)} style={{ ...styles.input, flex: '2 1 200px' }} required/>
              <select value={tareaResp} onChange={(e) => setTareaResp(e.target.value)} style={styles.select}>{PERSONAL_AUTORIZADO.map((p, i) => <option key={i} value={p}>{p}</option>)}</select>
              <select value={columnaInicial} onChange={(e) => setColumnaInicial(e.target.value)} style={styles.select}><option value="pendiente">Cargar como: Pendiente</option><option value="progreso">Cargar como: En Proceso</option><option value="completado">Cargar como: Ya Finalizada</option></select>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ fontSize: '12px', color: '#475569', fontWeight: '500' }}>Solicitado:</span><input type="date" value={tareaSolicitud} onChange={(e) => setTareaSolicitud(e.target.value)} style={styles.input} required/></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ fontSize: '12px', color: '#475569', fontWeight: '500' }}>Límite:</span><input type="date" value={tareaLimite} onChange={(e) => setTareaLimite(e.target.value)} style={styles.input} required/></div>
              {columnaInicial === 'completado' && (<div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#f0fdf4', padding: '6px', borderRadius: '6px', border: '1px solid #bbf7d0' }}><span style={{ fontSize: '12px', color: '#166534', fontWeight: 'bold' }}>Finalizada:</span><input type="date" value={tareaFinalizacionManual} onChange={(e) => setTareaFinalizacionManual(e.target.value)} style={styles.input} required/></div>)}
              <button type="submit" style={styles.buttonAdd}>Registrar Tarea</button>
            </form>
            <div style={styles.kanbanGrid}>
              <div style={styles.kanbanColumn}>
                <h4 style={{ ...styles.kanbanColTitle, borderBottom: '3px solid #ef4444' }}>📌 Pendientes</h4>
                {tareas.filter(t => t.columna === 'pendiente').map(t => (<div key={t.id} style={styles.kanbanItem}><p style={styles.kanbanTaskText}>{t.texto}</p><p style={styles.kanbanMeta}>👤 <strong>{t.responsable}</strong></p><p style={styles.kanbanMeta}>📅 Solicitado: <span style={{ color: '#475569' }}>{t.fechaSolicitud}</span></p><p style={styles.kanbanMeta}>📅 Límite: <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{t.fechaLimite}</span></p><div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', alignItems: 'center' }}><button type="button" onClick={() => handleMoverTarea(t.id, 'progreso')} style={styles.actionTaskBtn}>Iniciar Tarea ➡️</button><button type="button" onClick={() => handleRemoveTarea(t.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', padding: 0 }}>Eliminar</button></div></div>))}
              </div>
              <div style={styles.kanbanColumn}>
                <h4 style={{ ...styles.kanbanColTitle, borderBottom: '3px solid #f59e0b' }}>⚡ En Proceso</h4>
                {tareas.filter(t => t.columna === 'progreso').map(t => (<div key={t.id} style={styles.kanbanItem}><p style={styles.kanbanTaskText}>{t.texto}</p><p style={styles.kanbanMeta}>👤 <strong>{t.responsable}</strong></p><p style={styles.kanbanMeta}>📅 Solicitado: <span style={{ color: '#475569' }}>{t.fechaSolicitud}</span></p><p style={styles.kanbanMeta}>📅 Límite: <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{t.fechaLimite}</span></p><div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}><button type="button" onClick={() => handleMoverTarea(t.id, 'pendiente')} style={styles.actionTaskBtn}>⬅️ Devolver</button><button type="button" onClick={() => handleMoverTarea(t.id, 'completado')} style={{ ...styles.actionTaskBtn, color: '#10b981' }}>Finalizar ✔️</button></div></div>))}
              </div>
              <div style={styles.kanbanColumn}>
                <h4 style={{ ...styles.kanbanColTitle, borderBottom: '3px solid #10b981' }}>🎉 Finalizadas</h4>
                {tareas.filter(t => t.columna === 'completado').map(t => (<div key={t.id} style={{ ...styles.kanbanItem, backgroundColor: '#f0fdf4' }}><p style={{ ...styles.kanbanTaskText, textDecoration: 'line-through', color: '#166534' }}>{t.texto}</p><p style={styles.kanbanMeta}>👤 <strong>{t.responsable}</strong></p><p style={styles.kanbanMeta}>📅 Solicitado: <span style={{ color: '#475569' }}>{t.fechaSolicitud}</span></p><p style={styles.kanbanMeta}>📅 Finalizada: <span style={{ color: '#10b981', fontWeight: 'bold' }}>{t.fechaRealizada}</span></p><div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}><button type="button" onClick={() => handleMoverTarea(t.id, 'progreso')} style={styles.actionTaskBtn}>🔄 Reabrir</button><button type="button" onClick={() => handleRemoveTarea(t.id)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '11px' }}>Archivar</button></div></div>))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div><p style={styles.footerSchool}>Escuela Normal Superior Dr. Alejandro Carbó</p><p style={styles.footerLocation}>Córdoba, Argentina • Panel de Control Técnico Autorizado</p></div>
          <div style={styles.footerLinks}><p><strong>IG:</strong> <a href="https://instagram.com/carbo.comunica" target="_blank" rel="noreferrer" style={styles.link}>@carbo.comunica</a></p><p><strong>FB:</strong> Escuela Normal Superior Dr. Alejandro Carbó</p></div>
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
  logoImg: { height: '65px', width: 'auto', objectFit: 'contain' },
  main: { flexGrow: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '30px 20px' },
  banner: { backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  bannerTitle: { margin: 0, fontSize: '18px', color: '#0f172a', fontWeight: 'bold' },
  bannerText: { margin: '4px 0 15px 0', fontSize: '13px', color: '#64748b' },
  
  categoriesContainer: { display: 'flex', flexWrap: 'wrap', gap: '20px' },
  categoryBox: { backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '15px', flex: '1 1 250px' },
  categoryTitle: { margin: '0 0 12px 0', fontSize: '13px', color: '#334155', fontWeight: 'bold', borderBottom: '2px solid #cbd5e1', paddingBottom: '6px' },
  linksGroup: { display: 'flex', flexWrap: 'wrap', gap: '10px' },
  
  btnSolidBlue: { textDecoration: 'none', backgroundColor: '#1e3a8a', color: '#ffffff', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', boxShadow: '0 2px 4px rgba(30,58,138,0.2)' },
  btnSolidGreen: { textDecoration: 'none', backgroundColor: '#16a34a', color: '#ffffff', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', boxShadow: '0 2px 4px rgba(22,163,74,0.2)' },
  btnOutline: { textDecoration: 'none', backgroundColor: '#ffffff', color: '#1e3a8a', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', border: '1px solid #cbd5e1' },
  btnOutlineMeta: { textDecoration: 'none', backgroundColor: '#f0f9ff', color: '#0369a1', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', border: '1px solid #bae6fd' },

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
