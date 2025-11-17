export const onlyLetters = (event) => {
  const char = String.fromCharCode(event.which);
  const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/; // aceita letras com acento e espaço
  if (!regex.test(char)) {
    event.preventDefault();
  }
}; 

export const onlyRG = (event) => {
  const char = String.fromCharCode(event.which);
  const regex = /^[0-9A-Za-z.\-]$/; // números, letras, ponto e hífen
  if (!regex.test(char)) {
    event.preventDefault();
  }
};

export const onlyLettersAndNumbers = (event) => {
  const char = String.fromCharCode(event.which);
  const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9]$/; 
  if (!regex.test(char)) {
    event.preventDefault();
  }
};

export const onlyNumbers = (event) => {
  const char = String.fromCharCode(event.which);
  const regex = /^[0-9]+$/; // apenas dígitos de 0 a 9
  if (!regex.test(char)) {
    event.preventDefault();
  }
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export const validatePhoneNumber= (phone) => {
  const regex = /^\(\d{2}\) \d{5}-\d{4}$/;
  return regex.test(phone);
}

export const validateCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]+/g, ''); 
  
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return false;
  }
  
  const calcularDigito = (cpf, faixa) => {
    let soma = 0;
    for (let i = 0; i < faixa; i++) {
      soma += parseInt(cpf[i]) * (faixa + 1 - i);
    }
    const resto = (soma * 10) % 11;
    return (resto === 10 || resto === 11) ? 0 : resto;
  }
  
  const digito1 = calcularDigito(cpf, 9);
  const digito2 = calcularDigito(cpf, 10);
  
  return digito1 === parseInt(cpf[9]) && digito2 === parseInt(cpf[10]);
}

export const validateRandomKey = (randomKey) => {
  if(randomKey.trim() !== '' && randomKey.length <= 35){
    return randomKey;
  }
}
