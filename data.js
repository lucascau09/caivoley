/* =========================================================
   CAI VÓLEY — CAPA DE DATOS
   Acá se cargan jugadores, staff, indumentaria y galería.
   Todo es texto plano / JS: no hay base de datos.
   Reemplazá los placeholders por la info real del club.
   ========================================================= */

/* ---------- Utilidad: imagen placeholder con texto ---------- */
function ph(w, h, bg, fg, text) {
  return `https://placehold.co/${w}x${h}/${bg}/${fg}?text=${encodeURIComponent(text)}&font=inter`;
}

/* ---------- PLANTELES ---------- */
// Estructura fija del club: 2 ramas x 3 categorías formativas + 1 mayores.
const RAMAS = ["Masculino", "Femenino"];
const CATEGORIAS = ["Sub-14", "Sub-16", "Sub-18", "Mayores"];
const POSICIONES = ["Armador/a", "Central", "Punta receptor/a", "Opuesto/a", "Líbero"];

function generarPlanteles() {
  const jugadores = [];
  let id = 1;
  RAMAS.forEach((rama) => {
    CATEGORIAS.forEach((categoria) => {
      for (let i = 1; i <= 12; i++) {
        // Un único ejemplo "real" para mostrar el formato final; el resto queda como placeholder editable.
        if (rama === "Masculino" && categoria === "Sub-18" && i === 1) {
          jugadores.push({
            id: id++,
            rama, categoria,
            nombre: "Iván Torrejón",
            dorsal: 4,
            posicion: "Central",
            altura: "1.89 m",
            edad: 17,
            descripcion: "Central con gran lectura de bloqueo, capitán de la Sub-18 masculina.",
            imgPrincipal: ph(600, 760, "14418E", "FFFFFF", "Ivan Torrejon"),
            imgSecundaria: ph(600, 760, "0A2354", "FFFFFF", "En juego"),
          });
          continue;
        }
        jugadores.push({
          id: id++,
          rama, categoria,
          nombre: "Nombre Apellido",
          dorsal: i,
          posicion: POSICIONES[i % POSICIONES.length],
          altura: "— m",
          edad: "—",
          descripcion: "Completar con la descripción real del jugador o jugadora.",
          imgPrincipal: ph(600, 760, "DCE3F0", "0A2354", `${rama[0]}${categoria}-${i}`),
          imgSecundaria: ph(600, 760, "1E56B0", "FFFFFF", "Foto en juego"),
        });
      }
    });
  });
  return jugadores;
}

/* ---------- STAFF TÉCNICO ---------- */
function generarStaff() {
  const staff = [
    {
      id: 0,
      principal: true,
      nombre: "Martín Flores",
      cargo: "Entrenador Principal / Coordinador",
      rama: "Ambas ramas",
      categoria: "Coordinación general",
      descripcion: "Formación, años en el club, logros y rol dentro de la institución. Texto de ejemplo a reemplazar por el definitivo.",
      imgPrincipal: ph(700, 900, "0A2354", "FFFFFF", "Martin Flores"),
      imgSecundaria: ph(700, 900, "14418E", "FFFFFF", "Dirigiendo"),
    },
  ];
  let id = 1;
  RAMAS.forEach((rama) => {
    ["Sub-14 / Sub-16", "Sub-18 / Mayores"].forEach((categoria) => {
      for (let i = 1; i <= 3; i++) {
        staff.push({
          id: id++,
          principal: false,
          nombre: "Nombre Apellido",
          cargo: "Entrenador/a de categoría",
          rama, categoria,
          descripcion: "Breve biografía o detalle: categorías a cargo, formación, trayectoria.",
          imgPrincipal: ph(600, 760, "E8EEFB", "0A2354", `${rama[0]}-${i}`),
          imgSecundaria: ph(600, 760, "1E56B0", "FFFFFF", "En entrenamiento"),
        });
      }
    });
  });
  return staff;
}

/* ---------- INDUMENTARIA ---------- */
// 12 prendas: cada una con foto "de catálogo" y una segunda foto de uso/detalle.
const MERCH = [
  { id: 1, nombre: "Camiseta oficial de juego — Local", tipo: "Juego", material: "Poliéster interlock transpirable, escudo termosellado.",
    imgPrincipal: ph(600, 760, "14418E", "FFFFFF", "Camiseta Local"), imgSecundaria: ph(600, 760, "0E3070", "FFFFFF", "En cancha") },
  { id: 2, nombre: "Camiseta oficial de juego — Visitante", tipo: "Juego", material: "Poliéster interlock transpirable, escudo termosellado.",
    imgPrincipal: ph(600, 760, "0A0A0A", "FFFFFF", "Camiseta Visitante"), imgSecundaria: ph(600, 760, "0A2354", "FFFFFF", "En cancha") },
  { id: 3, nombre: "Musculosa de juego — Femenina", tipo: "Juego", material: "Tejido dry-fit liviano, corte femenino.",
    imgPrincipal: ph(600, 760, "1E56B0", "FFFFFF", "Musculosa Juego"), imgSecundaria: ph(600, 760, "14418E", "FFFFFF", "En cancha") },
  { id: 4, nombre: "Short de juego", tipo: "Juego", material: "Poliéster elastizado, cintura con cordón interno.",
    imgPrincipal: ph(600, 760, "0E3070", "FFFFFF", "Short Juego"), imgSecundaria: ph(600, 760, "1E56B0", "FFFFFF", "Detalle") },
  { id: 5, nombre: "Calza corta de juego", tipo: "Juego", material: "Lycra suplex con panel de compresión.",
    imgPrincipal: ph(600, 760, "0A2354", "FFFFFF", "Calza Corta"), imgSecundaria: ph(600, 760, "14418E", "FFFFFF", "Detalle") },
  { id: 6, nombre: "Medias oficiales", tipo: "Juego", material: "Algodón/poliamida, caña media con franjas del club.",
    imgPrincipal: ph(600, 760, "14418E", "FFFFFF", "Medias"), imgSecundaria: ph(600, 760, "0A2354", "FFFFFF", "Detalle") },
  { id: 7, nombre: "Camiseta de entrenamiento", tipo: "Entrenamiento", material: "Jersey liviano 100% poliéster, alta transpiración.",
    imgPrincipal: ph(600, 760, "E8EEFB", "0A2354", "Camiseta Training"), imgSecundaria: ph(600, 760, "DCE3F0", "0A2354", "En entrenamiento") },
  { id: 8, nombre: "Musculosa de entrenamiento", tipo: "Entrenamiento", material: "Tejido dry-fit, corte holgado.",
    imgPrincipal: ph(600, 760, "1E56B0", "FFFFFF", "Musculosa Training"), imgSecundaria: ph(600, 760, "0E3070", "FFFFFF", "En entrenamiento") },
  { id: 9, nombre: "Short de entrenamiento", tipo: "Entrenamiento", material: "Microfibra liviana, bolsillos laterales.",
    imgPrincipal: ph(600, 760, "0E3070", "FFFFFF", "Short Training"), imgSecundaria: ph(600, 760, "1E56B0", "FFFFFF", "Detalle") },
  { id: 10, nombre: "Calza larga de entrenamiento", tipo: "Entrenamiento", material: "Lycra térmica, ideal para pretemporada.",
    imgPrincipal: ph(600, 760, "0A2354", "FFFFFF", "Calza Larga"), imgSecundaria: ph(600, 760, "14418E", "FFFFFF", "Detalle") },
  { id: 11, nombre: "Buzo de calentamiento", tipo: "Entrenamiento", material: "Friza interior, canguro con capucha.",
    imgPrincipal: ph(600, 760, "0A2354", "FFFFFF", "Buzo Calentamiento"), imgSecundaria: ph(600, 760, "0E3070", "FFFFFF", "Detalle") },
  { id: 12, nombre: "Campera rompeviento", tipo: "Entrenamiento", material: "Tela impermeable liviana, ideal para la cancha al aire libre.",
    imgPrincipal: ph(600, 760, "14418E", "FFFFFF", "Campera"), imgSecundaria: ph(600, 760, "0A2354", "FFFFFF", "Detalle") },
];

/* ---------- GALERÍA POR TEMPORADA ---------- */
const GALERIA = {
  "2026": Array.from({ length: 10 }, (_, i) => ph(700, 500, "14418E", "FFFFFF", `2026 - Foto ${i + 1}`)),
  "2025": Array.from({ length: 10 }, (_, i) => ph(700, 500, "0E3070", "FFFFFF", `2025 - Foto ${i + 1}`)),
  "2024": Array.from({ length: 8 }, (_, i) => ph(700, 500, "0A2354", "FFFFFF", `2024 - Foto ${i + 1}`)),
};

/* ---------- Exponer todo en un único objeto global ---------- */
const CLUB_DATA = {
  ramas: RAMAS,
  categorias: CATEGORIAS,
  jugadores: generarPlanteles(),
  staff: generarStaff(),
  merch: MERCH,
  galeria: GALERIA,
  contacto: {
    whatsapp: "5493885961022", // mismo número usado en el sitio original
    instagram: "https://www.instagram.com/caivoleyoficial/?hl=es-la",
  },
};
