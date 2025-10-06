document.addEventListener('DOMContentLoaded', () => {
  // atualiza ano
  document.getElementById('year').textContent = new Date().getFullYear();

  const nav = document.querySelector('nav');
  const contactModal = document.getElementById('contactModal');
  const contactBtn = document.getElementById('contactBtn');
  const closeModal = document.getElementById('closeModal');
  const closeModal2 = document.getElementById('closeModal2');
  const openContactFooter = document.getElementById('openContactFooter');
  const modalTitle = document.getElementById('modalTitle');
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  // ===== navbar muda ao rolar =====
  const handleScroll = () => {
    if (window.scrollY > 120) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // ===== modal =====
  function openModal(preselect = '') {
    contactModal.setAttribute('aria-hidden', 'false');
    if (preselect) {
      modalTitle.textContent = `Contato — ${preselect}`;
      document.getElementById('message').value = `Olá, quero contratar: ${preselect}.\nTenho interesse e gostaria de mais informações.`;
    } else {
      modalTitle.textContent = 'Entrar em contato';
      document.getElementById('message').value = '';
    }
    formFeedback.textContent = '';
  }

  function closeModalFn() {
    contactModal.setAttribute('aria-hidden', 'true');
  }

  contactBtn.addEventListener('click', () => openModal(''));
  closeModal.addEventListener('click', closeModalFn);
  closeModal2.addEventListener('click', closeModalFn);
  openContactFooter.addEventListener('click', (e) => {
    e.preventDefault();
    openModal('');
  });

  // ===== seleção de plano =====
  document.querySelectorAll('.select-plan').forEach(btn => {
    btn.addEventListener('click', () => {
      const plan = btn.dataset.plan || '';
      openModal(plan);
      setTimeout(() => document.getElementById('name').focus(), 300);
    });
  });

  // ===== envio via WhatsApp =====
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formFeedback.textContent = 'Preparando mensagem...';

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      formFeedback.style.color = 'crimson';
      formFeedback.textContent = 'Por favor, preencha todos os campos.';
      return;
    }

    const phone = '55YOURNUMBER'; // Substituir pelo número real
    const text = `Olá, meu nome é ${name}%0AEmail: ${encodeURIComponent(email)}%0A%0A${encodeURIComponent(message)}`;
    const waUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${text}`;

    formFeedback.style.color = '#0b0b0b';
    formFeedback.textContent = 'Abrindo WhatsApp...';
    window.open(waUrl, '_blank');

    setTimeout(() => {
      formFeedback.style.color = 'green';
      formFeedback.textContent = 'Mensagem aberta no WhatsApp. Se preferir, copie e cole a mensagem.';
    }, 800);
  });
});

// ===== função global =====
function openWhatsApp(planText) {
  const phone = '55YOURNUMBER';
  const text = encodeURIComponent(`Olá, tenho interesse em: ${planText}`);
  const url = `https://api.whatsapp.com/send?phone=${phone}&text=${text}`;
  window.open(url, '_blank');
}
