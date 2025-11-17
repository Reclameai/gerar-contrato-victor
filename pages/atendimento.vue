<template>
  <div class="page-container">
    <Toast />
    <h2 class="form-title">Começar novo atendimento no mesmo número</h2>
    <p class="form-subtitle">Insira os detalhes para prosseguir</p>

    <form @submit.prevent="submitForm(toast)" class="form">
      <div class="form-group">
        <div class="form-field">
          <label for="newClientName" class="form-label">Nome do novo cliente</label>
          <InputText id="newClientName" placeholder="Nome do novo cliente" v-model="form.newClientName" required class="form-input" maxlength="100" @keypress="onlyLetters" />
        </div>
      </div>
      <div class="form-group">
        <div class="form-field">
          <label for="newClientCpf" class="form-label">CPF do novo cliente</label>
          <InputText id="newClientCpf" placeholder="CPF do novo cliente" v-model="form.newClientCpf" required class="form-input" v-if="isClient" v-mask="'###.###.###-##'" @change="verifyNewClientCPF(toast, 'newClientCpf')"/>
          <InputText id="newClientCpf" placeholder="CPF do novo cliente" v-model="form.newClientCpf" required class="form-input" v-else @change="verifyNewClientCPF(toast, 'newClientCpf')"/>
        </div>
      </div>
      <div class="form-group">
        <div class="form-field">
          <label for="wppNumber" class="form-label">Número do wpp que está sendo tratado</label>
          <InputText id="wppNumber" placeholder="Número do wpp" v-model="form.wppNumber" required class="form-input" v-if="isClient" v-mask="'(##) #####-####'" @change="verifyNewClientPhoneNumber(toast, 'wppNumber')"/>
          <InputText id="wppNumber" placeholder="Número do wpp" v-model="form.wppNumber" required class="form-input" v-else @change="verifyNewClientPhoneNumber(toast, 'wppNumber')"/>
        </div>
      </div>
      <div class="form-group">
        <div class="form-field">
          <label for="channel" class="form-label">Canal de atendimento que está sendo tratado</label>
          <select id="channel" v-model="form.channel" required class="form-input">
            <option v-for="option in channelOptions" :key="option.id" :value="option.id">{{ option.name }}</option>
          </select>
        </div>
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
import { ref, onMounted } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import Cookies from 'js-cookie';
import { verifyLogin } from '~/auth/login';
import { useRouter } from 'vue-router';
import { onlyLetters } from '../utils/helpers';
import { validateCPF, validatePhoneNumber } from '../utils/helpers';

const toast = useToast();
const isSubmitting = ref(false);
const router = useRouter();
const form = ref({
  newClientName: '',
  newClientCpf: '',
  wppNumber: '',
  channel: ''
});
const channelOptions = ref([]);
const isClient = ref(false);

async function fetchChannelOptions() {
  const { $environment } = useNuxtApp();
  try {
    const response = await fetch($environment.webhookConsultaDbFormularioDBNG, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    const data = await response.json();
    channelOptions.value = data[0].CIAS.map(item => ({ id: item.ID_CIA, name: item.CIA }));
  } catch (error) {
    console.error('Error fetching channel options:', error);
  }
}

function verifyNewClientCPF(toast, cpfType = 'newClientCpf') {
  const cpfValue = cpfType === 'newClientCpf' ? form.value.newClientCpf : ''
  if (!validateCPF(cpfValue)) {
    toast.add({ 
      severity: 'contrast',
      summary: 'Aviso',
      detail: 'CPF inválido. Por favor, insira um CPF válido.',
      life: 4000
    });
    form.value.newClientCpf = '';
  }
}

function verifyNewClientPhoneNumber(toast, phoneType = 'wppNumber') {
  const phoneValue = phoneType === 'wppNumber' ? form.value.wppNumber : ''
  if (!validatePhoneNumber(phoneValue)) {
    toast.add({
      severity: 'contrast',
      summary: 'Aviso',
      detail: 'Número de telefone inválido. Por favor, insira um número de telefone válido no formato (11) 11111-1111.',
      life: 4000
    });
    form.value.wppNumber = '';
  }
}

onMounted(async () => {
  isClient.value = true;
  const email = Cookies.get('email');
  const password = Cookies.get('password');
  if (email && password) {
    try {
      await verifyLogin({ email, password });
      await fetchChannelOptions();
    } catch {
      Cookies.remove('email');
      Cookies.remove('password');
      Cookies.remove('type');
      router.push('/');
    }
  } else {
    router.push('/');
  }
});

const submitForm = async (toast) => {
  const { $environment } = useNuxtApp();
  if (!form.value.newClientName || !form.value.newClientCpf || !form.value.wppNumber || !form.value.channel) {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Preencha todos os campos obrigatórios', life: 3000 });
    return;
  }
  isSubmitting.value = true;
  try {
    const finalFormData = {
      newClientName: form.value.newClientName,
      newClientCpf: form.value.newClientCpf,
      wppNumber: form.value.wppNumber,
      channel: form.value.channel,
      id: Cookies.get('id')
    };

    const response = await fetch($environment.webhookComecarAtendMesmoNumeroNG, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(finalFormData)
    });

    const result = await response.json();
    if (result.link_nico) {
      window.open(result.link_nico, '_blank');
      window.location.reload();
    } else {
      throw new Error('Link não encontrado na resposta');
    }
  } catch (error) {
    console.log(error)
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao enviar o formulário', life: 3000 });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
  @import url('~/assets/css/form.css');
</style>
