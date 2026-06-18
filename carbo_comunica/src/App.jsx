import "./index.css";

function App() {
  return (
    <div className="app">

      <aside className="sidebar">

        <h1 className="logo">
          CARBÓ COMUNICA
        </h1>

        <p className="subtitulo">
          Departamento de Comunicación Institucional
        </p>

        <p className="escuela">
          Escuela Normal Superior Dr. Alejandro Carbó
        </p>

        <div className="menu">

          <button>🏠 Dashboard</button>

          <button>✅ Actividades</button>

          <button>📅 Agenda</button>

          <button>📰 Gacetillas</button>

          <button>📸 Coberturas</button>

          <button>📱 Redes Sociales</button>

          <button>🎥 Streaming</button>

          <button>🤝 Vinculación</button>

          <button>📊 Estadísticas</button>

        </div>

      </aside>

      <main className="contenido">

        <h2>Bienvenida, Marina 👋</h2>

        <p>
          Plataforma de gestión del Departamento de Comunicación Institucional.
        </p>

        <div className="tarjetas">

          <div className="tarjeta">

            <div className="numero">12</div>

            <div className="tituloTarjeta">
              Actividades pendientes
            </div>

          </div>

          <div className="tarjeta">

            <div className="numero">4</div>

            <div className="tituloTarjeta">
              Gacetillas
            </div>

          </div>

          <div className="tarjeta">

            <div className="numero">7</div>

            <div className="tituloTarjeta">
              Coberturas
            </div>

          </div>

          <div className="tarjeta">

            <div className="numero">9</div>

            <div className="tituloTarjeta">
              Redes Sociales
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default App;