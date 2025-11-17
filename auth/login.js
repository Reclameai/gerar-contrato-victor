import { ref } from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie'

export const verifyLogin = async ({ email, password }) => {
  const { $environment } = useNuxtApp();
  try {
    const response = await axios.post($environment.apiUrlLogin, { // TODO: Adicionar type e id no body.
      email,
      password
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Erro ao realizar login.');
  }
};

export function useLogin(toast) {
  const email = ref('');
  const password = ref('');
  const isLoading = ref(false);
  const attendantId = Cookies.get('id');

  async function handleLogin() {
    isLoading.value = true; 
    try {
      const data = await verifyLogin({ email: email.value, password: password.value });

      Cookies.set('email', email.value, { expires: 10 });
      Cookies.set('password', password.value, { expires: 10 });
      Cookies.set('id', data.id, { expires: 10 });

      return navigateTo('/selection');
    } catch (error) {
      console.log(error)
      toast.add({
        severity: 'error',
        summary: 'Erro no Login',
        detail: 'Email ou senha inválidos.',
        life: 4000
      });
    } finally {
      isLoading.value = false; 
    }
  }

  return {
    email,
    password,
    isLoading,
    handleLogin,
    attendantId
  };
}