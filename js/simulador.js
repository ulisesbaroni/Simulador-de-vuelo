// ---- DATOS ----

const vuelos = [
  { destino: "buenos aires", duracion: "1h 10min", aerolinea: "Aerolíneas Argentinas" },
  { destino: "córdoba",      duracion: "1h 20min", aerolinea: "Flybondi"              },
  { destino: "mendoza",      duracion: "1h 45min", aerolinea: "JetSmart"              },
  { destino: "bariloche",    duracion: "2h 30min", aerolinea: "LATAM"                 },
  { destino: "miami",        duracion: "9h 00min", aerolinea: "American Airlines"     },
];



// ---- REFERENCIAS AL DOM ----

const inputNombre      = document.getElementById("nombre");
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

// Referencia al temporizador del mensaje de éxito (para cancelarlo si es necesario)
let timerMensaje = null;



// ---- FUNCIONES ----

// Busca un vuelo en el array por destino
function buscarVuelo(destino) {
  return vuelos.find(v => v.destino === destino.toLowerCase()) || null;
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

// Devuelve el array de reservas guardadas (o vacío si no hay nada)
function obtenerReservas() {
  const guardadas = localStorage.getItem("reservas");
  return guardadas ? JSON.parse(guardadas) : [];
}

// Guarda el array actualizado en localStorage
function guardarReservas(reservas) {
  localStorage.setItem("reservas", JSON.stringify(reservas));
}

// Agrega una nueva reserva al localStorage
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

// Renderiza todas las reservas en el panel derecho
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
        <p class="reserva-destino">✈ ${r.destino.toUpperCase()}</p>
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

// Muestra los detalles del vuelo encontrado en el panel
function mostrarResultadoVuelo(vuelo, nombre, fecha) {
  divInfoVuelo.innerHTML = `
    <p>Pasajero: <span>${nombre}</span></p>
    <p>Destino: <span>${vuelo.destino.charAt(0).toUpperCase() + vuelo.destino.slice(1)}</span></p>
    <p>Aerolínea: <span>${vuelo.aerolinea}</span></p>
    <p>Duración: <span>${vuelo.duracion}</span></p>
    <p>Fecha: <span>${fecha}</span></p>
  `;
  divResultado.classList.remove("oculto");
}



// ---- EVENTOS ----

// Botón BUSCAR
btnBuscar.addEventListener("click", () => {
  const nombre  = inputNombre.value.trim();
  const destino = selectDestino.value;
  const fecha   = selectFecha.value;

  if (!nombre) {
    mostrarMensaje("Por favor ingresá tu nombre.", "error");
    return;
  }
  if (!destino) {
    mostrarMensaje("Por favor seleccioná un destino.", "error");
    return;
  }
  if (!fecha) {
    mostrarMensaje("Por favor seleccioná una fecha.", "error");
    return;
  }

  const vuelo = buscarVuelo(destino);
  vueloActual = { ...vuelo, pasajero: nombre, fecha };
  ocultarMensaje();
  mostrarResultadoVuelo(vuelo, nombre, fecha);
});

// Botón CONFIRMAR RESERVA
btnReservar.addEventListener("click", () => {
  if (!vueloActual) return;

  agregarReserva(vueloActual);
  renderizarReservas();

  mostrarMensaje("¡Reserva confirmada! Buen viaje 🛫", "exito");
  divResultado.classList.add("oculto");

  inputNombre.value = "";
  selectDestino.value = "";
  selectFecha.value = "";
  vueloActual = null;
});

// Botón LIMPIAR
btnLimpiar.addEventListener("click", () => {
  inputNombre.value = "";
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
// Carga las reservas guardadas al abrir la página
renderizarReservas();
