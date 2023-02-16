const ariaLiveMessage = document.getElementById('message');
const cardNumberLabel = document.getElementById('card-company-label');
const allInputField = document.querySelectorAll('.credit-card-form  input');
const formContainer = document.getElementsByClassName('form-container')[0];
const confirmationContainer = document.getElementsByClassName('confirmation-container')[0];
/* card name input */
const cardHolderName = document.getElementById('card-holder-name');
const cardHolderHint = document.getElementById('card-holder-name-hint');
/* card number input */
const cardNumber = document.getElementById('card-number');
const cardNumberHint = document.getElementById('card-number-hint');
/* Exp.Date input */
const expMonth = document.getElementById('expiration-date-month');
const expYear = document.getElementById('expiration-date-year');
const expDateFieldsetHint = document.getElementById('expDate-fieldset-hint');
/* CVC input */
const cvcNumber = document.getElementById('cvc-number');
const cvcNumberHint = document.getElementById('cvc-number-hint');
/* submit btn input */
const submitButton = document.getElementById('submit-btn');
const continueBtn = document.getElementById('continue-btn');
continueBtn.addEventListener('click', () => {
  window.location.reload();
});
submitButton.addEventListener('click', (e) => {
  e.preventDefault();
  let confirmed = true;
  allInputField.forEach((input) => {
    if (input.value === '') {
      let inputId = input.getAttribute('id');
      let hintElement = document.getElementById(`${inputId}-hint`);
      if (input.getAttribute('id').includes('expiration-date')) {
        inputId === 'expiration-date-month' ? throwWarning(expDateFieldsetHint, "Can't be blank", expMonth) : throwWarning(expDateFieldsetHint, "Can't be blank", expYear);
      } else {
        throwWarning(hintElement, "Can't be blank", input);
      }
    } else {
      confirmed = true;
    }
  });

  if (confirmed) {
    formContainer.classList.add('submitAnimate');
    formContainer.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
      confirmationContainer.classList.add('confirmationAnimate');
      confirmationContainer.setAttribute('aria-hidden', 'false');
      confirmationContainer.style = 'pointer-events: initial;';
    }, 500);
  }
});

expMonth.addEventListener('keyup', () => {
  // making sure user can't go over two number length
  expMonth.value.length > 2 ? (expMonth.value = expMonth.value.slice(-2)) : '';
  // a small trick to always format numbers to 01...09...12
  expMonth.value.length === 1 ? (expMonth.value = '0' + expMonth.value) : '';
  if (Number(expMonth.value) > 12 || expMonth.value === '00') {
    throwWarning(expDateFieldsetHint, 'Invalid input', expMonth);
    // disable all following inputs
    disableFollowingInput(true);
    // disable submit button
    disableSubmitButton(true);
  } else {
    removeWarning(expDateFieldsetHint, expMonth);
    disableFollowingInput(false);
    disableSubmitButton(false);
  }
  displayInputOnCard('card-front_exMonth', '00', expMonth.value);
});
expYear.addEventListener('keyup', () => {
  // making sure user can't go over two number length
  expYear.value.length > 2 ? (expYear.value = expYear.value.slice(-2)) : '';
  // a small trick to always format numbers to 01...09...23..
  expYear.value.length === 1 ? (expYear.value = '0' + expYear.value) : '';
  if (expYear.value.length === 2) {
    if (!validExpDate(Number(expMonth.value), Number(expYear.value)) || expYear.value === '00') {
      throwWarning(expDateFieldsetHint, 'Invalid expiration date', expYear);
      // disable all following inputs
      disableFollowingInput(true);
      // disable submit button
      disableSubmitButton(true);
    } else {
      removeWarning(expDateFieldsetHint, expYear);
      disableFollowingInput(false);
      disableSubmitButton(false);
    }
  }
  displayInputOnCard('card-front_exYear', '00', expYear.value);
});

cvcNumber.addEventListener('keyup', () => {
  cvcNumber.value.length > 3 ? (cvcNumber.value = cvcNumber.value.slice(-3)) : '';
  if (cvcNumber.value === '000') {
    throwWarning(cvcNumberHint, 'Invalid input', cvcNumber);
    disableFollowingInput(true);
    disableSubmitButton(true);
  } else {
    removeWarning(cvcNumberHint, cvcNumber);
    disableFollowingInput(false);
    disableSubmitButton(false);
  }
  displayInputOnCard('card-front_cvc-number', '000', cvcNumber.value);
});

cardHolderName.addEventListener('keyup', (e) => {
  let onlyText = /^[a-zA-Z ]+$/.test(cardHolderName.value);
  let warningHint = 'Wrong format, text only';
  if (!onlyText) {
    e.key != 'Tab' ? throwWarning(cardHolderHint, warningHint, cardHolderName) : '';
    // disable all following inputs
    disableFollowingInput(true);
    // disable submit button
    disableSubmitButton(true);
  } else {
    removeWarning(cardHolderHint, cardHolderName);
    disableFollowingInput(false);
    disableSubmitButton(false);
  }
  // remove e.g at the start
  let cardHolderNameValue = cardHolderName.getAttribute('placeholder').slice(4);
  displayInputOnCard('card-front_card-holder', cardHolderNameValue, cardHolderName.value);
});

cardNumber.addEventListener('keyup', (e) => {
  let notNumbersOnly = /[^\d ]/g.test(cardNumber.value);
  let cardValid = checkCardCompany(cardNumber.value);
  let warningHint = !cardValid ? 'Invalid card number' : 'Wrong format, numbers only';
  if (e.key != 'Tab') {
    // when first focused using Tab it throw warning, this fixes it
    if (notNumbersOnly || !cardValid || cardNumber.value < 1) {
      throwWarning(cardNumberHint, warningHint, cardNumber);
      // disable all following inputs
      disableFollowingInput(true);
      // disable submit button
      disableSubmitButton(true);
    } else {
      cardNumber.value = cardNumberFormat(cardNumber.value);
      removeWarning(cardNumberHint, cardNumber);
      disableFollowingInput(false);
      disableSubmitButton(false);
    }
  }
  // remove e.g at the start
  let cardNumberValue = cardNumber.getAttribute('placeholder').slice(4);
  displayInputOnCard('card-front_card-number', cardNumberValue, cardNumber.value);
});

function throwWarning(hintElement, hintText, input) {
  input.setAttribute('aria-invalid', 'true');
  hintElement.setAttribute('aria-hidden', 'false');
  // change warning text depending on type of error
  input.value === '' ? (hintElement.innerHTML = "Can't be blank") : (hintElement.innerHTML = hintText);
  // show warning text
  hintElement.classList.remove('hidden');
  // show red border
  input.classList.add('error-border');
  ariaLiveMessageActivate(hintElement.innerHTML);
}

function removeWarning(hintElement, input) {
  hintElement.classList.add('hidden');
  input.classList.remove('error-border');
  hintElement.setAttribute('aria-hidden', 'true');
  input.setAttribute('aria-invalid', 'false');
}

function disableFollowingInput(disable) {
  if (disable) {
    document.querySelectorAll('input:not(.error-border)').forEach((input) => (input.disabled = true));
  } else {
    document.querySelectorAll('input:not(.error-border)').forEach((input) => (input.disabled = false));
  }
}

function disableSubmitButton(disableButton) {
  if (disableButton) {
    submitButton.disabled = true;
    submitButton.style = `
    cursor : not-allowed;
    background-color: var(--clr-neutral-200) !important;
    color: unset !important;
    `;
  } else {
    submitButton.disabled = false;
    submitButton.style = '';
  }
}

function ariaLiveMessageActivate(warningMesage) {
  ariaLiveMessage.innerHTML = warningMesage;
}

function displayInputOnCard(displayElementId, defaultInputValue, inputValue) {
  if (inputValue === '') {
    document.getElementById(displayElementId).innerHTML = defaultInputValue;
  } else {
    document.getElementById(displayElementId).innerHTML = inputValue;
  }
}

function cardNumberFormat(number) {
  // remove all spaces
  number = number.replaceAll(/[^\d]+/g, '');
  if (number.match(/(?:\d{4}()|\d*$)/g)) {
    return number
      .match(/(?:\d{4}()|\d*$)/g)
      .slice(0, -1)
      .join('  ');
  }
}

function checkCardCompany(cardNumber) {
  let companyCardNumberLabel = document.getElementById('card-company-label');
  // remove all spaces
  cardNumber = cardNumber.replaceAll(/[^\d]+/g, '');
  // All Visa card numbers start with a 4.
  // New cards have 16 digits. Old cards have 13.
  const regexVisa = /^4[0-9]{12}(?:[0-9]{3})?$/g;
  // MasterCard numbers either start with the numbers 51 through 55
  // or with the numbers 2221 through 2720. All have 16 digits.
  const regexMasterCard = /^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/g;
  // American Express card numbers start with 34 or 37 and have 15 digits.
  const regexAmericanExpress = /^3[47][0-9]{13}$/g;
  // Discover card numbers begin with 6011 or 65. All have 16 digits.
  const regexDiscover = /^6(?:011|5[0-9]{2})[0-9]{12}$/g;
  cardNumber.length === 0 ? setCompanyLogo('') : '';
  if (/^4\d*/g.test(cardNumber)) {
    setCompanyLogo('Visa');
    if (!regexVisa.test(cardNumber) && cardNumber.length > 16) {
      setCompanyLogo('');
      return false;
    }
  } else if (/^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)/g.test(cardNumber)) {
    setCompanyLogo('masterCard');
    if (!regexMasterCard.test(cardNumber) && cardNumber.length > 16) {
      setCompanyLogo('');
      return false;
    }
  } else if (/^3[47][0-9]/g.test(cardNumber)) {
    setCompanyLogo('americanExpress');
    if (!regexAmericanExpress.test(cardNumber) && cardNumber.length > 15) {
      setCompanyLogo('');
      return false;
    }
  } else if (/^6(?:011|5[0-9]{2})/g.test(cardNumber)) {
    setCompanyLogo('Discover');
    if (!regexDiscover.test(cardNumber) && cardNumber.length > 16) {
      setCompanyLogo('');
      return false;
    }
  }

  return true;

  function setCompanyLogo(companyName) {
    companyCardNumberLabel.setAttribute('data-card-company', companyName);
  }
}
function validExpDate(month, year) {
  let currentDate = new Date();
  // month count starts from zero for some reason lol
  let currentMonth = currentDate.getMonth() + 1;
  // get full year exmp 2023, turn it to string '2023' then get last digits by slice(-2) and finally turn it to a number again
  let currentYear = Number(currentDate.getFullYear().toString().slice(-2));
  if (year < currentYear) {
    return false;
  } else if (year === currentYear) {
    return month >= currentMonth;
  } else {
    return true;
  }
}

// credit card numbers have minimum numbers of 13 numbers
// this function insures card number input field is more or equals 13 numbers long
function insureCardNumberMinimum() {
  // we don't want to mistakenly throw warning when user decides to start somewhere else
  // so we don't check for blank
  if (cardNumber.value.length > 0 && cardNumber.value.length < 13) {
    throwWarning(cardNumberHint, 'Invalid input', cardNumber);
  }
}

window.addEventListener('click', () => {
  document.activeElement.getAttribute('id') != 'card-number' ? insureCardNumberMinimum() : '';
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Tab' && e.target.getAttribute('id') === 'card-number') {
    insureCardNumberMinimum();
  }
});
