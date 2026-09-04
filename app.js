/* =========================================================
   CAI VÓLEY — LÓGICA COMPARTIDA
   Un solo archivo incluido en todas las páginas.
   Cada bloque se auto-desactiva si no encuentra sus elementos,
   así no hay errores en páginas que no usan esa función.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initLoadingScreen();
  initScrollReveal();
  initCustomSelects();
  initPlanteles();
  initStaff();
  initMerch();
  initGaleria();
  initInscripcion();
  initInstitucionalHero();
  initNoticias();
  initTransicionesNav();
});

/* =========================================================
   HELPERS GENERALES: cerrar modal/lightbox con transición
   suave (nunca de golpe) + una pequeña lluvia de triángulos.
   ========================================================= */
function spawnParticulasTriangulo(container) {
  if (!container) return;
  const colores = ["var(--azul-500)", "var(--azul-700)", "var(--acento)", "var(--azul-100)", "var(--azul-900)"];
  const cont = document.createElement("div");
  cont.className = "particulas-triangulo";
  const total = 7;
  for (let i = 0; i < total; i++) {
    const t = document.createElement("span");
    const angulo = (360 / total) * i + (Math.random() * 20 - 10);
    t.style.setProperty("--angulo", angulo + "deg");
    t.style.setProperty("--distancia", 70 + Math.random() * 50 + "px");
    t.style.background = colores[i % colores.length];
    cont.appendChild(t);
  }
  container.appendChild(cont);
  window.setTimeout(() => cont.remove(), 600);
}

function cerrarModalSuave(modal, opciones = {}) {
  if (!modal || !modal.classList.contains("modal--abierto")) return;
  if (opciones.conParticulas) spawnParticulasTriangulo(modal.querySelector(".modal__caja"));
  modal.classList.add("modal--cerrando");
  window.setTimeout(() => {
    modal.classList.remove("modal--abierto");
    modal.classList.remove("modal--cerrando");
    document.body.style.overflow = "";
    if (typeof opciones.alTerminar === "function") opciones.alTerminar();
  }, 320);
}

function cerrarLightboxSuave(lightbox) {
  if (!lightbox || !lightbox.classList.contains("lightbox--abierto")) return;
  lightbox.classList.add("lightbox--cerrando");
  window.setTimeout(() => {
    lightbox.classList.remove("lightbox--abierto");
    lightbox.classList.remove("lightbox--cerrando");
    document.body.style.overflow = "";
  }, 280);
}

/* =========================================================
   1. PANTALLA DE CARGA
   Barra de progreso real + al terminar, la cortina no baja
   lisa: se "desarma" en triángulos que vuelan hacia arriba.
   ========================================================= */
function initLoadingScreen() {
  const splash = document.querySelector(".intro-splash");
  if (!splash) return;
  const bar = splash.querySelector(".intro-splash__progreso span");
  const duracionMs = 2600;
  const inicio = performance.now();

  function tick(t) {
    const pct = Math.min(100, ((t - inicio) / duracionMs) * 100);
    if (bar) bar.style.width = pct + "%";
    if (pct < 100) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  window.setTimeout(() => {
    splash.classList.add("intro-splash--salir");
    document.body.classList.remove("tiene-splash");
    // Los triángulos de la cortina terminan de volar ~1.5s después de arrancar.
    // Recién ahí se apaga el resto del overlay, con un fundido corto y liviano.
    window.setTimeout(() => {
      splash.classList.add("intro-splash--oculto");
      window.setTimeout(() => splash.remove(), 450);
    }, 1500);
  }, duracionMs + 250);
}

/* =========================================================
   2. REVELADO AL HACER SCROLL
   ========================================================= */
function initScrollReveal() {
  const targets = document.querySelectorAll("[data-reveal]:not(.en-vista)");
  if (!targets.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    targets.forEach((el) => el.classList.add("en-vista"));
    return;
  }

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("en-vista");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  targets.forEach((el) => obs.observe(el));
}

/* =========================================================
   3. SELECTS PERSONALIZADOS (filtros)
   Reemplaza los <select> nativos por un menú liviano acorde
   a la identidad del sitio. Expone el valor elegido en
   data-valor y dispara un evento "cambio" en el contenedor.
   ========================================================= */
function initCustomSelects() {
  const selects = document.querySelectorAll(".select-custom");
  if (!selects.length) return;

  function cerrarTodos() {
    selects.forEach((s) => s.classList.remove("abierto"));
  }

  selects.forEach((cont) => {
    const boton = cont.querySelector(".select-custom__boton");
    const label = cont.querySelector(".select-custom__label");
    const opciones = cont.querySelectorAll(".select-custom__opcion");

    boton.addEventListener("click", (e) => {
      e.stopPropagation();
      const yaAbierto = cont.classList.contains("abierto");
      cerrarTodos();
      if (!yaAbierto) cont.classList.add("abierto");
    });

    opciones.forEach((op) => {
      op.addEventListener("click", () => {
        opciones.forEach((o) => o.classList.remove("select-custom__opcion--activa"));
        op.classList.add("select-custom__opcion--activa");
        cont.dataset.valor = op.dataset.valor;
        label.textContent = op.textContent;
        cont.classList.remove("abierto");
        cont.dispatchEvent(new CustomEvent("cambio", { detail: { valor: op.dataset.valor }, bubbles: true }));
      });
    });
  });

  document.addEventListener("click", cerrarTodos);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrarTodos();
  });
}

/* =========================================================
   4. PLANTELES — filtros + tarjetas + modal central
   ========================================================= */
function initPlanteles() {
  const grid = document.getElementById("grid-jugadores");
  if (!grid || typeof CLUB_DATA === "undefined") return;

  const filtroRama = document.getElementById("filtro-rama");
  const filtroCategoria = document.getElementById("filtro-categoria");
  const contador = document.getElementById("contador-jugadores");

  function render() {
    const rama = filtroRama.dataset.valor || "todas";
    const categoria = filtroCategoria.dataset.valor || "todas";
    const lista = CLUB_DATA.jugadores.filter(
      (j) => (rama === "todas" || j.rama === rama) && (categoria === "todas" || j.categoria === categoria)
    );

    grid.innerHTML = lista
      .map(
        (j) => `
      <article class="player-card" data-reveal tabindex="0" data-id="${j.id}">
        <div class="player-card__media">
          <img class="player-card__img player-card__img--principal" src="${j.imgPrincipal}" alt="${j.nombre}">
          <img class="player-card__img player-card__img--secundaria" src="${j.imgSecundaria}" alt="">
          <span class="player-card__dorsal">#${j.dorsal}</span>
        </div>
        <div class="player-card__pie">
          <strong>${j.nombre}</strong>
          <span>${j.categoria} · ${j.rama}</span>
        </div>
      </article>`
      )
      .join("");

    if (contador) contador.textContent = `${lista.length} jugador${lista.length === 1 ? "" : "es"}`;
    initScrollReveal();

    grid.querySelectorAll(".player-card").forEach((card) => {
      card.addEventListener("click", () => abrirModalJugador(Number(card.dataset.id)));
      card.addEventListener("keypress", (e) => {
        if (e.key === "Enter") abrirModalJugador(Number(card.dataset.id));
      });
    });
  }

  filtroRama.addEventListener("cambio", render);
  filtroCategoria.addEventListener("cambio", render);
  render();

  const modal = document.getElementById("modal-jugador");
  const cerrar = modal.querySelector(".modal__cerrar");
  cerrar.addEventListener("click", () => cerrarModalJugador());
  modal.addEventListener("click", (e) => {
    if (e.target === modal) cerrarModalJugador();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrarModalJugador();
  });

  let intervaloFoto = null;

  function abrirModalJugador(id) {
    const j = CLUB_DATA.jugadores.find((p) => p.id === id);
    if (!j) return;
    const img = modal.querySelector(".modal-jugador__img");
    img.style.opacity = 1;
    img.src = j.imgPrincipal;
    modal.querySelector(".modal-jugador__dorsal").textContent = "#" + j.dorsal;
    modal.querySelector(".modal-jugador__nombre").textContent = j.nombre;
    modal.querySelector(".modal-jugador__categoria").textContent = `${j.categoria} · ${j.rama}`;
    modal.querySelector(".modal-jugador__descripcion").textContent = j.descripcion;

    const stats = modal.querySelector(".modal-jugador__stats");
    stats.innerHTML = `
      <div><strong>${j.dorsal}</strong><span>Dorsal</span></div>
      <div><strong>${j.altura}</strong><span>Altura</span></div>
      <div><strong>${j.edad}</strong><span>Edad</span></div>
      <div><strong>${j.posicion}</strong><span>Posición</span></div>`;

    modal.classList.add("modal--abierto");
    document.body.style.overflow = "hidden";

    let mostrandoPrincipal = true;
    clearInterval(intervaloFoto);
    intervaloFoto = setInterval(() => {
      mostrandoPrincipal = !mostrandoPrincipal;
      img.style.opacity = 0;
      setTimeout(() => {
        img.src = mostrandoPrincipal ? j.imgPrincipal : j.imgSecundaria;
        img.style.opacity = 1;
      }, 220);
    }, 3000);
  }

  function cerrarModalJugador() {
    cerrarModalSuave(modal, { conParticulas: true, alTerminar: () => clearInterval(intervaloFoto) });
  }
}

/* =========================================================
   5. STAFF TÉCNICO — misma mecánica que planteles
   ========================================================= */
function initStaff() {
  const gridPrincipal = document.getElementById("staff-principal");
  const grid = document.getElementById("grid-staff");
  if (!grid || typeof CLUB_DATA === "undefined") return;

  const principal = CLUB_DATA.staff.find((s) => s.principal);
  if (gridPrincipal && principal) {
    gridPrincipal.innerHTML = `
      <div class="staff-lead__foto">
        <img src="${principal.imgPrincipal}" alt="${principal.nombre}">
      </div>
      <div class="staff-lead__info">
        <span class="staff-lead__cargo">${principal.cargo}</span>
        <h3>${principal.nombre}</h3>
        <p>${principal.descripcion}</p>
      </div>`;
  }

  const resto = CLUB_DATA.staff.filter((s) => !s.principal);
  const filtroRama = document.getElementById("filtro-rama-staff");

  function render() {
    const rama = filtroRama ? filtroRama.dataset.valor || "todas" : "todas";
    const lista = resto.filter((s) => rama === "todas" || s.rama === rama);
    grid.innerHTML = lista
      .map(
        (s) => `
      <article class="player-card" data-reveal tabindex="0" data-id="${s.id}">
        <div class="player-card__media">
          <img class="player-card__img player-card__img--principal" src="${s.imgPrincipal}" alt="${s.nombre}">
          <img class="player-card__img player-card__img--secundaria" src="${s.imgSecundaria}" alt="">
        </div>
        <div class="player-card__pie">
          <strong>${s.nombre}</strong>
          <span>${s.cargo}</span>
        </div>
      </article>`
      )
      .join("");
    initScrollReveal();

    grid.querySelectorAll(".player-card").forEach((card) => {
      card.addEventListener("click", () => abrirModalStaff(Number(card.dataset.id)));
    });
  }

  if (filtroRama) filtroRama.addEventListener("cambio", render);
  render();

  const modal = document.getElementById("modal-jugador");
  function abrirModalStaff(id) {
    const s = resto.find((p) => p.id === id);
    if (!s || !modal) return;
    modal.querySelector(".modal-jugador__img").src = s.imgPrincipal;
    modal.querySelector(".modal-jugador__img").style.opacity = 1;
    modal.querySelector(".modal-jugador__dorsal").textContent = s.cargo;
    modal.querySelector(".modal-jugador__nombre").textContent = s.nombre;
    modal.querySelector(".modal-jugador__categoria").textContent = `${s.categoria} · ${s.rama}`;
    modal.querySelector(".modal-jugador__descripcion").textContent = s.descripcion;
    modal.querySelector(".modal-jugador__stats").innerHTML = "";
    modal.classList.add("modal--abierto");
    document.body.style.overflow = "hidden";
  }

  // El botón de cerrar y el fondo del modal ya quedan atados en initPlanteles
  // cuando ambas páginas comparten el mismo #modal-jugador; en staff.html
  // initPlanteles no corre (no hay #grid-jugadores), así que atamos acá también.
  if (!document.getElementById("grid-jugadores")) {
    const cerrar = modal.querySelector(".modal__cerrar");
    cerrar.addEventListener("click", () => cerrarModalSuave(modal, { conParticulas: true }));
    modal.addEventListener("click", (e) => {
      if (e.target === modal) cerrarModalSuave(modal, { conParticulas: true });
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") cerrarModalSuave(modal, { conParticulas: true });
    });
  }
}

/* =========================================================
   6. INDUMENTARIA — misma mecánica que jugadores/staff:
   hover con crossfade a foto secundaria, click agranda la
   tarjeta con imagen a un lado (rotando cada 3s) y datos +
   botón de WhatsApp al otro lado.
   ========================================================= */
function initMerch() {
  const grid = document.getElementById("grid-merch");
  const modal = document.getElementById("modal-prenda");
  if (!grid || !modal || typeof CLUB_DATA === "undefined") return;

  grid.innerHTML = CLUB_DATA.merch
    .map(
      (m) => `
    <article class="player-card" data-reveal tabindex="0" data-id="${m.id}">
      <div class="player-card__media">
        <img class="player-card__img player-card__img--principal" src="${m.imgPrincipal}" alt="${m.nombre}">
        <img class="player-card__img player-card__img--secundaria" src="${m.imgSecundaria}" alt="">
        <span class="player-card__dorsal player-card__dorsal--tipo">${m.tipo}</span>
      </div>
      <div class="player-card__pie">
        <strong>${m.nombre}</strong>
        <span>${m.tipo}</span>
      </div>
    </article>`
    )
    .join("");

  initScrollReveal();

  grid.querySelectorAll(".player-card").forEach((card) => {
    card.addEventListener("click", () => abrirModalPrenda(Number(card.dataset.id)));
    card.addEventListener("keypress", (e) => {
      if (e.key === "Enter") abrirModalPrenda(Number(card.dataset.id));
    });
  });

  let intervaloFoto = null;

  function abrirModalPrenda(id) {
    const m = CLUB_DATA.merch.find((p) => p.id === id);
    if (!m) return;
    const img = modal.querySelector(".modal-jugador__img");
    img.style.opacity = 1;
    img.src = m.imgPrincipal;
    modal.querySelector(".modal-jugador__dorsal").textContent = m.tipo;
    modal.querySelector(".modal-jugador__nombre").textContent = m.nombre;
    modal.querySelector(".modal-jugador__categoria").textContent = m.material;
    modal.querySelector(".modal-jugador__descripcion").textContent =
      m.tipo === "Juego" ? "Prenda oficial de partido." : "Prenda oficial de entrenamiento.";

    const stats = modal.querySelector(".modal-jugador__stats");
    const mensaje = encodeURIComponent("Hola! Quiero consultar disponibilidad o encargar: " + m.nombre);
    stats.innerHTML = `
      <a class="btn btn-whatsapp" style="grid-column:1/-1;" target="_blank" rel="noopener"
         href="https://wa.me/${CLUB_DATA.contacto.whatsapp}?text=${mensaje}">Consultar / Encargar por WhatsApp</a>`;

    modal.classList.add("modal--abierto");
    document.body.style.overflow = "hidden";

    let mostrandoPrincipal = true;
    clearInterval(intervaloFoto);
    intervaloFoto = setInterval(() => {
      mostrandoPrincipal = !mostrandoPrincipal;
      img.style.opacity = 0;
      setTimeout(() => {
        img.src = mostrandoPrincipal ? m.imgPrincipal : m.imgSecundaria;
        img.style.opacity = 1;
      }, 220);
    }, 3000);
  }

  const cerrar = modal.querySelector(".modal__cerrar");
  cerrar.addEventListener("click", () =>
    cerrarModalSuave(modal, { conParticulas: true, alTerminar: () => clearInterval(intervaloFoto) })
  );
  modal.addEventListener("click", (e) => {
    if (e.target === modal)
      cerrarModalSuave(modal, { conParticulas: true, alTerminar: () => clearInterval(intervaloFoto) });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape")
      cerrarModalSuave(modal, { conParticulas: true, alTerminar: () => clearInterval(intervaloFoto) });
  });
}

/* =========================================================
   7. GALERÍA POR TEMPORADA — tabs + lightbox + descarga +
   navegación con flechas del teclado.
   ========================================================= */
function initGaleria() {
  const tabs = document.getElementById("galeria-tabs");
  const grid = document.getElementById("galeria-grid");
  if (!tabs || !grid || typeof CLUB_DATA === "undefined") return;

  const temporadas = Object.keys(CLUB_DATA.galeria).sort().reverse();
  tabs.innerHTML = temporadas
    .map((t, i) => `<button class="tab${i === 0 ? " tab--activa" : ""}" data-temporada="${t}">${t}</button>`)
    .join("");

  function renderGrid(temporada) {
    const fotos = CLUB_DATA.galeria[temporada];
    grid.innerHTML = fotos
      .map(
        (src, i) => `<figure class="galeria-item" data-reveal data-src="${src}" data-i="${i}" tabindex="0">
          <img src="${src}" alt="Foto ${i + 1} — temporada ${temporada}" loading="lazy">
        </figure>`
      )
      .join("");
    initScrollReveal();
    grid.querySelectorAll(".galeria-item").forEach((fig) => {
      fig.addEventListener("click", () => abrirLightbox(temporada, Number(fig.dataset.i)));
    });
  }

  tabs.addEventListener("click", (e) => {
    const btn = e.target.closest(".tab");
    if (!btn) return;
    tabs.querySelectorAll(".tab").forEach((b) => b.classList.remove("tab--activa"));
    btn.classList.add("tab--activa");
    renderGrid(btn.dataset.temporada);
  });

  renderGrid(temporadas[0]);

  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;
  const lbImg = lightbox.querySelector("img");
  const lbDesc = lightbox.querySelector(".lightbox__descarga");
  let temporadaActual, indiceActual;

  function abrirLightbox(temporada, i) {
    temporadaActual = temporada;
    indiceActual = i;
    mostrar();
    lightbox.classList.add("lightbox--abierto");
    document.body.style.overflow = "hidden";
  }
  function mostrar() {
    const src = CLUB_DATA.galeria[temporadaActual][indiceActual];
    lbImg.src = src;
    lbDesc.href = src;
    lbDesc.setAttribute("download", `cai-voley-${temporadaActual}-${indiceActual + 1}.jpg`);
  }
  function siguiente() {
    indiceActual = (indiceActual + 1) % CLUB_DATA.galeria[temporadaActual].length;
    mostrar();
  }
  function anterior() {
    const total = CLUB_DATA.galeria[temporadaActual].length;
    indiceActual = (indiceActual - 1 + total) % total;
    mostrar();
  }

  lightbox.querySelector(".lightbox__cerrar").addEventListener("click", () => cerrarLightboxSuave(lightbox));
  lightbox.querySelector(".lightbox__siguiente").addEventListener("click", siguiente);
  lightbox.querySelector(".lightbox__anterior").addEventListener("click", anterior);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) cerrarLightboxSuave(lightbox);
  });

  // Flechas del teclado: izquierda = anterior, derecha = siguiente, Escape = cerrar.
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("lightbox--abierto")) return;
    if (e.key === "ArrowRight") siguiente();
    if (e.key === "ArrowLeft") anterior();
    if (e.key === "Escape") cerrarLightboxSuave(lightbox);
  });
}

/* =========================================================
   8. INSCRIPCIÓN — modal + formulario -> WhatsApp
   ========================================================= */
function initInscripcion() {
  const abrirBtns = document.querySelectorAll("[data-abrir-inscripcion]");
  const modal = document.getElementById("modal-inscripcion");
  if (!abrirBtns.length || !modal) return;

  const cerrar = modal.querySelector(".modal__cerrar");
  const form = modal.querySelector("#form-inscripcion");
  const aviso = modal.querySelector(".inscripcion__aviso");

  abrirBtns.forEach((b) =>
    b.addEventListener("click", () => {
      modal.classList.add("modal--abierto");
      document.body.style.overflow = "hidden";
      aviso.hidden = true;
      form.hidden = false;
    })
  );
  cerrar.addEventListener("click", () => cerrarModalSuave(modal));
  modal.addEventListener("click", (e) => {
    if (e.target === modal) cerrarModalSuave(modal);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrarModalSuave(modal);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const datos = new FormData(form);
    const nombre = datos.get("nombre");
    const edad = datos.get("edad");
    const celular = datos.get("celular");
    const ramaEl = form.querySelector("#i-rama");
    const categoriaEl = form.querySelector("#i-categoria");
    const rama = ramaEl ? ramaEl.dataset.valor : "";
    const categoria = categoriaEl ? categoriaEl.dataset.valor : "";

    const mensaje =
      `Hola! Quiero inscribir a ${nombre} (${edad} años) en la Escuela de Vóley.\n` +
      `Rama: ${rama}\nCategoría: ${categoria}\nCelular de contacto: ${celular}`;

    const numero = typeof CLUB_DATA !== "undefined" ? CLUB_DATA.contacto.whatsapp : "5493885961022";
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, "_blank", "noopener");

    form.hidden = true;
    aviso.hidden = false;
    form.reset();
  });
}

/* =========================================================
   9. INSTITUCIONAL — crossfade de 2 fotos con "cortina"
   triangular (clip-path zigzag animado en vez de un fundido
   plano).
   ========================================================= */
function initInstitucionalHero() {
  const media = document.querySelector(".institucional-hero__media");
  if (!media) return;
  window.setInterval(() => {
    media.classList.toggle("mostrar-b");
  }, 3200);
}

/* =========================================================
   10. NOTICIAS — las tarjetas de "Inicio" ahora se agrandan
   al centro igual que jugadores/staff, con una X chica arriba
   a la derecha para cerrar.
   ========================================================= */
function initNoticias() {
  const modal = document.getElementById("modal-noticia");
  const cards = document.querySelectorAll(".noticia-card");
  if (!modal || !cards.length) return;

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      modal.querySelector(".modal-noticia__img").src = card.querySelector("img").src;
      modal.querySelector(".modal-noticia__fecha").textContent = card.querySelector(".noticia-card__fecha").textContent;
      modal.querySelector(".modal-noticia__titulo").textContent = card.querySelector("h4").textContent;
      modal.querySelector(".modal-noticia__texto").textContent = card.querySelector("p").textContent;
      modal.classList.add("modal--abierto");
      document.body.style.overflow = "hidden";
    });
    card.addEventListener("keypress", (e) => {
      if (e.key === "Enter") card.click();
    });
  });

  const cerrar = modal.querySelector(".modal__cerrar");
  cerrar.addEventListener("click", () => cerrarModalSuave(modal));
  modal.addEventListener("click", (e) => {
    if (e.target === modal) cerrarModalSuave(modal);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrarModalSuave(modal);
  });
}

/* =========================================================
   11. TRANSICIONES ENTRE PÁGINAS
   Sitio multi-página (no es una SPA), así que la "animación de
   salida" se simula: al tocar un link interno se frena la
   navegación un instante, se desvanece el navbar/franja/main,
   y recién ahí se cambia de página. La entrada usa las
   animaciones CSS normales que corren al cargar cada página.
   ========================================================= */
function initTransicionesNav() {
  const enlaces = document.querySelectorAll('a[href$=".html"]');
  enlaces.forEach((a) => {
    if (a.target === "_blank") return;
    a.addEventListener("click", (e) => {
      const destino = a.getAttribute("href");
      if (!destino || destino.startsWith("http")) return;
      e.preventDefault();
      if (document.body.classList.contains("pagina-saliendo")) return;
      document.body.classList.add("pagina-saliendo");
      window.setTimeout(() => {
        window.location.href = destino;
      }, 300);
    });
  });
}
