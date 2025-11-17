export const useEnvironment = () => {
  const config = useRuntimeConfig()

  return {
    webhookConsultaDbFormularioDBNG: config.public.webhookConsultaDbFormularioDBNG,
    webhookBuscaActionGCNG: config.public.webhookBuscaActionGCNG,
    webhookAdicionarItemParteAdversaNG: config.public.webhookAdicionarItemParteAdversaNG,
    webhookGerarContratoNG: config.public.webhookGerarContratoNG,
    webhookContratoAssinadoPresencialNG: config.public.webhookContratoAssinadoPresencialNG,
    webhookComecarAtendMesmoNumeroNG: config.public.webhookComecarAtendMesmoNumeroNG,
    webhookCriarNovoAtendNicoNG: config.public.webhookCriarNovoAtendNicoNG,
    apiUrlLogin: config.public.apiUrlLogin,
    apiUrlEnviarForm: config.public.apiUrlEnviarForm
  }
}