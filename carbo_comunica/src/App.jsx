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
        <form onSubmit
