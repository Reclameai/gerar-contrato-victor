<template>
  <div class="page-container">
    <Toast />
    <h2 class="form-title">Gerar Contrato</h2>
    <p class="form-subtitle">Insira os detalhes para prosseguir</p>

    <div class="progress-bar">
      <div :class="{'step active': step >= 1}">1. Detalhes Gerais</div>
      <div :class="{'step active': step >= 2}">2. Detalhes de contato</div>
      <div :class="{'step active': step >= 3}">3. Detalhes do contrato</div>
    </div>

    <form @submit.prevent="step === 3 ? submitForm(toast) : nextStep()" class="form">
      <transition name="fade">
        <div v-if="step === 1" class="form-section">
          <div class="form-group">
            <div class="form-field">
              <label for="action" class="form-label">ID Action</label>
              <div class="input-with-icon">
                <InputText id="action" placeholder="Action" v-model="form.action" required class="form-input" @change="fetchUserDataByAction(form.action, toast)" v-if="isClient" v-mask="'##########'" />
                <InputText id="action" placeholder="Action" v-model="form.action" required class="form-input" @change="fetchUserDataByAction(form.action, toast)" v-else />
                <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
                  <path d="M 21 3 C 11.601563 3 4 10.601563 4 20 C 4 29.398438 11.601563 37 21 37 C 24.355469 37 27.460938 36.015625 30.09375 34.34375 L 42.375 46.625 L 46.625 42.375 L 34.5 30.28125 C 36.679688 27.421875 38 23.878906 38 20 C 38 10.601563 30.398438 3 21 3 Z M 21 7 C 28.199219 7 34 12.800781 34 20 C 34 27.199219 28.199219 33 21 33 C 13.800781 33 8 27.199219 8 20 C 8 12.800781 13.800781 7 21 7 Z"></path>
                </svg>
              </div>
            </div>
            <div class="form-field">
              <label for="serviceType" class="form-label">Tipo de atendimento</label>
              <select id="serviceType" v-model="form.serviceType" required class="form-input">
                <option value="virtual">Virtual</option>
                <option value="presencial">Presencial</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <div class="form-field">
              <label for="channel" class="form-label">Canal de Atendimento</label>
              <select id="channel" v-model="form.channel" required class="form-input">
                <option v-for="option in channelOptions" :key="option.id" :value="option.id">{{ option.name }}</option>
              </select>
            </div>
            <div class="form-field">
              <label for="office" class="form-label">Escritório</label>
              <select id="office" v-model="form.office" required class="form-input">
                <option v-for="option in officeOptions" :key="option.id" :value="option.id">{{ option.name }}</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <div class="form-field">
              <label for="attendant" class="form-label">Atendente</label>
              <select id="attendant" v-model="form.attendant" required disabled class="form-input">
                  <option v-for="option in attendantOptions" :key="option.id" :value="option.id">{{ option.name }}</option>
              </select>
            </div>
            <div class="form-field">
              <label for="clientName" class="form-label">Nome do Cliente</label>
              <InputText id="clientName" placeholder="Nome do Cliente" v-model="form.clientName" required class="form-input" maxlength="100" @change="verifyClientName(toast)" @keypress="onlyLetters"/>
            </div>
          </div>
          <div class="form-group">
            <div class="form-field">
              <label for="dob" class="form-label">Data de Nascimento</label>
              <InputText id="dob" type="date" v-model="form.dob" required class="form-input" min="1900-01-01" max="2099-12-31"/>
            </div>
            <!-- </div> -->
            <div class="form-field">
              <label for="cpf" class="form-label">CPF</label>
              <InputText id="cpf" placeholder="CPF" v-model="form.cpf" required class="form-input" v-if="isClient" v-mask="'###.###.###-##'" @change="verifyCPF(toast, 'cpf');" />
              <InputText id="cpf" placeholder="CPF" v-model="form.cpf" required class="form-input" v-else @change="verifyCPF(toast, 'cpf');" />
            </div>
          </div>
          <div class="form-group">
            <div class="form-field">
              <label for="rg" class="form-label">RG</label>
              <InputText id="rg" placeholder="RG" v-model="form.rg" class="form-input" minlength="5" maxlength="12" @keypress="onlyRG"/>
            </div>
            <div class="form-field">
              <label for="nationality" class="form-label">Nacionalidade</label>
              <select id="nationality" v-model="form.nationality" required class="form-input">
                <option v-for="option in nationalityOptions" :key="option.id" :value="option.id">{{ option.name }}</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <div class="form-field">
              <label for="birthPlace" class="form-label">Natural de</label>
              <InputText id="birthPlace" placeholder="Natural de" v-model="form.birthPlace" required class="form-input" maxlength="100" />
            </div>
            <div class="form-field">
              <label for="profession" class="form-label">Profissão</label>
              <InputText id="profession" placeholder="Profissão" v-model="form.profession" required class="form-input" maxlength="100" @keypress="onlyLetters" />
            </div>
          </div>
          <div class="form-group">
            <div class="form-field">
              <label for="maritalStatus" class="form-label">Estado Civil</label>
              <select id="maritalStatus" v-model="form.maritalStatus" required class="form-input">
                <option v-for="option in maritalStatusOptions" :key="option.id" :value="option.id">{{ option.name }}</option>
              </select>
            </div>
            <div class="form-field">
              <label for="gender" class="form-label">Gênero</label>
              <select id="gender" v-model="form.gender" required class="form-input">
                <option v-for="option in genderOptions" :key="option.id" :value="option.id">{{ option.name }}</option>
              </select>
            </div>
          </div>
          <div class="form-group legal-representative-group">
            <div class="form-field">
              <label for="legalRepresentative" class="form-label">Representante legal?</label>
              <select id="legalRepresentative" v-model="form.legalRepresentative" required class="form-input">
                <option value="sim">Sim</option>
                <option value="não">Não</option>
              </select>
            </div>
            <div v-if="form.legalRepresentative === 'sim'" class="form-field">
              <label for="representativeName" class="form-label">Nome do Representado</label>
              <InputText id="representativeName" placeholder="Nome do Representado" v-model="form.representativeName" required class="form-input" maxlength="100" @keypress="onlyLetters" />
            </div>
            <div v-if="form.legalRepresentative === 'sim'" class="form-field">
              <label for="representativeCpf" class="form-label">CPF do Representado</label>
              <InputText id="representativeCpf" placeholder="CPF do Representado" v-model="form.representativeCpf" required class="form-input" v-if="isClient" v-mask="'###.###.###-##'" @change="verifyCPF(toast, 'representativeCpf')" />
              <InputText id="representativeCpf" placeholder="CPF do Representado" v-model="form.representativeCpf" required class="form-input" v-else @change="verifyCPF(toast, 'representativeCpf')" />
            </div>
            <div v-if="form.legalRepresentative === 'sim'" class="form-field">
              <label for="representativeRg" class="form-label">RG do Representado</label>
              <InputText id="representativeRg" placeholder="RG do Representado" v-model="form.representativeRg" required class="form-input" minlength="7" maxlength="12" @keypress="onlyRG"/>
            </div>
          </div>
          <div class="form-group">
            <div class="form-field">
              <label for="pending" class="form-label">Possui Pendência?</label>
              <select id="pending" v-model="form.pending" required class="form-input">
                <option value="sim">Sim</option>
                <option value="não">Não</option>
              </select>
            </div>
            <div v-if="form.pending === 'sim'" class="form-field">
              <label for="pendingDetails" class="form-label">Digite a Pendência</label>
              <InputText id="pendingDetails" placeholder="Digite a Pendência" v-model="form.pendingDetails" required class="form-input" />
            </div>
          </div>
          <div class="form-group">
            <div class="form-field">
              <label class="form-label">Gerar Processos</label>
              <div class="radio-group">
                <label class="custom-radio">
                  <input type="radio" value="sim" v-model="form.gerarProcessos" />
                  <span class="radio-label">Sim</span>
                </label>
                <label class="custom-radio">
                  <input type="radio" value="não" v-model="form.gerarProcessos" />
                  <span class="radio-label">Não</span>
                </label>
              </div>
            </div>
          </div>
          <Button 
            type="submit" 
            label="Prosseguir" 
            icon="pi pi-arrow-right" 
            class="form-button next-button" 
            :disabled="!isStepOneValid"
            :class="{ 'p-button-disabled': !isStepOneValid }" 
            @mouseenter="animateButton" 
            @mouseleave="resetAnimation" 
          />
        </div>
      </transition>

      <transition name="fade">
        <div v-if="step === 2" class="form-section">
          <div class="form-group">
            <div class="form-field">
              <label for="whatsapp" class="form-label">WhatsApp</label>
              <InputText id="whatsapp" placeholder="WhatsApp" v-model="form.whatsapp" required class="form-input" v-if="isClient" v-mask="'(##) #####-####'" @change="verifyPhoneNumber(toast, 'whatsapp')"/>
              <InputText id="whatsapp" placeholder="WhatsApp" v-model="form.whatsapp" required class="form-input" v-else @change="verifyPhoneNumber(toast, 'secondaryPhone')"/>
            </div>
            <div class="form-field">
              <label for="secondaryPhone" class="form-label">Telefone Secundário</label>
              <InputText id="secondaryPhone" placeholder="Telefone Secundário" v-model="form.secondaryPhone" class="form-input" v-if="isClient" v-mask="'(##) #####-####'" @change="verifyPhoneNumber(toast, 'secondaryPhone')"/>
              <InputText id="secondaryPhone" placeholder="Telefone Secundário" v-model="form.secondaryPhone" class="form-input" v-else @change="verifyPhoneNumber(toast, 'secondaryPhone')"/>
            </div>
          </div>
          <div class="form-group">
            <div class="form-field">
              <label for="pixType" class="form-label">Selecione o formato do PIX</label>
              <select id="pixType" v-model="form.pixType" class="form-input">
                <option value="" disabled selected hidden>Selecione</option>
                <option value="CPF">CPF</option>
                <option value="Telefone">Telefone</option>
                <option value="Email">Email</option>
                <option value="Chave Aleatória">Chave Aleatória</option>
              </select>
            </div>
            <div class="form-field" v-if="form.pixType">
              <label for="pixKey" class="form-label">Chave PIX</label>
              <InputText
                id="pixKey"
                placeholder="Chave PIX"
                v-model="form.pixKey"
                class="form-input"
                :class="{ 'input-error' : pixKeyError }"
                v-if="form.pixType === 'CPF' || form.pixType === 'Telefone'"
                v-mask="form.pixType === 'CPF' ? '###.###.###-##' : '(##) #####-####'"
                :type="form.pixType === 'Email' ? 'email' : 'text'"
                @blur="() => validatePixKey(toast)"
              />
              <InputText
                id="pixKey"
                placeholder="Chave PIX"
                v-model="form.pixKey"
                class="form-input"
                :class="{ 'input-error' : pixKeyError }"
                v-else="form.pixType === 'Email' || form.pixType === 'Chave Aleatória'"
                :maxlength="form.pixType === 'Chave Aleatória' ? 36 : null"
                :type="form.pixType === 'Email' ? 'email' : 'text'"
                @blur="() => validatePixKey(toast)"
              />              
            </div>
          </div>
          <div class="form-group">
            <div class="form-field">
              <label for="cep" class="form-label">CEP</label>
              <InputText 
                id="cep" 
                placeholder="CEP" 
                v-model="form.cep" 
                required 
                class="form-input" 
                v-if="isClient" 
                v-mask="'#####-###'" 
                @blur="fetchAddressByCEP(form.cep)" 
              />
              <InputText 
                id="cep" 
                placeholder="CEP" 
                v-model="form.cep" 
                required 
                class="form-input" 
                v-else 
                @blur="fetchAddressByCEP(form.cep)" 
              />
            </div>
            <div class="form-field">
              <label for="address" class="form-label">Endereço</label>
              <InputText id="address" placeholder="Endereço" v-model="form.address" required class="form-input" maxlength="100"/>
            </div>
          </div>
          <div class="form-group">
            <div class="form-field">
              <label for="neighborhood" class="form-label">Bairro</label>
              <InputText id="neighborhood" placeholder="Bairro" v-model="form.neighborhood" required class="form-input" maxlength="100"/>
            </div>  
            <div class="form-field">
              <label for="number" class="form-label">Número</label>
              <InputText id="number" placeholder="Número" v-model="form.number" required class="form-input" maxlength="10" @keypress="onlyLettersAndNumbers" />
            </div>
          </div>
          <div class="form-group">
            <div class="form-field">
              <label for="state" class="form-label">UF endereço</label>
              <select id="state" v-model="form.state" required class="form-input">
                <option v-for="option in stateOptions" :key="option.id" :value="option.name">{{ option.name }}</option>
              </select>
            </div>
            <div class="form-field">
              <label for="city" class="form-label">Cidade</label>
              <InputText id="city" placeholder="Cidade" v-model="form.city" required class="form-input" maxlength="100"/>
            </div>
          </div>
          <div class="form-group">
            <div class="form-field">
              <label for="email" class="form-label">E-mail</label>
              <InputText
                id="email"
                placeholder="E-mail"
                type="email"
                v-model="form.email"
                required
                class="form-input"
                :class="{ 'input-error' : emailError}"
                @blur="() => verifyEmail(toast)"
              />
            </div>
          </div>
          <div class="form-buttons">
            <Button label="Voltar" icon="pi pi-arrow-left" @click="prevStep" class="form-button back-button"/>
            <Button
              type="submit" 
              label="Prosseguir" 
              icon="pi pi-arrow-right" 
              class="form-button next-button" 
              :disabled="!isStepTwoValid || !validateEmail" 
              :class="{ 'p-button-disabled': !isStepTwoValid || !validateEmail }"
              @mouseenter="animateButton" 
              @mouseleave="resetAnimation" 
            />
          </div>
        </div>
      </transition>

      <transition name="fade">
        <div v-if="step === 3" class="form-section">
          <div class="form-group">
            <div class="form-field">
              <label for="authenticationMethod" class="form-label">Forma de autenticação</label>
              <select id="authenticationMethod" v-model="form.authenticationMethod" required class="form-input">
                <option value="selfie">Selfie</option>
                <option value="selfie com documento">Selfie com documento</option>
              </select>
            </div>
            <div class="form-field">
              <label for="contractPercentage" class="form-label">Percentual do contrato</label>
              <select id="contractPercentage" v-model="form.contractPercentage" required class="form-input">
                <option value="50%">50%</option>
                <option value="45%">45%</option>
                <option value="40%">40%</option>
                <option value="35%">35%</option>
                <option value="30%">30%</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <div class="form-field">
              <label for="clientDeclarant" class="form-label">Cliente declarante?</label>
              <select id="clientDeclarant" v-model="form.clientDeclarant" required class="form-input">
                <option value="sim">Sim</option>
                <option value="não">Não</option>
              </select>
            </div>
            <div class="form-field">
              <label for="observation" class="form-label">Observação</label>
              <textarea id="observation" placeholder="Observação" v-model="form.observation" class="form-input"></textarea>
            </div>
          </div>
          <div class="form-group">
            <div class="form-field">
              <label for="docs" class="form-label">Docs</label>
              <input type="file" id="docs" multiple @change="handleFileUpload($event, toast)" class="form-input" />
            </div>
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
          <div class="form-group">
            <div class="form-field">
              <label for="rubrics" class="form-label">Rubricas</label>
              <div v-for="(rubric, index) in rubrics" :key="index" class="rubric-field">
                <div class="rubric-row">
                  <select v-model="rubric.key" class="form-input">
                    <option value="" selected hidden>Selecione uma rubrica</option>
                    <option v-for="option in rubricOptions" :key="option.id" :value="option.id">{{ option.name }}</option>
                  </select>
                  <select v-model="rubric.value" class="form-input" @change="handleAdversePartyChange($event, index)">
                    <option value="" selected hidden>Selecione uma parte adversa</option>
                    <option value="add-new" class="add-new-option" style="color: white; background-color: black;">Adicionar nova parte adversa</option>
                    <option v-for="option in adversePartyOptions" :key="option.id" :value="option.id">{{ option.name }}</option>
                  </select>
                  <div v-if="['ESPECIFICA', 'BLOQUEIO_APP_MOTORISTA', 'ENERGIA_TARIFAS', 'GOLPE_PIX'].includes(rubricOptions.find(option => option.id === rubric.key)?.name)" class="form-field">
                    <InputText id="occurredWhen" type="date" v-model="rubric.occurredWhen" class="form-input" />
                  </div>
                  <button type="button" @click="removeRubric(index)" class="remove-rubric-button">Remover</button>
                </div>
                <div v-if="['ESPECIFICA', 'BLOQUEIO_APP_MOTORISTA', 'ENERGIA_TARIFAS', 'GOLPE_PIX'].includes(rubricOptions.find(option => option.id === rubric.key)?.name)" class="form-field">
                  <textarea id="narrativa" placeholder="Narrativa" v-model="rubric.narrativa" class="form-input"></textarea>
                </div>
              </div>
              <button type="button" @click="addRubric" class="add-rubric-button">+</button>
            </div>
          </div>
          <!-- Rubricas Reunidas -->
          <div class="form-group">
            <div class="form-field">
              <label class="form-label">Rubricas Reunidas</label>
              <div v-for="(rr, rrIdx) in rubricasReunidas" :key="rrIdx" class="rubric-field">
                <div class="rubric-row">
                  <select v-model="rr.reunidaKey" class="form-input rubricas-reunidas-main-select">
                    <option value="" selected hidden>Selecione uma rubrica reunida</option>
                    <option v-for="option in rubricasReunidasOptions" :key="option.reunida_id" :value="option.reunida_id">
                      {{ option.name }}
                    </option>
                  </select>
                  <!-- Parte Adversa para Rubricas Reunidas (ao lado do select principal) -->
                  <select
                    v-model="rr.adverseParty"
                    class="form-input rubricas-reunidas-main-select"
                    style="max-width:250px"
                  >
                    <option value="" selected hidden>Parte adversa</option>
                    <option
                      v-for="option in adversePartyOptions"
                      :key="option.id"
                      :value="option.id"
                    >
                      {{ option.name }}
                    </option>
                  </select>
                  <button type="button" @click="removeRubricaReunida(rrIdx)" class="remove-rubric-button">Remover</button>
                </div>
                <div v-if="rr.reunidaKey">
                  <div
                    v-for="(appended, appIdx) in rr.appendedRubricas"
                    :key="appIdx"
                    class="rubricas-reunidas-sub-select-row"
                  >
                    <select
                      v-model="rr.appendedRubricas[appIdx]"
                      class="rubricas-reunidas-sub-select"
                    >
                      <option value="" selected hidden>Selecione uma rubrica</option>
                      <option
                        v-for="option in getAppendedRubricaOptions(rr.reunidaKey)"
                        :key="option.id"
                        :value="option.id"
                      >
                        {{ option.name }}
                      </option>
                    </select>
                    <button
                      type="button"
                      @click="addAppendedRubrica(rrIdx)"
                      class="rubricas-reunidas-btn add"
                      title="Adicionar Rubrica"
                    >+</button>
                    <button
                      type="button"
                      @click="removeAppendedRubrica(rrIdx, appIdx)"
                      class="rubricas-reunidas-btn remove"
                      title="Remover"
                    >–</button>
                  </div>
                </div>
              </div>
              <button type="button" @click="addRubricaReunida" class="add-rubric-button">+</button>
            </div>
          </div>
          <div class="form-buttons">
            <Button label="Voltar" icon="pi pi-arrow-left" @click="prevStep" class="form-button back-button" />
            <Button 
              type="submit" 
              label="Enviar" 
              icon="pi pi-check" 
              class="form-button submit-button" 
              :disabled="isSubmitting && !isStepThreeValid" 
              @mouseenter="animateButton" 
              @mouseleave="resetAnimation" 
            />
          </div>
        </div>
      </transition>
      <popup v-if="showPopup" @close="closePopup" @save="saveNewAdverseParty($event, toast)" />
    </form>
  </div>
</template>

<script setup>
  import { 
    step,
    form, 
    isStepOneValid, 
    isStepTwoValid, 
    isStepThreeValid,
    nextStep, 
    prevStep, 
    animateButton, 
    resetAnimation, 
    handleFileUpload, 
    removeFile, 
    uploadedFiles, 
    rubrics, 
    addRubric, 
    rubricOptions, 
    adversePartyOptions, 
    handleAdversePartyChange, 
    genderOptions, 
    attendantOptions, 
    nationalityOptions, 
    maritalStatusOptions, 
    stateOptions, userType, 
    fetchAddressByCEP, 
    removeRubric, 
    submitForm,
    verifyClientName,
    fetchUserDataByAction,
    channelOptions,
    officeOptions,
    showPopup,
    saveNewAdverseParty,
    closePopup,
    validatePixKey,
    rubricasReunidas,
    rubricasReunidasOptions,
    addRubricaReunida,
    removeRubricaReunida,
    addAppendedRubrica,
    removeAppendedRubrica,
    getAppendedRubricaOptions,
    pixKeyError,
    verifyCPF,
    emailError,
    verifyEmail,
    fetchOptions
  } from '~/auth/form';
  import InputText from 'primevue/inputtext';
  import Button from 'primevue/button';
  import { useToast } from 'primevue/usetoast';
  import Toast from 'primevue/toast';
  import { onMounted, ref } from 'vue';
  import Cookies from 'js-cookie';
  import { verifyLogin } from '~/auth/login';
  import { useRouter } from 'vue-router';
  import popup from '~/components/popup.vue';
  import { onlyLetters, onlyLettersAndNumbers, onlyRG } from '../utils/helpers';

  const toast = useToast();
  const router = useRouter();
  const isClient = ref(false);
  const isSubmitting = ref(false);

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

    if (userType === 'ext') {
      form.value.acquisitionChannel = 'externo';
    } else if (userType === 'indp') {
      form.value.acquisitionChannel = 'indicação própria';
    }
  });
  fetchOptions();
</script>

<style scoped>
  @import url('~/assets/css/form.css');
</style>