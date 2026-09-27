const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const createForm = document.getElementById('createForm');
const selectedName = document.getElementById('selectedName');
const selectedTemplate = document.getElementById('selectedTemplate');
const successState = document.getElementById('successState');
const modalTitle = document.getElementById('modal-title');

function openModal(templateName) {
  selectedName.textContent = templateName;
  selectedTemplate.textContent = templateName;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  window.setTimeout(() => document.getElementById('userName').focus(), 250);
}

function hideModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  window.setTimeout(() => {
    createForm.reset();
    createForm.style.display = '';
    successState.classList.remove('visible');
    modal.classList.remove('success');
  }, 250);
}

document.querySelectorAll('.select-template').forEach((button) => {
  button.addEventListener('click', (event) => {
    const card = event.currentTarget.closest('.template-card');
    openModal(card.dataset.template);
  });
});

document.querySelectorAll('a[href="#templates"]').forEach((link) => {
  link.addEventListener('click', () => {
    window.setTimeout(() => document.querySelector('#templates .select-template')?.focus(), 500);
  });
});

closeModal.addEventListener('click', hideModal);
modal.addEventListener('click', (event) => {
  if (event.target === modal) hideModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.classList.contains('open')) hideModal();
});

createForm.addEventListener('submit', (event) => {
  event.preventDefault();
  createForm.style.display = 'none';
  modal.classList.add('success');
  modalTitle.setAttribute('aria-hidden', 'true');
  successState.classList.add('visible');
});
