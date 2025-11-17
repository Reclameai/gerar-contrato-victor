<template>
  <div class="selection-container">
    <h2 class="selection-title">Selecione o Formulário</h2>
    <p class="selection-description">Escolha um dos formulários abaixo para prosseguir:</p>
    <div class="form-options">
      <button @click="navigateToForm('form')" class="form-option-button">Gerar Contrato</button>
      <button @click="navigateToForm('assinatura')" class="form-option-button">Enviar contrato assinado</button>
      <button @click="navigateToForm('nico')" class="form-option-button">Criar novo atendimento no nicochat</button>
       <button @click="navigateToForm('atendimento')" class="form-option-button">Começar novo atendimento no mesmo número</button>
    </div>
  </div>
</template>

<script setup>
  import { onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import Cookies from 'js-cookie';
  import { verifyLogin } from '~/auth/login';
  
  const router = useRouter();
  
  function navigateToForm(form) {
    router.push(`/${form}`);
  }
  
  onMounted(async () => {
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
</script>

<style scoped>
  @import url("~/assets/css/form.css");
  
  .selection-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    background-color: #f5f5f5;
    min-height: 100vh;
  }
  
  .selection-title {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #333;
  }
  
  .selection-description {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    color: #666;
    text-align: center;
  }
  
  .form-options {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    justify-content: center;
    width: 100%;
    max-width: 800px;
  }
  
  .form-card {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
    width: 100%;
    max-width: 350px;
    text-align: center;
    overflow: hidden;
    position: relative;
  }
  
  .form-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
  
  .form-card-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  
  .form-card-content {
    padding: 1.5rem;
  }
  
  .form-card-title {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: #4a90e2;
  }
  
  .form-card-description {
    font-size: 1rem;
    color: #666;
  }
</style>
