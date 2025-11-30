/* ==========================================================
   SCRIPT COMPLETO — REFATORADO E OTIMIZADO
   - Nav dinâmica (com troca de logo protegida)
   - Modal de contato
   - WhatsApp
   - Comparador Antes/Depois (vertical)
========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const qs = (s) => document.querySelector(s);
  const qsa = (s) => [...document.querySelectorAll(s)];

  /* ==========================================================
     NAV / LOGO DINÂMICA
  =========================================================== */
  const nav = qs("nav");
  const logo = qs("nav .logo");

  const LOGO_LIGHT = "images/LOGOPRETA.png";
  const LOGO_DARK = "images/LOGO.png";

  function updateNavbar() {
    if (!nav) return;

    const scrolled = window.scrollY > 120;
    nav.classList.toggle("scrolled", scrolled);

    if (logo) {
      logo.src = scrolled ? LOGO_DARK : LOGO_LIGHT;
    }
  }

  updateNavbar();
  window.addEventListener("scroll", updateNavbar, { passive: true });


  /* ==========================================================
     MODAL DE CONTATO
  =========================================================== */
  const contactModal = qs("#contactModal");
  const openButtons = [qs("#contactBtn"), qs("#openContactFooter")];
  const closeButtons = qsa("#closeModal, #closeModal2");
  const modalTitle = qs("#modalTitle");
  const contactForm = qs("#contactForm");
  const feedback = qs("#formFeedback");

  function openModal(plan = "") {
    if (!contactModal) return;

    contactModal.setAttribute("aria-hidden", "false");

    modalTitle.textContent = plan ?
      `Contato — ${plan}` :
      "Entrar em contato";

    const msg = qs("#message");
    msg.value = plan
      ? `Olá! Quero contratar: ${plan}.\nPoderia me enviar mais informações?`
      : "";

    setTimeout(() => qs("#name")?.focus(), 150);
  }

  function closeModal() {
    contactModal?.setAttribute("aria-hidden", "true");
  }

  openButtons.forEach(btn => {
    if (!btn) return;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener("click", closeModal);
  });

  qsa(".select-plan").forEach(btn => {
    btn.addEventListener("click", () => {
      openModal(btn.dataset.plan || "");
    });
  });


  /* ==========================================================
     FORM / WHATSAPP
  =========================================================== */
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = qs("#name")?.value.trim();
      const email = qs("#email")?.value.trim();
      const message = qs("#message")?.value.trim();

      if (!name || !email || !message) {
        feedback.style.color = "crimson";
        feedback.textContent = "Preencha todos os campos.";
        return;
      }

      const phone = "55YOURNUMBER";
      const text = `Olá, meu nome é ${name}\nEmail: ${email}\n\n${message}`;
      const waUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`;

      feedback.style.color = "#111";
      feedback.textContent = "Abrindo WhatsApp...";

      window.open(waUrl, "_blank");

      setTimeout(() => {
        feedback.style.color = "green";
        feedback.textContent = "Mensagem enviada! Caso não abra, copie/cole no WhatsApp.";
      }, 700);
    });
  }

  window.openWhatsApp = (plan) => {
    const phone = "55YOURNUMBER";
    const text = `Olá! Tenho interesse no plano ${plan}`;
    window.open(
      `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };


  /* ==========================================================
  COMPARADOR ANTES / DEPOIS — ZERO DELAY
========================================================== */
  const comparator = document.querySelector(".image-comparator");
  const imgBefore = document.querySelector(".img-before");
  const imgAfter = document.querySelector(".img-after");
  const handle = document.querySelector(".slider-handle");

  if (comparator && imgBefore && imgAfter && handle) {

    let dragging = false;

    // posição inicial
    let percent = 50;
    update(percent);

    function update(p) {
      p = Math.max(0, Math.min(100, p)); // clamp

      // ANTES = altura de cima
      imgBefore.style.height = `${p}%`;

      // DEPOIS = altura de baixo
      imgAfter.style.height = `${100 - p}%`;

      // Linha
      handle.style.top = `${p}%`;
    }

    function move(e) {
      const rect = comparator.getBoundingClientRect();
      const y = (e.clientY ?? e.touches?.[0].clientY) - rect.top;
      percent = (y / rect.height) * 100;
      update(percent);
    }

    handle.addEventListener("mousedown", () => dragging = true);
    window.addEventListener("mouseup", () => dragging = false);
    window.addEventListener("mousemove", (e) => dragging && move(e));

    handle.addEventListener("touchstart", () => dragging = true);
    window.addEventListener("touchend", () => dragging = false);
    window.addEventListener("touchmove", (e) => dragging && move(e));

    comparator.addEventListener("click", (e) => move(e));
  }

});
