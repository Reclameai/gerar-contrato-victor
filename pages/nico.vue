<template>
    <div class="page-container">
      <Toast />
      <h2 class="form-title">Criar novo atendimento no NicoChat</h2>
      <p class="form-subtitle">Insira os detalhes para prosseguir</p>
  
      <form @submit.prevent="submitForm(toast)" class="form">
        <div class="form-group">
          <div class="form-field">
            <label for="phone" class="form-label">Número de Telefone</label>
            <InputText id="phone" placeholder="Número de Telefone" v-model="form.phone" v-mask="'(##) #####-####'" required class="form-input" />
          </div>
        </div>
        <div class="form-group">
          <div class="form-field">
            <label for="clientName" class="form-label">Nome do Cliente</label>
            <InputText id="clientName" placeholder="Nome do Cliente" v-model="form.clientName" required class="form-input" maxlength="100" @keypress="onlyLetters"/>
          </div>
        </div>
        <div class="form-group">
          <div class="form-field">
            <label for="channel" class="form-label">Canal de Atendimento</label>
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
  import { 
    form, 
    animateButton, 
    resetAnimation, 
    isClient
  } from '~/auth/assinatura';
  import {
    channelOptions,
    fetchOptions
  } from '~/auth/form';
  import InputText from 'primevue/inputtext';
  import Button from 'primevue/button';
  import { useToast } from 'primevue/usetoast';
  import Toast from 'primevue/toast';
  import { ref, onMounted } from 'vue';
  import Cookies from 'js-cookie';
  import { verifyLogin } from '~/auth/login';
  import { useRouter } from 'vue-router';
  import { onlyLetters } from '../utils/helpers';
  
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
        Cookies.remove('type');
        router.push('/');
      }
    } else {
      router.push('/');
    }
    await fetchOptions();
  });

const submitForm = async (toast) => {
  const { $environment } = useNuxtApp();
  if (!form.value.phone || !form.value.clientName || !form.value.channel) {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Preencha todos os campos obrigatórios', life: 3000 });
    return;
  }
  isSubmitting.value = true;
  try {
    const finalFormData = {
      phone: form.value.phone,
      clientName: form.value.clientName,
      channel: form.value.channel,
      id: Cookies.get('id')
    };

    const response = await fetch($environment.webhookCriarNovoAtendNicoNG, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(finalFormData)
    });
    
    const result = await response.json();
    if (result.erro) {
      toast.add({ severity: 'error', summary: 'Erro', detail: result.erro, life: 3000 });
      return;
    }
    if (result.link_nico) {
      window.open(result.link_nico, '_blank');
      window.location.reload();
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
