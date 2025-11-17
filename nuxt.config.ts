import Aura from '@primevue/themes/aura';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {    
    public: {      
      webhookConsultaDbFormularioDBNG: process.env.WEBHOOK_CONSULTA_FORMULARIO_DB_NG,
      webhookBuscaActionGCNG: process.env.WEBHOOK_BUSCA_ACTION_GC_NG,
      webhookAdicionarItemParteAdversaNG: process.env.WEBHOOK_ADICIONAR_ITEM_PARTE_ADVERSA_NG,
      webhookGerarContratoNG: process.env.WEBHOOK_GERAR_CONTRATO_NG,
      webhookContratoAssinadoPresencialNG: process.env.WEBHOOK_CONTRATO_ASSINADO_PRESENCIAL_NG,
      webhookComecarAtendMesmoNumeroNG: process.env.WEBHOOK_COMECAR_ATEND_MESMO_NUMERO_NG,
      webhookCriarNovoAtendNicoNG: process.env.WEBHOOK_CRIAR_NOVO_ATEND_NICO_NG,
      apiUrlEnviarForm: process.env.API_URL_ENVIAR_FORM,
      apiUrlLogin: process.env.API_URL_LOGIN
    },
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  ssr: true,
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Nicolas Gomes'
    }
  },
  modules: [
    '@primevue/nuxt-module'
  ],
  plugins: [
    '~/plugins/vue-the-mask.js'
  ],
  primevue: {
    options: {
        theme: {
            preset: Aura
        }
    }
  },
  css: ['~/assets/css/toast.css', '~/assets/css/progressbar.css'],
  build: {
    transpile: ['primevue']
  }
});
