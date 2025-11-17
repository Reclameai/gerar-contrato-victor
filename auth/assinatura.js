import { ref } from 'vue';

export const form = ref({
  idAction: ''
});

export const isClient = ref(false);

export function animateButton(event) {
  event.target.classList.add('p-button-raised');
}

export function resetAnimation(event) {
  event.target.classList.remove('p-button-raised');
}

export const uploadedFiles = ref([]);

export function handleFileUpload(event, toast) {
  const files = event.target.files;
  for (let i = 0; i < files.length; i++) {
    if (files[i].size > 20 * 1024 * 1024) {
      if (toast) {
        toast.add({
          severity: 'error',
          summary: 'Erro',
          detail: `O arquivo "${files[i].name}" excede o limite de 20MB.`,
          life: 4000
        });
      }
      continue; // Não adiciona o arquivo
    }
    uploadedFiles.value.push(files[i]);
  }
}

export function removeFile(index) {
  uploadedFiles.value.splice(index, 1);
}

export function verifyIdAction(toast) {
  const numericOnly = /^\d+$/;
  if (!numericOnly.test(form.value.idAction)) {
    toast.add({
      severity: 'warn',
      summary: 'Aviso',
      detail: 'ID Action deve conter apenas números.',
      life: 4000
    });
    form.value.idAction = '';
  }
}
