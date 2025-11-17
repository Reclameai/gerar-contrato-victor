<template>
    <div>
      <ProgressBar v-if="isLoading" mode="indeterminate" style="height: 2px; z-index: 2;"></ProgressBar>
      <div class="login-container">
        <Toast />
        <div class="logo-container">
          <img src="/assets/img/ng-logo.png" alt="logo" class="logo" />
          <span class="logo-text">Nicolas Gomes</span>
        </div>
        
        <div class="welcome">
          <h1>Faça Login<br>para começar</br></h1>
          <p class="subtitle">Software criado para uso profissional</p>
        </div>
  
        <form class="login-form" @submit.prevent="handleLogin">
          <label for="email"><strong>E-mail</strong></label>
          <input id="email" type="email" v-model="email" placeholder="Nome@exemplo.com" required> 
  
          <label for="password"><strong>Senha</strong></label>
          <input id="password" type="password" v-model="password" placeholder="Digite sua senha" required />
  
          <button type="submit">Entrar</button>
          <p class="signup-text">Não possui uma conta?<span> Solicite aos administradores.</span></p>
        </form>
      </div>
    </div>
  </template>

<script setup>
    import { useLogin } from '~/auth/login'; 
    import { useToast } from 'primevue/usetoast';
    import { onMounted } from 'vue';
    import Cookies from 'js-cookie';
    import { useRouter } from 'vue-router';

    const toast = useToast(); 
    const { email, password, handleLogin, isLoading } = useLogin(toast);
    const router = useRouter();

    onMounted(() => {
      const email = Cookies.get('email');
      const password = Cookies.get('password');
      if (email && password) {
        handleLogin().then(() => {
          router.push('/selection');
        }).catch(() => {
          Cookies.remove('email');
          Cookies.remove('password');
        });
      }
    });
</script>
  
<style>
    @import url("~/assets/css/index.css");
</style>