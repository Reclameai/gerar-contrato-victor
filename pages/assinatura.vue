<template> 
  <div class="page-container">
    <Toast />
    <h2 class="form-title">Enviar contrato assinado</h2>
    <p class="form-subtitle">Insira os detalhes para prosseguir</p>

    <form @submit.prevent="submitForm(toast)" class="form">
      <div class="form-group">
        <div class="form-field">
          <label for="idAction" class="form-label">ID Action</label>
          <InputText
            id="idAction"
            placeholder="Somente números"
            v-model="form.idAction"
            required
            class="form-input"
            :maxlength="10"
            @keypress="onlyNumbers"
            @change="verifyIdAction(toast);"
          />
        </div>
      </div>

      <div class="form-field">
        <label for="Enviar Documento?" class="form-label">Enviar Documento?</label>
          <select id="documentType" v-model="form.documentOption" required class="form-input">
            <option value="sim">Sim</option>
            <option value="não">Não</option>
          </select>
      </div>

      <div v-if="form.documentOption === 'sim'" class="form-field">
        <label for="docs" class="form-label">Docs</label>
        <input type="file" id="docs" multiple @change="handleFileUpload($event, toast)" class="form-input" />
      </div>

      <div class="uploaded-files" v-if="uploadedFiles.length">
        <h4>Uploaded Files:</h4>
        <ul>
          <li v-for="(file, index) in uploadedFiles" :key="file.name">
            {{ file.name }}
            <button type="button" @click="removeFile(index)" class="remove-file-button">Remover</button>
          </li>
        </ul>
      </div>

      <Button 
        type="submit" 
        label="Enviar" 
        icon="pi pi-check" 
        class="form-button submit-button" 
        :disabled="isSubmitting" 
        @mouseenter="animateButton" 
        @mouseleave="resetAnimation" 
      />
    </form>
  </div>
</template>

<script setup>
import { 
  form, 
  animateButton, 
  resetAnimation, 
  handleFileUpload, 
  removeFile, 
  uploadedFiles, 
  verifyIdAction,
  isClient
} from '~/auth/assinatura';

import { onlyNumbers } from '../utils/helpers';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import { ref, onMounted } from 'vue';
import Cookies from 'js-cookie';
import { verifyLogin } from '~/auth/login';
import { useRouter } from 'vue-router';

const toast = useToast();
const isSubmitting = ref(false);
const router = useRouter();

onMounted(async () => {
  isClient.value = true;
  const email = Cookies.get('email');
  const password = Cookies.get('password');
  if (email && password) {
    try {
      await verifyLogin({ email, password });
    } catch {
      Cookies.remove('email');
      Cookies.remove('password');
      router.push('/');
    }
  } else {
    router.push('/');
  }
});

const submitForm = async (toast) => {
  const { $environment } = useNuxtApp();
  if (!form.value.idAction) {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'O campo ID Action é obrigatório', life: 3000 });
    return;
  }

  if (form.value.documentOption === 'sim' && uploadedFiles.value.length === 0) {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'É obrigatório anexar o documento', life: 3000 });
    return;
  }

  isSubmitting.value = true;
  try {
    const formData = new FormData();
    uploadedFiles.value.forEach(file => {
      formData.append('docs', file);
    });

    const response = await fetch($environment.apiUrlEnviarForm, {
      method: 'POST',
      body: formData
    });

    const fileLinks = await response.json();

    const finalFormData = {
      idAction: form.value.idAction,
      fileLinks
    };

    await fetch($environment.webhookContratoAssinadoPresencialNG, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(finalFormData)
    });

    toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Formulário enviado com sucesso', life: 3000 });
    window.location.reload();
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao enviar o formulário', life: 3000 });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
  @import url('~/assets/css/form.css');
</style>
