import { ref, computed } from 'vue'; 
import Cookies from 'js-cookie';

export const step = ref(1);
export const rubrics = ref([{ key: '', value: '', occurredWhen: '', narrativa: '' }]);
export const rubricOptions = ref([]);
export const adversePartyOptions = ref([]);
export const genderOptions = ref([]);
export const attendantOptions = ref([]);
export const nationalityOptions = ref([]);
export const maritalStatusOptions = ref([]);
export const stateOptions = ref([]);
export const channelOptions = ref([]);
export const officeOptions = ref([]);
export const rubricasReunidasOptions = ref([]); 
export const appendedRubricaOptions = ref([]);
export const pixKeyError = ref(false);
export const emailError = ref(false);

export const rubricasReunidas = ref([
  { reunidaKey: '', adverseParty: '', appendedRubricas: [''] }
]);

export const form = ref({
  acquisitionChannel: '',
  serviceType: '',
  channel: '',
  office: '',
  attendant: '',
  clientName: '',
  dob: '',
  cpf: '',
  rg: '',
  nationality: '',
  birthPlace: '',
  profession: '',
  maritalStatus: '',
  gender: '',
  legalRepresentative: '',
  representativeName: '',
  representativeCpf: '',
  representativeRg: '',
  pending: '',
  pendingDetails: '',
  whatsapp: '',
  secondaryPhone: '',
  cep: '',
  address: '',
  neighborhood: '',
  number: '',
  state: '',
  city: '',
  email: '',
  authenticationMethod: '',
  contractPercentage: '',
  clientDeclarant: '',
  observation: '',
  pixType: '',
  pixKey: '',
  gerarProcessos: 'sim'
});

export const userType = computed(() => {
  return Cookies.get('type');
});

export async function fetchOptions() {
  const { $environment } = useNuxtApp();
  try {
    const response = await fetch($environment.webhookConsultaDbFormularioDBNG, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    const data = await response.json();
    const allowedRubricIds = ["128", "136", "140", "152", "154", "148"];
    
    const email = Cookies.get('email');
    rubricOptions.value = data[0].RUBRICAS
    .filter(item => item.ATIVO !== false)
    .filter(item => userType.value !== 'ext' || email === 'leonardocs392@gmail.com' || allowedRubricIds.includes(item.ID_RUBRICA.toString()))
    .map(item => ({ id: item.ID_RUBRICA, name: item.RUBRICA }));

    // Rubricas Reunidas options
    if (data[0]['RUBRICAS REUNIDAS']) {
      rubricasReunidasOptions.value = data[0]['RUBRICAS REUNIDAS']
        .filter(item => item.ATIVO !== false)
        .map(item => ({
          reunida_id: item.reunida_id,
          name: item.RUBRICA_REUNIDA,
          appended_rubrica_geral_id: item.appended_rubrica_geral_id
        }));
    }

    adversePartyOptions.value = data[0].EMPRESAS.map(item => ({ id: item.ID_EMPRESA, name: item.EMPRESA }));
    genderOptions.value = data[0].GENERO.map(item => ({ id: item.ID_GENERO, name: item.GENERO }));
    attendantOptions.value = data[0].ATENDENTES.map(item => ({ id: item.ID_ATENDENTE, name: item.ATENDENTE }));
    nationalityOptions.value = data[0].NACIONALIDADE.map(item => ({ id: item.ID_NACIONALIDADE, name: item.NACIONALIDADE }));
    maritalStatusOptions.value = data[0]['ESTADO CIVIL'].map(item => ({ id: item.ID_EST_CIVIL, name: item.EST_CIVIL }));
    stateOptions.value = data[0].UF_END.map(item => ({ id: item.ID_UF, name: item['UF ENDEREÇO'] }));
    channelOptions.value = data[0].CIAS.map(item => ({ id: item.ID_CIA, name: item.CIA }));
    officeOptions.value = data[0].ESCRITORIOS.map(item => ({ id: item.ID_ESCRITORIO, name: item.ESCRITORIO }));

    const attendantId = Cookies.get('id');
    if (attendantId) {
      form.value.attendant = attendantId;
    }
    if (userType.value === 'ext') {
      form.value.acquisitionChannel = 'externo';
    } else if (userType.value === 'indp') {
      form.value.acquisitionChannel = 'indicação própria';
    }
  } catch (error) {
    console.error('Error fetching options:', error);
  }
}

//Searches for user data by ID_ACTION and auto-fills the fields
export async function fetchUserDataByAction(action, toast) {
  const { $environment } = useNuxtApp();
  try {
    const response = await fetch($environment.webhookBuscaActionGCNG, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action })
    });

    const data = await response.json();
    const loggedAttendantId = Cookies.get('id');

    if (!data || !data.id_atendente) {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: `A Action ${action} não foi encontrada em nossa base de dados.`,
        life: 5000
      });
      return;
    }

    // 🚨 Verificação se o ID_ACTION realmente pertence ao atendente logado
    
    if (data.id_atendente .toString() !== loggedAttendantId) {
      toast.add({
        severity: 'contrast',
        summary: 'Atenção',
        detail: `O ID Action ${action} não pertence ao seu atendimento.`,
        life: 4000
      });
      form.value.action = ''; // limpa o campo
      return;
    }

    toast.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: `ID Action ${action} encontrado, retornando as informações.`,
      life: 4000
    });

    if (data.nome) form.value.clientName = data.nome;
    if (data.rg) form.value.rg = data.rg;
    if (data.profissao) form.value.profession = data.profissao;
    if (data.email) form.value.email = data.email;
    if (data.phone) form.value.whatsapp = data.phone.replace('55', '');
    if (data.phone_2) form.value.secondaryPhone = data.phone_2.replace('55', '');
    if (data.zipcode) {
      form.value.cep = data.zipcode;
      await fetchAddressByCEP(data.zipcode);
    }
    if (data.endereco) form.value.address = data.endereco;
    if (data.bairro) form.value.neighborhood = data.bairro;
    if (data.city) form.value.city = data.city;
    if (data.nascimento) {
      form.value.dob = data.nascimento.split('T')[0];
    }
    if (data.cpf) form.value.cpf = data.cpf;
    if (data.id_estado_civil) {
      form.value.maritalStatus = data.id_estado_civil;
    }
    if (data.id_nacionalidade) {
      form.value.nationality = data.id_nacionalidade;
    }
    if (data.state) {
      form.value.state = data.state;
    }
    if (data.naturalidade) {
      form.value.birthPlace = data.naturalidade;
    }
    if (data.id_genero) {
      form.value.gender = data.id_genero;
    }
    if (data.numero_endereco) {
      form.value.number = data.numero_endereco;
    }
  } catch (error) {
    console.error('Error fetching user data by ID_ACTION:', error);
  }
}

export async function fetchAddressByCEP(cep) {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
    if (!data.erro) {
      form.value.address = data.logradouro;
      form.value.neighborhood = data.bairro;
      form.value.city = data.localidade;
      form.value.state = data.uf;
    } else {
      console.error('CEP não encontrado');
    }
  } catch (error) {
    console.error('Error fetching address by CEP:', error);
  }
}

// Rubricas Reunidas methods
export function addRubricaReunida() {
  rubricasReunidas.value.push({ reunidaKey: '', adverseParty: '', appendedRubricas: [''] });
}

export function removeRubricaReunida(index) {
  if (rubricasReunidas.value.length > 1) {
    rubricasReunidas.value.splice(index, 1);
  }
}

export function addAppendedRubrica(index) {
  rubricasReunidas.value[index].appendedRubricas.push('');
}

export function removeAppendedRubrica(reunidaIndex, appendedIndex) {
  if (rubricasReunidas.value[reunidaIndex].appendedRubricas.length > 1) {
    rubricasReunidas.value[reunidaIndex].appendedRubricas.splice(appendedIndex, 1);
  }
}

// Get appended rubrica options for a given reunidaKey
export function getAppendedRubricaOptions(reunidaKey) {
  const reunida = rubricasReunidasOptions.value.find(opt => opt.reunida_id === reunidaKey);
  if (!reunida) return [];
  // Map appended_rubrica_geral_id to rubricOptions
  return rubricOptions.value.filter(rub =>
    reunida.appended_rubrica_geral_id.includes(Number(rub.id)) || reunida.appended_rubrica_geral_id.includes(rub.id)
  );
}

export const showPopup = ref(false);
export const newAdverseParty = ref('');
export const currentRubricIndex = ref(null);

export async function addNewAdverseParty(newAdverseParty, index, toast) {
  const { $environment } = useNuxtApp();
  try {
    const response = await fetch($environment.webhookAdicionarItemParteAdversaNG, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "item": newAdverseParty,
        "Atendente": Cookies.get('id'),
        "Nome do Cliente": form.value.clientName
      })
    });
    const data = await response.json();
    const items = data[0];

    if (items.resposta) {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: items.resposta,
        life: 3000
      });
      return;
    }

    const addedAdverseParty = { id: items['id_parte_adversa'], name: items['nome fantasia'] };
    adversePartyOptions.value.push(addedAdverseParty);
    rubrics.value[index].value = addedAdverseParty.id;
  } catch (error) {
    console.error('Error adding new adverse party:', error);
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Error adding new adverse party:',
      life: 3000
    });
  }
}

export function handleAdversePartyChange(event, index) {
  if (event.target.value === 'add-new') {
    currentRubricIndex.value = index;
    showPopup.value = true;
  }
}

export function saveNewAdverseParty(cnpj, toast) {
  addNewAdverseParty(cnpj, currentRubricIndex.value, toast);
  showPopup.value = false;
}

export function closePopup() {
  rubrics.value[currentRubricIndex.value].value = '';
  showPopup.value = false;
}

export function addRubric() {
  fetchOptions();
  rubrics.value.push({ key: '', value: '', occurredWhen: '', narrativa: '' });
}

export function removeRubric(index) {
  if (rubrics.value.length > 1) {
    rubrics.value.splice(index, 1);
  }
}

// Computed properties to check form validity
export const isStepOneValid = computed(() => {
  return (
    form.value.serviceType &&
    form.value.clientName &&
    form.value.dob &&
    form.value.cpf &&
    form.value.rg &&
    form.value.nationality &&
    form.value.birthPlace &&
    form.value.profession &&
    form.value.maritalStatus &&
    form.value.gender &&
    form.value.legalRepresentative &&
    (form.value.legalRepresentative === 'não' || 
      (form.value.representativeName && form.value.representativeCpf && form.value.representativeRg)) &&
    form.value.pending &&
    (form.value.pending === 'não' || form.value.pendingDetails)
  );
});

export const isStepTwoValid = computed(() => {
  const isPixKeyValid = () => {
    if (!form.value.pixType) return true; // If pixType is not selected, skip validation
    switch (form.value.pixType) {
      case 'CPF':
        return validateCPF(form.value.pixKey); 
      case 'Telefone':
        return validatePhoneNumber(form.value.pixKey); 
      case 'Email':
        return validateEmail(form.value.pixKey); 
      case 'Chave aleatória':
        return validateRandomKey(form.value.pixKey);
      default:
        return false;
    }
  };

  return (
    form.value.whatsapp &&
    form.value.cep &&
    form.value.address &&
    form.value.neighborhood &&
    form.value.number &&
    form.value.state &&
    form.value.city &&
    form.value.email &&
    isPixKeyValid() 
  );
});

export const isStepThreeValid = computed(() => {
  return (
    form.value.authenticationMethod &&
    form.value.contractPercentage &&
    form.value.clientDeclarant
  );
});

export const isSubmitting = ref(false);
export const signedContract = ref(null);
export const formId = ref(null);

export function verifyClientName(toast) {
  const nameParts = form.value.clientName.trim().split(' ');
  if (nameParts.length < 2) {
    toast.add({ severity: 'contrast',
      summary: 'Aviso',
      detail: 'Por favor, insira pelo menos um sobrenome.',
      life: 4000
    });
    form.value.clientName = '';
  }
}

export function verifyCPF(toast, cpfType) {m
  const cpfFields = {
    cpf: 'cpf',
    representative: 'representativeCpf',
  };

  const field = cpfFields[cpfType]; 
  const cpfValue = form.value[field] || '';

  if (!validateCPF(cpfValue)) {
    toast.add({
      severity: 'contrast',
      summary: 'Aviso',
      detail: 'CPF inválido. Por favor, insira um CPF válido.',
      life: 4000
    });''

    form.value[field] = ''; 
  }
}

export function verifyPhoneNumber(toast, phoneType = 'whatsapp') {
  const phoneValue = phoneType === 'whatsapp' ? form.value.whatsapp : form.value.secondaryPhone;
  if (!validatePhoneNumber(phoneValue)) {
    toast.add({
      severity: 'contrast',
      summary: 'Aviso',
      detail: 'Número de telefone inválido. Por favor, insira um número de telefone válido no formato (11) 11111-1111.',
      life: 4000
    });
    if (phoneType === 'whatsapp') {
      form.value.whatsapp = '';
    } else {
      form.value.secondaryPhone = '';
    }
  }
}

export function verifyEmail(toast) {
  emailError.value = false;
  if (form.value.email !== '' && !validateEmail(form.value.email)) {
    emailError.value = true;
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Formato de email inválido. Por favor, insira um email válido.',
      life: 4000,
    });
    form.value.email = ''; //Clear Invalid E-mail
  }
}

export const uploadedFiles = ref([]);

export function removeFile(index) {
  uploadedFiles.value.splice(index, 1);
}

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

export function validatePixKey(toast) {
  pixKeyError.value = false;
  if(form.value.pixType === 'CPF' && form.value.pixKey.trim() !== '' && !validarCPF(form.value.pixKey)){
    pixKeyError.value = true;
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'CPF inválido. Por favor, insira um cpf válido.',
      life: 4000,
    });
    form.value.pixKey = '';
  } else if (form.value.pixType === 'Telefone' && form.value.pixKey.trim() !== '' && form.value.pixKey.length < 15){
    pixKeyError.value = true;
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Número de Telefone Inválido. Por favor, insira um número válido.',
      life: 4000,
    });
    form.value.pixKey = '';  
  } else if(form.value.pixType === 'Email' && form.value.pixKey.trim() !== '' && !verifyEmail(form.value.pixKey)) {
    pixKeyError.value = true;
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Formato de email inválido. Por favor, insira um email válido.',
      life: 4000,
    });
    form.value.pixKey = '';
  } else if(form.value.pixType === 'Chave Aleatória' && form.value.pixKey.trim() !== '' && form.value.pixKey.length < 36) {
    pixKeyError.value = true;
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Chave Aleatória Inválida. Por favor, insira uma chave válida.',
      life: 4000,
    });
    form.value.pixKey = '';
  }
}

export function nextStep() {
  if (step.value < 3) {
    step.value += 1;
  } else {
    // lógica para submeter o formulário
    console.log(form.value);
  }
}

export function prevStep() {
  if (step.value > 1) {
    step.value -= 1;
  }
}

// Animation functions
export function animateButton(event) {
  event.target.classList.add('p-button-raised');
}

export function resetAnimation(event) {
  event.target.classList.remove('p-button-raised');
}

export async function submitForm(toast) {
  const { $environment } = useNuxtApp();
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  if (!isStepThreeValid.value) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Por favor, preencha todos os campos obrigatórios.',
      life: 3000
    });
    return;
  }
  try {
    if (!validateEmail(form.value.email)) {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'E-mail inválido. Por favor, insira um e-mail válido.',
        life: 3000
      });
      isSubmitting.value = false;
      return;
    }
    if (!validatePhoneNumber(form.value.whatsapp) || (form.value.secondaryPhone && !validatePhoneNumber(form.value.secondaryPhone))) {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Número de telefone inválido. Por favor, insira um número de telefone válido no formato (11) 11111-1111.',
        life: 3000
      });
      isSubmitting.value = false;
      return;
    }

    // Envio dos arquivos gerais (docs)
    const formData = new FormData();
    uploadedFiles.value.forEach(file => {
      formData.append('docs', file);
    });

    const response = await fetch($environment.apiUrlEnviarForm, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Erro ao enviar arquivos');
    }

    const fileLinks = await response.json();

    const finalFormData = {
      ...form.value,
      gerarProcessos: form.value.gerarProcessos === 'sim',
      rubrics: rubrics.value.map(rubric => ({
        id_rubrica: rubric.key,
        id_parte_adversa: rubric.value,
        occurredWhen: rubric.occurredWhen,
        narrativa: rubric.narrativa
      })),
      rubricas_reunidas: rubricasReunidas.value.map(rr => ({
        reunida_id: rr.reunidaKey,
        id_parte_adversa: rr.adverseParty,
        appended_rubrica_geral_id: rr.appendedRubricas
      })),
      fileLinks
    };

    console.log('Submitting form with data:', JSON.stringify(finalFormData));
    const formResponse = await fetch($environment.webhookGerarContratoNG, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(finalFormData)
    });

    if (formResponse.ok) {
      const responseData = await formResponse.json();
      formId.value = responseData.id;

      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Formulário enviado com sucesso!',
        life: 4000
      });
      window.location.reload();
    } else {
      const errorText = await formResponse.text();
      console.error('Erro ao enviar formulário:', errorText);
    }
  } catch (error) {
    toast.add({ 
      severity: 'error', 
      summary: 'Error Message', 
      detail: 'Erro ao enviar formulário', 
      life: 3000
    });
    console.error('Erro ao enviar formulário:', error);
  } finally {
    isSubmitting.value = false;
  }
}

fetchOptions();
