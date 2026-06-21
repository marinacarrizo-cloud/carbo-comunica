// En el Header, usá estas rutas exactas para que el navegador las encuentre:
<header style={styles.header}>
  <div style={styles.headerContent}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      {/* Ruta literal según el nombre de tu archivo subido */}
      <img src="/escudo.png.png" alt="Escudo Carbó Oficial" style={styles.logoImg} />
      <div>
        <h1 style={styles.title}>Carbó Comunica</h1>
        <p style={styles.subtitle}>Panel Técnico de Control • Operador/a: <strong>{usuarioLogueado}</strong></p>
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <button onClick={generarInformeSemanal} style={styles.buttonReportHeader}>📋 Generar Informe</button>
      <button onClick={handleLogout} style={styles.buttonLogout}>Salir ✕</button>
      {/* Ruta literal según el nombre de tu archivo subido */}
      <img src="/comunicacion.png.jpg" alt="Logo Comunicación Oficial" style={styles.logoImg} />
    </div>
  </div>
</header>
