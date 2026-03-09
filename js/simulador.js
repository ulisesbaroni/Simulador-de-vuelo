//   SIMULADOR DE VUELOS
//   Primera pre-entrega JS

const destinosDisponibles = ["Buenos aires", "Córdoba", "Mendoza", "Bariloche", "Miami"];

const vuelos = [
  { destino: "buenos aires", duracion: "1h 10min", aerolinea: "Aerolíneas Argentinas" },
  { destino: "córdoba",      duracion: "1h 20min", aerolinea: "Flybondi"              },
  { destino: "mendoza",      duracion: "1h 45min", aerolinea: "JetSmart"              },
  { destino: "bariloche",    duracion: "2h 30min", aerolinea: "LATAM"                 },
  { destino: "miami",        duracion: "9h 00min", aerolinea: "American Airlines"     },
];

const fechasDisponibles = ["15/04/2025", "22/04/2025", "30/04/2025"];

// Funciones

function elegirFecha() {
  let opcionFecha = prompt(
    "Elegí una fecha para tu vuelo (Opción 1, 2 o 3):\n" +
    "1 - " + fechasDisponibles[0] + "\n" +
    "2 - " + fechasDisponibles[1] + "\n" +
    "3 - " + fechasDisponibles[2]
  );

  if (opcionFecha === "1" || opcionFecha === "2" || opcionFecha === "3") {
    return fechasDisponibles[opcionFecha - 1];
  } else {
    alert("Opción no válida. Volvé al menú e intentá de nuevo.");
    return null;
  }
}

function buscarVuelo(destino) {
  for (let i = 0; i < vuelos.length; i++) {
    if (vuelos[i].destino.toLowerCase() === destino.toLowerCase()) {
      return vuelos[i];
    }
  }
  return null;
}

function mostrarDestinos() {
  let lista = "Destinos disponibles:\n";
  for (let i = 0; i < destinosDisponibles.length; i++) {
    lista += (i + 1) + "- " + destinosDisponibles[i] + "\n";
  }
  return lista;
}

function simularVuelo(vuelo, pasajero, fecha) {
  alert(
    "✈️ RESUMEN DE TU VUELO\n" +
    "─────────────────────────\n" +
    "Pasajero:  " + pasajero + "\n" +
    "Destino:   " + vuelo.destino + "\n" +
    "Aerolínea: " + vuelo.aerolinea + "\n" +
    "Duración:  " + vuelo.duracion + "\n" +
    "Fecha:     " + fecha
  );
}

// Ejecuto el programa

let pasajero = prompt("¡Bienvenido al Simulador de Vuelos!\n¿Cuál es tu nombre?");

if (pasajero === null || pasajero.trim() === "") {
  alert("No ingresaste tu nombre. El simulador se cerrará.");
} else {
  alert("Hola, " + pasajero + "! Vamos a simular tu vuelo.");

  let opcion = prompt(
    "¿Qué querés hacer?\n" +
    "1 - Ver destinos disponibles\n" +
    "2 - Buscar un vuelo\n" +
    "X - Salir"
  );

  while (opcion !== null && opcion.toLowerCase() !== "x") {

    if (opcion === "1") {
      alert(mostrarDestinos());

    } else if (opcion === "2") {
      let destinoElegido = prompt("¿Escribe a qué destino querés volar?\n" + mostrarDestinos());

      if (destinoElegido === null || destinoElegido.trim() === "") {
        alert("No ingresaste un destino.");
      } else {
        let vuelo = buscarVuelo(destinoElegido.trim().toLowerCase());

        if (vuelo !== null) {
          let fecha = elegirFecha();
          if (fecha !== null) {
            simularVuelo(vuelo, pasajero, fecha);
          }
        } else {
          alert("No encontramos el destino '" + destinoElegido + "'.\nRevisá los destinos disponibles con la opción 1.");
        }
      }

    } else {
      alert("Opción no válida. Ingresa 1, 2 o X.");
    }

    opcion = prompt(
      "¿Qué querés hacer?\n" +
      "1 - Ver destinos disponibles\n" +
      "2 - Buscar un vuelo\n" +
      "X - Salir"
    );
  }

  alert("¡Gracias por usar el Simulador de Vuelos! Buen viaje, " + pasajero + " 🛫");
}