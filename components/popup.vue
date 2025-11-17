<template>
    <div class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h2>Adicionar nova parte adversa</h2>
          <button @click="closePopup" class="close-btn">×</button>
        </div>
  
        <label for="cnpj" class="modal-label">CNPJ</label>
        <input v-model="cnpj" id="cnpj" type="text" class="modal-input" v-mask="'##.###.###/####-##'" />

        <div class="modal-footer">
          <button @click="closePopup" class="cancel-btn">Cancelar</button>
          <button @click="saveCNPJ" class="save-btn">Salvar</button>
        </div>
      </div>
    </div>
</template>
  
<script setup>
  import { ref, defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    isOpen: Boolean,
    initialCNPJ: String
  });
  const emit = defineEmits(['close', 'save']);
  
  const cnpj = ref(props.initialCNPJ || '');
  
  const closePopup = () => {
    emit('close');
  };
  
  const saveCNPJ = () => {
    emit('save', cnpj.value);
  };
</script>
  
<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    font-family: 'Roboto', sans-serif;
  }
  
  .modal {
    background: #1e1e1e;
    color: #ffffff;
    padding: 20px;
    border-radius: 8px;
    width: 600px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #333;
    padding-bottom: 10px;
    margin-bottom: 15px;
  }
  
  .close-btn {
    background: none;
    border: none;
    color: #aaa;
    font-size: 24px;
    cursor: pointer;
  }
  
  .close-btn:hover {
    color: #fff;
  }
  
  .modal-label {
    display: block;
    font-size: 14px;
    color: #ccc;
    margin-bottom: 5px;
  }
  
  .modal-input {
    width: 100%;
    padding: 8px;
    border: 1px solid #444;
    background: #2a2a2a;
    color: #fff;
    border-radius: 4px;
    font-size: 14px;
  }
  
  .modal-input:focus {
    outline: none;
    border-color: #007bff;
  }
  
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }
  
  .cancel-btn {
    background: #555;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .cancel-btn:hover {
    background: #666;
  }
  
  .save-btn {
    background: #28a745;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .save-btn:hover {
    background: #218838;
  }
</style>
