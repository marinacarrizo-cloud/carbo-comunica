function Actividades() {
  return (
    <div>
      <h2>✅ Actividades</h2>

      <button>+ Nueva actividad</button>

      <br />
      <br />

      <table width="100%">
        <thead>
          <tr>
            <th>Título</th>
            <th>Fecha</th>
            <th>Área</th>
            <th>Responsable</th>
            <th>Estado</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Gacetilla Feria de Ciencias</td>
            <td>26/06/2026</td>
            <td>Prensa</td>
            <td>Lic. Marina Carrizo</td>
            <td>Pendiente</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Actividades;