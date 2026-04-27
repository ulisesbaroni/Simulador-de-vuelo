
// ---- Clase Aeropuerto ----

class Aeropuerto {
  constructor({ codigo, nombre, pais }) {
    this.codigo = codigo;
    this.nombre = nombre;
    this.pais   = pais;
  }

  // Retorna el nombre completo con código IATA entre paréntesis
  getNombreCompleto() {
    return `${this.nombre} (${this.codigo})`;
  }

  // Retorna true si el aeropuerto es de Argentina
  esDomestico() {
    return this.pais === "AR";
  }
}

// ---- Estado de la aplicación ----

let rutas         = [];
let aeropuertos   = [];
let tipoViaje     = "ida-vuelta";
let cantPasajeros = 1;
let fechaSalida   = null;
let fechaRegreso  = null;
let calModoActivo = null;
let calBase       = new Date(); calBase.setDate(1);
let vueloActual   = null;
let timerMensaje  = null;

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DIAS  = ["Do","Lu","Ma","Mi","Ju","Vi","Sá"];

// ---- Referencias al DOM ----

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

// ---- Helpers ----

function formatFecha(date) {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${d}/${m}/${date.getFullYear()}`;
}

function mismodia(a, b) {
  return a && b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth()    === b.getMonth()    &&
    a.getDate()     === b.getDate();
}

function estaEnRango(date, desde, hasta) {
  return desde && hasta && date > desde && date < hasta;
}

// ---- Carga de datos (fetch asíncrono) ----

async function cargarDatos() {
  const res  = await fetch("datos.json");
  const data = await res.json();

  // Instanciar cada aeropuerto como objeto de la clase Aeropuerto
  aeropuertos = data.aeropuertos.map(a => new Aeropuerto(a));
  rutas       = data.rutas;

  poblarSelects();
}

// Rellena los selects de origen y destino con los aeropuertos cargados
function poblarSelects() {
  const domesticos       = aeropuertos.filter(a => a.esDomestico());
  const internacionales  = aeropuertos.filter(a => !a.esDomestico());

  [selectOrigen, selectDestino].forEach(select => {
    const defaultOption = select.querySelector("option");

    select.innerHTML = "";
    select.appendChild(defaultOption);

    const grupoDom = document.createElement("optgroup");
    grupoDom.label = "🇦🇷 Argentina";
    domesticos.forEach(a => {
      const opt = document.createElement("option");
      opt.value       = a.codigo;
      opt.textContent = a.getNombreCompleto();
      grupoDom.appendChild(opt);
    });

    const grupoInt = document.createElement("optgroup");
    grupoInt.label = "🌎 Internacional";
    internacionales.forEach(a => {
      const opt = document.createElement("option");
      opt.value       = a.codigo;
      opt.textContent = a.getNombreCompleto();
      grupoInt.appendChild(opt);
    });

    select.appendChild(grupoDom);
    select.appendChild(grupoInt);
  });
}

// ---- Vuelos ----

function buscarRuta(origen, destino) {
  return rutas.find(
    r => (r.origen === origen && r.destino === destino) ||
         (r.origen === destino && r.destino === origen)
  ) || null;
}

function getNombreAeropuerto(codigo) {
  const aeropuerto = aeropuertos.find(a => a.codigo === codigo);
  return aeropuerto ? aeropuerto.getNombreCompleto() : codigo;
}

function mostrarResultadoVuelo(ruta, nombre, salida, regreso) {
  let html = `
    <p>Pasajero:   <span>${nombre}</span></p>
    <p>Origen:     <span>${getNombreAeropuerto(ruta.origen)}</span></p>
    <p>Destino:    <span>${getNombreAeropuerto(ruta.destino)}</span></p>
    <p>Aerolínea:  <span>${ruta.aerolinea}</span></p>
    <p>Duración:   <span>${ruta.duracion}</span></p>
    <p>Salida:     <span>${salida}</span></p>
  `;
  if (regreso) html += `<p>Regreso:    <span>${regreso}</span></p>`;
  html += `<p>Pasajeros:  <span>${cantPasajeros}</span></p>`;
  divInfoVuelo.innerHTML = html;
  divResultado.classList.remove("oculto");
}

// ---- Calendario ----

function renderCalendario() {
  const mes0 = new Date(calBase.getFullYear(), calBase.getMonth(), 1);
  const mes1 = new Date(calBase.getFullYear(), calBase.getMonth() + 1, 1);

  calMeses.innerHTML = `
    <span>${MESES[mes0.getMonth()]} ${mes0.getFullYear()}</span>
    <span>${MESES[mes1.getMonth()]} ${mes1.getFullYear()}</span>
  `;

  calGrids.innerHTML = "";
  [mes0, mes1].forEach(mes => calGrids.appendChild(buildGrid(mes)));

  if (fechaSalida && fechaRegreso) {
    calSeleccion.textContent = `${formatFecha(fechaSalida)}  →  ${formatFecha(fechaRegreso)}`;
  } else if (fechaSalida) {
    calSeleccion.textContent = tipoViaje === "solo-ida"
      ? formatFecha(fechaSalida)
      : `${formatFecha(fechaSalida)}  →  ?`;
  } else {
    calSeleccion.textContent = "";
  }

  const listo = tipoViaje === "solo-ida"
    ? fechaSalida !== null
    : fechaSalida !== null && fechaRegreso !== null;
  calAplicar.disabled = !listo;
}

function buildGrid(mes) {
  const hoy    = new Date(); hoy.setHours(0,0,0,0);
  const year   = mes.getFullYear();
  const month  = mes.getMonth();
  const primer = new Date(year, month, 1).getDay();
  const ultimo = new Date(year, month + 1, 0).getDate();

  const grid = document.createElement("div");
  grid.className = "cal-grid";

  DIAS.forEach(d => {
    const cell = document.createElement("span");
    cell.className = "cal-dia-nombre";
    cell.textContent = d;
    grid.appendChild(cell);
  });

  for (let i = 0; i < primer; i++) {
    grid.appendChild(document.createElement("span"));
  }

  for (let dia = 1; dia <= ultimo; dia++) {
    const fecha = new Date(year, month, dia);
    fecha.setHours(0,0,0,0);

    const cell = document.createElement("button");
    cell.className  = "cal-dia";
    cell.textContent = dia;

    if (fecha < hoy) {
      cell.disabled = true;
      cell.classList.add("pasado");
    } else {
      if (mismodia(fecha, fechaSalida))  cell.classList.add("seleccionado", "inicio");
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
      calModoActivo = "regreso";
      actualizarResalteBotonesFecha();
    }

  } else if (calModoActivo === "regreso") {
    if (fecha <= fechaSalida) {
      fechaSalida  = fecha;
      fechaRegreso = null;
    } else {
      fechaRegreso = fecha;
    }
  }

  renderCalendario();
}

function actualizarResalteBotonesFecha() {
  btnSalida.classList.toggle("cal-activo", calModoActivo === "salida");
  btnRegreso.classList.toggle("cal-activo", calModoActivo === "regreso");
}

function abrirCalendario(modo) {
  calModoActivo = modo;
  calBase = new Date(); calBase.setDate(1);
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

// ---- Tipo de viaje ----

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

// ---- Pasajeros ----

function actualizarPasajeros(delta) {
  cantPasajeros = Math.min(9, Math.max(1, cantPasajeros + delta));
  cantEl.textContent = cantPasajeros;
  btnMenos.disabled  = cantPasajeros === 1;
  btnMas.disabled    = cantPasajeros === 9;
}

// ---- Mensajes ----

function mostrarMensaje(texto, tipo) {
  if (timerMensaje) clearTimeout(timerMensaje);
  divMensaje.textContent = texto;
  divMensaje.className   = "mensaje " + tipo;
  if (tipo === "exito") timerMensaje = setTimeout(ocultarMensaje, 4000);
}

function ocultarMensaje() {
  if (timerMensaje) { clearTimeout(timerMensaje); timerMensaje = null; }
  divMensaje.className   = "mensaje oculto";
  divMensaje.textContent = "";
}

// ---- localStorage ----

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

// ---- Render de reservas ----

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
        <p>Salida: ${r.fecha}${r.regreso ? `  ·  Regreso: ${r.regreso}` : ""}</p>
        <p class="reserva-tipo">${r.tipoViaje === "ida-vuelta" ? "✈ Ida y vuelta" : "✈ Solo ida"}</p>
      </div>
      <button class="btn-eliminar" title="Eliminar reserva">✕</button>
    `;
    item.querySelector(".btn-eliminar").addEventListener("click", () => eliminarReserva(i));
    divListaReservas.appendChild(item);
  });
}

// ---- Limpiar formulario ----

function limpiarFormulario(mantenerMensaje = false) {
  inputNombre.value   = "";
  selectOrigen.value  = "";
  selectDestino.value = "";
  fechaSalida         = null;
  fechaRegreso        = null;
  cantPasajeros       = 1;
  cantEl.textContent  = "1";
  btnMenos.disabled   = true;
  btnSalida.textContent  = "Agregar fecha";
  btnSalida.classList.remove("tiene-fecha");
  btnRegreso.textContent = "Agregar fecha";
  btnRegreso.classList.remove("tiene-fecha");
  vueloActual = null;
  setTipoViaje("ida-vuelta");
  divResultado.classList.add("oculto");
  cerrarCalendario();
  if (!mantenerMensaje) ocultarMensaje();
}

// ---- Eventos ----

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

  if (!nombre)            { mostrarMensaje("Por favor ingresá tu nombre.", "error"); return; }
  if (!origen)            { mostrarMensaje("Por favor seleccioná un origen.", "error"); return; }
  if (!destino)           { mostrarMensaje("Por favor seleccioná un destino.", "error"); return; }
  if (origen === destino) { mostrarMensaje("El origen y el destino no pueden ser iguales.", "error"); return; }
  if (!fechaSalida)       { mostrarMensaje("Por favor seleccioná la fecha de salida.", "error"); return; }
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
  mostrarResultadoVuelo(ruta, nombre, formatFecha(fechaSalida), fechaRegreso ? formatFecha(fechaRegreso) : null);
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

// ---- Pantalla de inicio ----

const pantallaInicio = document.getElementById("pantalla-inicio");
const app            = document.getElementById("app");

document.getElementById("btn-iniciar").addEventListener("click", () => {
  pantallaInicio.classList.add("saliendo");
  app.classList.remove("oculto");
  pantallaInicio.addEventListener("transitionend", () => pantallaInicio.remove(), { once: true });
});

// ---- Inicialización ----

btnMenos.disabled = true;
setTipoViaje("ida-vuelta");
renderizarReservas();
cargarDatos(); // carga aeropuertos y rutas desde datos.json de forma asíncrona
