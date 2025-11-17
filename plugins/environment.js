import { useEnvironment } from "../composables/useEnvironment"

// plugins/environment.js
export default defineNuxtPlugin(() => {
  const environment = useEnvironment() // aqui já está no contexto Nuxt
  return {
    provide: {
      environment
    }
  }
})