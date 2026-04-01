# ✈️ Simulador de Vuelos

Segunda pre-entrega JS — Curso de JavaScript

---

## Descripción

Simulador de vuelos interactivo con interfaz visual. El usuario puede buscar vuelos por destino y fecha, confirmar reservas y consultarlas en cualquier momento. Los datos se persisten en el navegador mediante `localStorage`.

> La primera pre-entrega utilizaba `prompt` y `alert` para toda la interacción. Esta versión migra completamente al DOM.

---

## Archivos

```
Segunda Pre-entrega (Simulador de vuelos)/
├── css/
│   └── estilos.css
├── js/
│   └── simulador.js
└── index.html
```

---

## ¿Cómo usarlo?

1. Cloná o descargá el repositorio
2. Abrí `index.html` en el navegador (recomendado: Live Server en VS Code)
3. Completá el formulario, buscá tu vuelo y confirmá la reserva

---

## Flujo del simulador

```
1. Ingresar nombre del pasajero
2. Seleccionar destino y fecha
3. Hacer clic en "Buscar vuelo"
   └── Si es válido → se muestra tarjeta con info del vuelo
4. Confirmar reserva → se guarda en localStorage
5. Panel derecho muestra todas las reservas guardadas
   ├── Eliminar reserva individual (✕)
   └── Borrar todas las reservas
```

---

## Destinos disponibles

| Destino       | Aerolínea              | Duración   |
|---------------|------------------------|------------|
| Buenos Aires  | Aerolíneas Argentinas  | 1h 10min   |
| Córdoba       | Flybondi               | 1h 20min   |
| Mendoza       | JetSmart               | 1h 45min   |
| Bariloche     | LATAM                  | 2h 30min   |
| Miami         | American Airlines      | 9h 00min   |

---

## Conceptos de JS aplicados

### Primera pre-entrega
- Variables y constantes (`let`, `const`)
- Arrays y array de objetos
- Funciones con parámetros
- Ciclo `while` y `for`
- Condicionales `if / else if / else`
- Métodos de string: `.toLowerCase()`, `.trim()`
- Entrada y salida: `prompt()`, `alert()`

### Segunda pre-entrega _(nuevo)_
- Manipulación del DOM (`getElementById`, `innerHTML`, `classList`)
- Eventos (`addEventListener`) en botones
- Validación de formularios desde JS
- `localStorage`: `setItem`, `getItem`, `removeItem`, `JSON.stringify/parse`
- Renderizado dinámico de elementos con `createElement`
- Método `.find()` en arrays de objetos
- Temporizadores: `setTimeout` y `clearTimeout`
- Confirmaciones nativas del navegador con `confirm()`
