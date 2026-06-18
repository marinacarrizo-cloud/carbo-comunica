import "./index.css";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TaskIcon from "@mui/icons-material/Task";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CampaignIcon from "@mui/icons-material/Campaign";
import BarChartIcon from "@mui/icons-material/BarChart";

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

          <button><DashboardIcon /> Dashboard</button>

          <button><TaskIcon /> Actividades</button>

          <button><CalendarMonthIcon /> Agenda</button>

          <button><NewspaperIcon /> Gacetillas</button>

          <button><PhotoCameraIcon /> Coberturas</button>

          <button><CampaignIcon /> Redes Sociales</button>

          <button><BarChartIcon /> Estadísticas</button>

        </div>

      </aside>

      <main className="contenido">

        <h2>Bienvenida, Marina 👋</h2>

        <p>
          Plataforma de gestión del Departamento de Comunicación Institucional.
        </p>

        <div className="tarjetas">

          <div className="tarjeta">
            <div className="numero">0</div>
            <div className="tituloTarjeta">
              Actividades pendientes
            </div>
          </div>

          <div className="tarjeta">
            <div className="numero">0</div>
            <div className="tituloTarjeta">
              Gacetillas
            </div>
          </div>

          <div className="tarjeta">
            <div className="numero">0</div>
            <div className="tituloTarjeta">
              Coberturas
            </div>
          </div>

          <div className="tarjeta">
            <div className="numero">0</div>
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