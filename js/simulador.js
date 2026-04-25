// =============================================
//   SIMULADOR DE VUELOS
//   Entrega final JS
// =============================================

// ---- DATOS ----
// Cada ruta tiene: origen, destino (códigos IATA), aerolínea y duración.
// Una misma ruta aplica en ambas direcciones (ida y vuelta).

const rutas = [
  // Domésticas desde/hacia Aeroparque (AEP)
  { origen: "AEP", destino: "COR", aerolinea: "Aerolíneas Argentinas", duracion: "1h 20min" },
  { origen: "AEP", destino: "MDZ", aerolinea: "Flybondi",              duracion: "1h 45min" },
  { origen: "AEP", destino: "BRC", aerolinea: "LATAM",                 duracion: "2h 30min" },
  { origen: "AEP", destino: "ROS", aerolinea: "Aerolíneas Argentinas", duracion: "0h 55min" },
  { origen: "AEP", destino: "SLA", aerolinea: "JetSmart",              duracion: "2h 10min" },

  // Domésticas desde/hacia Ezeiza (EZE)
  { origen: "EZE", destino: "COR", aerolinea: "JetSmart",              duracion: "1h 30min" },
  { origen: "EZE", destino: "MDZ", aerolinea: "Aerolíneas Argentinas", duracion: "1h 50min" },
  { origen: "EZE", destino: "BRC", aerolinea: "Aerolíneas Argentinas", duracion: "2h 40min" },

  // Internacionales desde Ezeiza (EZE)
  { origen: "EZE", destino: "GRU", aerolinea: "LATAM",                 duracion: "3h 00min" },
  { origen: "EZE", destino: "SCL", aerolinea: "Sky Airline",           duracion: "2h 10min" },
  { origen: "EZE", destino: "MIA", aerolinea: "American Airlines",     duracion: "9h 00min" },
  { origen: "EZE", destino: "MAD", aerolinea: "Iberia",                duracion: "12h 30min" },

  // Internacionales desde otros orígenes
  { origen: "SCL", destino: "MIA", aerolinea: "LATAM",                 duracion: "8h 30min" },
  { origen: "GRU", destino: "MAD", aerolinea: "Iberia",                duracion: "10h 45min" },
  { origen: "MIA", destino: "MAD", aerolinea: "Iberia",                duracion: "8h 00min" },
];

// Nombres completos de aeropuertos por código IATA
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

// ---- REFERENCIAS AL DOM ----

const inputNombre      = document.getElementById("nombre");
const selectOrigen     = document.getElementById("origen");
const selectDestino    = document.getElementById("destino");
const selectFecha      = document.getElementById("fecha");
const btnBuscar        = document.getElementById("btn-buscar");
const btnLimpiar       = document.getElementById("btn-limpiar");
const btnReservar      = document.getElementById("btn-reservar");
const btnBorrarTodo    = document.getElementById("btn-borrar-todo");
const divMensaje       = document.getElementById("mensaje");
const divResultado     = document.getElementById("resultado-vuelo");
const divInfoVuelo     = document.getElementById("info-vuelo");
const divListaReservas = document.getElementById("lista-reservas");

// Guarda temporalmente el vuelo encontrado antes de confirmar
let vueloActual = null;

// Referencia al temporizador del mensaje de éxito
let timerMensaje = null;

// ---- FUNCIONES ----

// Busca una ruta por origen y destino (también verifica la inversa)
function buscarRuta(origen, destino) {
  return rutas.find(
    r => (r.origen === origen && r.destino === destino) ||
         (r.origen === destino && r.destino === origen)
  ) || null;
}

// Muestra un mensaje en el DOM.
// Si es de tipo "exito", se cierra automáticamente a los 4 segundos.
function mostrarMensaje(texto, tipo) {
  if (timerMensaje) clearTimeout(timerMensaje);

  divMensaje.textContent = texto;
  divMensaje.className = "mensaje " + tipo;

  if (tipo === "exito") {
    timerMensaje = setTimeout(ocultarMensaje, 4000);
  }
}

// Oculta el mensaje y limpia el temporizador
function ocultarMensaje() {
  if (timerMensaje) {
    clearTimeout(timerMensaje);
    timerMensaje = null;
  }
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

// Elimina una reserva por su índice (pide confirmación antes)
function eliminarReserva(indice) {
  const confirmar = confirm("¿Seguro que querés eliminar esta reserva?");
  if (!confirmar) return;

  const reservas = obtenerReservas();
  reservas.splice(indice, 1);
  guardarReservas(reservas);
  renderizarReservas();
}

// ---- RENDER ----

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
        <p><strong>${r.pasajero}</strong></p>
        <p>${r.aerolinea} · ${r.duracion}</p>
        <p>📅 ${r.fecha}</p>
      </div>
      <button class="btn-eliminar" title="Eliminar reserva">✕</button>
    `;
    item.querySelector(".btn-eliminar").addEventListener("click", () => eliminarReserva(i));
    divListaReservas.appendChild(item);
  });
}

function mostrarResultadoVuelo(ruta, nombre, fecha) {
  divInfoVuelo.innerHTML = `
    <p>Pasajero:  <span>${nombre}</span></p>
    <p>Origen:    <span>${aeropuertos[ruta.origenCod]}</span></p>
    <p>Destino:   <span>${aeropuertos[ruta.destinoCod]}</span></p>
    <p>Aerolínea: <span>${ruta.aerolinea}</span></p>
    <p>Duración:  <span>${ruta.duracion}</span></p>
    <p>Fecha:     <span>${fecha}</span></p>
  `;
  divResultado.classList.remove("oculto");
}

// ---- EVENTOS ----

// Botón BUSCAR
btnBuscar.addEventListener("click", () => {
  const nombre  = inputNombre.value.trim();
  const origen  = selectOrigen.value;
  const destino = selectDestino.value;
  const fecha   = selectFecha.value;

  if (!nombre) {
    mostrarMensaje("Por favor ingresá tu nombre.", "error");
    return;
  }
  if (!origen) {
    mostrarMensaje("Por favor seleccioná un origen.", "error");
    return;
  }
  if (!destino) {
    mostrarMensaje("Por favor seleccioná un destino.", "error");
    return;
  }
  if (origen === destino) {
    mostrarMensaje("El origen y el destino no pueden ser iguales.", "error");
    return;
  }
  if (!fecha) {
    mostrarMensaje("Por favor seleccioná una fecha.", "error");
    return;
  }

  const ruta = buscarRuta(origen, destino);

  if (!ruta) {
    mostrarMensaje("No hay vuelos disponibles para esa ruta.", "error");
    divResultado.classList.add("oculto");
    return;
  }

  vueloActual = {
    pasajero:   nombre,
    origen:     origen,
    destino:    destino,
    aerolinea:  ruta.aerolinea,
    duracion:   ruta.duracion,
    fecha:      fecha,
  };

  ocultarMensaje();
  mostrarResultadoVuelo({ ...ruta, origenCod: origen, destinoCod: destino }, nombre, fecha);
});

// Botón CONFIRMAR RESERVA
btnReservar.addEventListener("click", () => {
  if (!vueloActual) return;

  agregarReserva(vueloActual);
  renderizarReservas();

  mostrarMensaje("¡Reserva confirmada! Buen viaje 🛫", "exito");
  divResultado.classList.add("oculto");

  inputNombre.value = "";
  selectOrigen.value = "";
  selectDestino.value = "";
  selectFecha.value = "";
  vueloActual = null;
});

// Botón LIMPIAR
btnLimpiar.addEventListener("click", () => {
  inputNombre.value = "";
  selectOrigen.value = "";
  selectDestino.value = "";
  selectFecha.value = "";
  divResultado.classList.add("oculto");
  ocultarMensaje();
  vueloActual = null;
});

// Botón BORRAR TODO
btnBorrarTodo.addEventListener("click", () => {
  if (obtenerReservas().length === 0) return;
  const confirmar = confirm("¿Seguro que querés borrar todas las reservas?");
  if (confirmar) {
    localStorage.removeItem("reservas");
    renderizarReservas();
  }
});

// ---- INICIO ----
renderizarReservas();
