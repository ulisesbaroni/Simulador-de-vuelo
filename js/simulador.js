// =============================================
//   SIMULADOR DE VUELOS — Entrega final JS
// =============================================

// ---- DATOS ----

const rutas = [
  { origen: "AEP", destino: "COR", aerolinea: "Aerolíneas Argentinas", duracion: "1h 20min" },
  { origen: "AEP", destino: "MDZ", aerolinea: "Flybondi",              duracion: "1h 45min" },
  { origen: "AEP", destino: "BRC", aerolinea: "LATAM",                 duracion: "2h 30min" },
  { origen: "AEP", destino: "ROS", aerolinea: "Aerolíneas Argentinas", duracion: "0h 55min" },
  { origen: "AEP", destino: "SLA", aerolinea: "JetSmart",              duracion: "2h 10min" },
  { origen: "EZE", destino: "COR", aerolinea: "JetSmart",              duracion: "1h 30min" },
  { origen: "EZE", destino: "MDZ", aerolinea: "Aerolíneas Argentinas", duracion: "1h 50min" },
  { origen: "EZE", destino: "BRC", aerolinea: "Aerolíneas Argentinas", duracion: "2h 40min" },
  { origen: "EZE", destino: "GRU", aerolinea: "LATAM",                 duracion: "3h 00min" },
  { origen: "EZE", destino: "SCL", aerolinea: "Sky Airline",           duracion: "2h 10min" },
  { origen: "EZE", destino: "MIA", aerolinea: "American Airlines",     duracion: "9h 00min" },
  { origen: "EZE", destino: "MAD", aerolinea: "Iberia",                duracion: "12h 30min" },
  { origen: "SCL", destino: "MIA", aerolinea: "LATAM",                 duracion: "8h 30min" },
  { origen: "GRU", destino: "MAD", aerolinea: "Iberia",                duracion: "10h 45min" },
  { origen: "MIA", destino: "MAD", aerolinea: "Iberia",                duracion: "8h 00min" },
];

const aeropuertos = {
  EZE: "Buenos Aires — Ezeiza (EZE)",
  AEP: "Buenos Aires — Aeroparque (AEP)",
  COR: "Córdoba — Ambrosio Taravella (COR)",
  MDZ: "Mendoza — El Plumerillo (MDZ)",
  BRC: "Bariloche — Teniente Candelaria (BRC)",
  ROS: "Rosario — Islas Malvinas (ROS)",
  SLA: "Salta — Martín Miguel de Güemes (SLA)",
  GRU: "São Paulo — Guarulhos (GRU)",
  SCL: "Santiago de Chile — Arturo Merino (SCL)",
  MIA: "Miami — Miami Intl. (MIA)",
  MAD: "Madrid — Adolfo Suárez Barajas (MAD)",
};

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DIAS  = ["Do","Lu","Ma","Mi","Ju","Vi","Sá"];

// ---- ESTADO ----

let tipoViaje     = "ida-vuelta";   // "ida-vuelta" | "solo-ida"
let cantPasajeros = 1;
let fechaSalida   = null;           // objeto Date
let fechaRegreso  = null;           // objeto Date
let calModoActivo = null;           // "salida" | "regreso"
let calBase       = new Date();     // primer mes visible en el calendario
calBase.setDate(1);

let vueloActual  = null;
let timerMensaje = null;

// ---- REFERENCIAS AL DOM ----

const inputNombre      = document.getElementById("nombre");
const selectOrigen     = document.getElementById("origen");
const selectDestino    = document.getElementById("destino");
const btnIdaVuelta     = document.getElementById("btn-ida-vuelta");
const btnSoloIda       = document.getElementById("btn-solo-ida");
const btnMenos         = document.getElementById("btn-menos");
const btnMas           = document.getElementById("btn-mas");
const cantEl           = document.getElementById("cant-pasajeros");
const btnSalida        = document.getElementById("btn-salida");
const btnRegreso       = document.getElementById("btn-regreso");
const campoRegreso     = document.getElementById("campo-regreso");
const calendario       = document.getElementById("calendario");
const calMeses         = document.getElementById("cal-meses");
const calGrids         = document.getElementById("cal-grids");
const calPrev          = document.getElementById("cal-prev");
const calNext          = document.getElementById("cal-next");
const calSeleccion     = document.getElementById("cal-seleccion");
const calAplicar       = document.getElementById("cal-aplicar");
const btnBuscar        = document.getElementById("btn-buscar");
const btnLimpiar       = document.getElementById("btn-limpiar");
const btnReservar      = document.getElementById("btn-reservar");
const btnBorrarTodo    = document.getElementById("btn-borrar-todo");
const divMensaje       = document.getElementById("mensaje");
const divResultado     = document.getElementById("resultado-vuelo");
const divInfoVuelo     = document.getElementById("info-vuelo");
const divListaReservas = document.getElementById("lista-reservas");

// ---- HELPERS DE FECHA ----

function formatFecha(date) {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

function mismodia(a, b) {
  return a && b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth()    === b.getMonth()    &&
    a.getDate()     === b.getDate();
}

function estaEnRango(date, desde, hasta) {
  if (!desde || !hasta) return false;
  return date > desde && date < hasta;
}

// ---- CALENDARIO ----

function renderCalendario() {
  // Dos meses: calBase y calBase+1
  const mes0 = new Date(calBase.getFullYear(), calBase.getMonth(), 1);
  const mes1 = new Date(calBase.getFullYear(), calBase.getMonth() + 1, 1);

  // Headers de mes
  calMeses.innerHTML = `
    <span>${MESES[mes0.getMonth()]} ${mes0.getFullYear()}</span>
    <span>${MESES[mes1.getMonth()]} ${mes1.getFullYear()}</span>
  `;

  calGrids.innerHTML = "";
  [mes0, mes1].forEach(mes => {
    calGrids.appendChild(buildGrid(mes));
  });

  // Texto de selección
  if (fechaSalida && fechaRegreso) {
    calSeleccion.textContent = `${formatFecha(fechaSalida)}  →  ${formatFecha(fechaRegreso)}`;
  } else if (fechaSalida) {
    calSeleccion.textContent = tipoViaje === "solo-ida"
      ? formatFecha(fechaSalida)
      : `${formatFecha(fechaSalida)}  →  ?`;
  } else {
    calSeleccion.textContent = "";
  }

  // Habilitar botón aplicar
  const listo = tipoViaje === "solo-ida"
    ? fechaSalida !== null
    : fechaSalida !== null && fechaRegreso !== null;
  calAplicar.disabled = !listo;
}

function buildGrid(mes) {
  const hoy     = new Date(); hoy.setHours(0,0,0,0);
  const year    = mes.getFullYear();
  const month   = mes.getMonth();
  const primer  = new Date(year, month, 1).getDay(); // día semana del 1ro
  const ultimo  = new Date(year, month + 1, 0).getDate();

  const grid = document.createElement("div");
  grid.className = "cal-grid";

  // Cabecera días
  DIAS.forEach(d => {
    const cell = document.createElement("span");
    cell.className = "cal-dia-nombre";
    cell.textContent = d;
    grid.appendChild(cell);
  });

  // Celdas vacías iniciales
  for (let i = 0; i < primer; i++) {
    const vacio = document.createElement("span");
    grid.appendChild(vacio);
  }

  // Días del mes
  for (let dia = 1; dia <= ultimo; dia++) {
    const fecha = new Date(year, month, dia);
    fecha.setHours(0,0,0,0);

    const cell = document.createElement("button");
    cell.className = "cal-dia";
    cell.textContent = dia;

    const pasado = fecha < hoy;
    if (pasado) {
      cell.disabled = true;
      cell.classList.add("pasado");
    } else {
      // Clases de selección
      if (mismodia(fecha, fechaSalida)) cell.classList.add("seleccionado", "inicio");
      if (mismodia(fecha, fechaRegreso)) cell.classList.add("seleccionado", "fin");
      if (estaEnRango(fecha, fechaSalida, fechaRegreso)) cell.classList.add("en-rango");

      cell.addEventListener("click", (e) => { e.stopPropagation(); elegirDia(fecha); });
    }

    grid.appendChild(cell);
  }

  return grid;
}

function elegirDia(fecha) {
  if (calModoActivo === "salida") {
    fechaSalida = fecha;
    if (fechaRegreso && fechaRegreso <= fechaSalida) fechaRegreso = null;

    if (tipoViaje === "ida-vuelta") {
      // Pasar automáticamente a modo regreso sin cerrar
      calModoActivo = "regreso";
      actualizarResalteBotonesFecha();
    }
    // En solo ida no hay nada más que hacer, el botón Aplicar se habilita

  } else if (calModoActivo === "regreso") {
    if (fecha <= fechaSalida) {
      // Clic anterior a salida: reinicia desde esa fecha
      fechaSalida = fecha;
      fechaRegreso = null;
    } else {
      fechaRegreso = fecha;
    }
  }

  renderCalendario();
}

// Resalta con clase cal-activo el botón del modo activo, quita del otro
function actualizarResalteBotonesFecha() {
  btnSalida.classList.toggle("cal-activo", calModoActivo === "salida");
  btnRegreso.classList.toggle("cal-activo", calModoActivo === "regreso");
}

function abrirCalendario(modo) {
  calModoActivo = modo;
  calBase = new Date();
  calBase.setDate(1);
  renderCalendario();
  calendario.classList.remove("oculto");
  actualizarResalteBotonesFecha();
}

function cerrarCalendario() {
  calendario.classList.add("oculto");
  calModoActivo = null;
  btnSalida.classList.remove("cal-activo");
  btnRegreso.classList.remove("cal-activo");
}

function aplicarFechas() {
  btnSalida.textContent = fechaSalida ? formatFecha(fechaSalida) : "Agregar fecha";
  btnSalida.classList.toggle("tiene-fecha", !!fechaSalida);
  btnRegreso.textContent = fechaRegreso ? formatFecha(fechaRegreso) : "Agregar fecha";
  btnRegreso.classList.toggle("tiene-fecha", !!fechaRegreso);
  cerrarCalendario();
}

// ---- TIPO DE VIAJE ----

function setTipoViaje(tipo) {
  tipoViaje = tipo;

  if (tipo === "ida-vuelta") {
    btnIdaVuelta.classList.add("activo");
    btnSoloIda.classList.remove("activo");
    campoRegreso.classList.remove("oculto");
    btnRegreso.disabled = false;
  } else {
    btnSoloIda.classList.add("activo");
    btnIdaVuelta.classList.remove("activo");
    campoRegreso.classList.add("oculto");
    fechaRegreso = null;
    btnRegreso.textContent = "Agregar fecha";
  btnRegreso.classList.remove("tiene-fecha");
  }
}

// ---- PASAJEROS ----

function actualizarPasajeros(delta) {
  cantPasajeros = Math.min(9, Math.max(1, cantPasajeros + delta));
  cantEl.textContent = cantPasajeros;
  btnMenos.disabled = cantPasajeros === 1;
  btnMas.disabled   = cantPasajeros === 9;
}

// ---- LÓGICA DE VUELOS ----

function buscarRuta(origen, destino) {
  return rutas.find(
    r => (r.origen === origen && r.destino === destino) ||
         (r.origen === destino && r.destino === origen)
  ) || null;
}

function mostrarResultadoVuelo(ruta, nombre, fecha, regreso) {
  let html = `
    <p>Pasajero:   <span>${nombre}</span></p>
    <p>Origen:     <span>${aeropuertos[ruta.origenCod]}</span></p>
    <p>Destino:    <span>${aeropuertos[ruta.destinoCod]}</span></p>
    <p>Aerolínea:  <span>${ruta.aerolinea}</span></p>
    <p>Duración:   <span>${ruta.duracion}</span></p>
    <p>Salida:     <span>${fecha}</span></p>
  `;
  if (regreso) html += `<p>Regreso:    <span>${regreso}</span></p>`;
  html += `<p>Pasajeros:  <span>${cantPasajeros}</span></p>`;
  divInfoVuelo.innerHTML = html;
  divResultado.classList.remove("oculto");
}

// ---- MENSAJES ----

function mostrarMensaje(texto, tipo) {
  if (timerMensaje) clearTimeout(timerMensaje);
  divMensaje.textContent = texto;
  divMensaje.className = "mensaje " + tipo;
  if (tipo === "exito") {
    timerMensaje = setTimeout(ocultarMensaje, 4000);
  }
}

function ocultarMensaje() {
  if (timerMensaje) { clearTimeout(timerMensaje); timerMensaje = null; }
  divMensaje.className = "mensaje oculto";
  divMensaje.textContent = "";
}

// ---- LOCALSTORAGE ----

function obtenerReservas() {
  const guardadas = localStorage.getItem("reservas");
  return guardadas ? JSON.parse(guardadas) : [];
}

function guardarReservas(reservas) {
  localStorage.setItem("reservas", JSON.stringify(reservas));
}

function agregarReserva(reserva) {
  const reservas = obtenerReservas();
  reservas.push(reserva);
  guardarReservas(reservas);
}

function eliminarReserva(indice) {
  if (!confirm("¿Seguro que querés eliminar esta reserva?")) return;
  const reservas = obtenerReservas();
  reservas.splice(indice, 1);
  guardarReservas(reservas);
  renderizarReservas();
}

// ---- RENDER RESERVAS ----

function renderizarReservas() {
  const reservas = obtenerReservas();
  if (reservas.length === 0) {
    divListaReservas.innerHTML = '<p class="vacio">Aún no tenés reservas guardadas.</p>';
    return;
  }
  divListaReservas.innerHTML = "";
  reservas.forEach((r, i) => {
    const item = document.createElement("div");
    item.className = "reserva-item";
    item.innerHTML = `
      <div class="reserva-info">
        <p class="reserva-ruta">${r.origen} → ${r.destino}</p>
        <p><strong>${r.pasajero}</strong> · ${r.pasajeros} pax</p>
        <p>${r.aerolinea} · ${r.duracion}</p>
        <p>📅 Salida: ${r.fecha}${r.regreso ? `  ·  Regreso: ${r.regreso}` : ""}</p>
        <p class="reserva-tipo">${r.tipoViaje === "ida-vuelta" ? "✈ Ida y vuelta" : "✈ Solo ida"}</p>
      </div>
      <button class="btn-eliminar" title="Eliminar reserva">✕</button>
    `;
    item.querySelector(".btn-eliminar").addEventListener("click", () => eliminarReserva(i));
    divListaReservas.appendChild(item);
  });
}

// ---- LIMPIAR FORMULARIO ----

function limpiarFormulario(mantenerMensaje = false) {
  inputNombre.value      = "";
  selectOrigen.value     = "";
  selectDestino.value    = "";
  fechaSalida            = null;
  fechaRegreso           = null;
  btnSalida.textContent  = "Agregar fecha";
  btnSalida.classList.remove("tiene-fecha");
  btnRegreso.textContent = "Agregar fecha";
  btnRegreso.classList.remove("tiene-fecha");
  cantPasajeros          = 1;
  cantEl.textContent     = "1";
  btnMenos.disabled      = true;
  setTipoViaje("ida-vuelta");
  divResultado.classList.add("oculto");
  if (!mantenerMensaje) ocultarMensaje();
  cerrarCalendario();
  vueloActual = null;
}

// ---- EVENTOS ----

btnIdaVuelta.addEventListener("click", () => setTipoViaje("ida-vuelta"));
btnSoloIda.addEventListener("click",   () => setTipoViaje("solo-ida"));

btnMenos.addEventListener("click", () => actualizarPasajeros(-1));
btnMas.addEventListener("click",   () => actualizarPasajeros(+1));

btnSalida.addEventListener("click", () => {
  if (calendario.classList.contains("oculto") || calModoActivo !== "salida") {
    abrirCalendario("salida");
  } else {
    cerrarCalendario();
  }
});

btnRegreso.addEventListener("click", () => {
  if (!fechaSalida) {
    mostrarMensaje("Primero seleccioná la fecha de salida.", "error");
    return;
  }
  if (calendario.classList.contains("oculto") || calModoActivo !== "regreso") {
    abrirCalendario("regreso");
  } else {
    cerrarCalendario();
  }
});

calPrev.addEventListener("click", (e) => {
  e.stopPropagation();
  calBase.setMonth(calBase.getMonth() - 1);
  renderCalendario();
});

calNext.addEventListener("click", (e) => {
  e.stopPropagation();
  calBase.setMonth(calBase.getMonth() + 1);
  renderCalendario();
});

calAplicar.addEventListener("click", (e) => { e.stopPropagation(); aplicarFechas(); });

// Cerrar calendario al hacer clic fuera
document.addEventListener("click", (e) => {
  if (!calendario.contains(e.target) &&
      e.target !== btnSalida &&
      e.target !== btnRegreso) {
    cerrarCalendario();
  }
});

btnBuscar.addEventListener("click", () => {
  const nombre  = inputNombre.value.trim();
  const origen  = selectOrigen.value;
  const destino = selectDestino.value;

  if (!nombre)  { mostrarMensaje("Por favor ingresá tu nombre.", "error"); return; }
  if (!origen)  { mostrarMensaje("Por favor seleccioná un origen.", "error"); return; }
  if (!destino) { mostrarMensaje("Por favor seleccioná un destino.", "error"); return; }
  if (origen === destino) { mostrarMensaje("El origen y el destino no pueden ser iguales.", "error"); return; }
  if (!fechaSalida) { mostrarMensaje("Por favor seleccioná la fecha de salida.", "error"); return; }
  if (tipoViaje === "ida-vuelta" && !fechaRegreso) {
    mostrarMensaje("Por favor seleccioná la fecha de regreso.", "error"); return;
  }

  const ruta = buscarRuta(origen, destino);
  if (!ruta) {
    mostrarMensaje("No hay vuelos disponibles para esa ruta.", "error");
    divResultado.classList.add("oculto");
    return;
  }

  vueloActual = {
    pasajero:  nombre,
    pasajeros: cantPasajeros,
    tipoViaje,
    origen,
    destino,
    aerolinea: ruta.aerolinea,
    duracion:  ruta.duracion,
    fecha:     formatFecha(fechaSalida),
    regreso:   fechaRegreso ? formatFecha(fechaRegreso) : null,
  };

  ocultarMensaje();
  mostrarResultadoVuelo(
    { ...ruta, origenCod: origen, destinoCod: destino },
    nombre,
    formatFecha(fechaSalida),
    fechaRegreso ? formatFecha(fechaRegreso) : null
  );
});

btnReservar.addEventListener("click", () => {
  if (!vueloActual) return;
  agregarReserva(vueloActual);
  renderizarReservas();
  mostrarMensaje("¡Reserva confirmada! Buen viaje 🛫", "exito");
  limpiarFormulario(true);
});

btnLimpiar.addEventListener("click", limpiarFormulario);

btnBorrarTodo.addEventListener("click", () => {
  if (obtenerReservas().length === 0) return;
  if (confirm("¿Seguro que querés borrar todas las reservas?")) {
    localStorage.removeItem("reservas");
    renderizarReservas();
  }
});

// ---- INICIO ----
btnMenos.disabled = true;
setTipoViaje("ida-vuelta");
renderizarReservas();

// Pantalla de inicio
const pantallaInicio = document.getElementById("pantalla-inicio");
const app            = document.getElementById("app");

document.getElementById("btn-iniciar").addEventListener("click", () => {
  pantallaInicio.classList.add("saliendo");
  app.classList.remove("oculto");
  // Elimina del DOM al terminar la transición
  pantallaInicio.addEventListener("transitionend", () => {
    pantallaInicio.remove();
  }, { once: true });
});
