import {
  cachedPrimes,
  primeNumbersListBetween,
  firstNPrimes,
  InvalidArgumentError,
  isValidNumber,
} from '../primeNumbers.js';

const asyncTimeout = miliseconds => {
  return new Promise(resolve => {
    setTimeout(resolve, miliseconds);
  });
};

const LIMIT = 1_000_000;

class Message {
  static display(type, message, messageArea) {
    messageArea.text(`${message}`).hide();

    let isListResult = false;
    if (messageArea.hasClass('listResult')) {
      messageArea.removeClass('listResult');
      isListResult = true;
    }

    messageArea.addClass('msg');
    messageArea.addClass(type);

    messageArea.slideDown('slow', async () => {
      await asyncTimeout(2000);
      messageArea.slideUp('slow', () => messageArea.empty());
      await asyncTimeout(2000);

      messageArea.removeClass(type);
      messageArea.removeClass('msg');
      isListResult ? messageArea.addClass('listResult') : null;
    });
  }
}

function validateInput(value, message = 'Digite um número inteiro positivo.') {
  let parsedValue = parseInt(value);

  if (value.match(/\D+/)) {
    throw new InvalidArgumentError(message);
  }

  try {
    isValidNumber(parsedValue);
  } catch (error) {
    if (/([Nn]umber).+(too).+(large)/.test(error.message)) {
      const limit = +error.message.match(/\d+/);
      message = `Número muito grande. 
        Digite um número menor ou igual a ${limit.toLocaleString('pt-BR')}`;
    }
    throw new InvalidArgumentError(message);
  }

  return parsedValue;
}

const togglePeriod = (element, char) => {
  let punctuationMark = element.text();
  if (punctuationMark !== char) {
    element.text(char);
  }
};

function renderConfirmationArea(params, fn) {
  const sectionID = params.sectionID;

  $(`#${sectionID} .js-result`).text('').slideUp('slow');
  $(`#${sectionID} input`).prop('disabled', true);

  let confirmBtn = $('<button>')
    .attr({
      id: `${sectionID}-confirm-btn`,
      class: 'button',
      type: 'confirm',
      text: 'Confirmar',
    })
    .html('Confirmar')
    .on('click', event => handleBtnClick(event, params, fn));

  let cancelBtn = $('<button>')
    .attr({
      id: `${sectionID}-cancel-btn`,
      class: 'button',
      type: 'cancel',
      text: 'Cancelar',
    })
    .html('Cancelar')
    .on('click', event => handleBtnClick(event, params, fn));

  let span = $('<span>').addClass('btn-wrapper');
  span.append(confirmBtn).append(cancelBtn);

  let div = $('<div>')
    .attr({
      class: 'largeNumbersMsg msg error',
    })
    .html(
      `
      ATENÇÃO: número muito grande.<br />
      Esta operação poderá demorar alguns minutos.<br /><br />
      Tem certeza que deseja continuar?<br />
    `
    )
    .append(span);

  $(`#${sectionID}`).append(div);
}

function handleBtnClick(event, params, fn) {
  const action = $(event.target).attr('type');
  const sectionID = params.sectionID;

  $(`#${sectionID} input`).prop('disabled', false);
  $('div.largeNumbersMsg').remove();

  if (action === 'confirm') {
    $(`#${sectionID} .js-result`).text('Calculando...').slideDown('slow');
    window.setTimeout(() => {
      calculateAndDisplay(params, fn);
    }, 500);
  } else if (action === 'cancel') {
    cleanInput(sectionID);
  }
}

function cleanInput(sectionID) {
  $(`#${sectionID} input`).val('');
}

function calculateAndDisplay(params, fn) {
  const sectionID = params.sectionID;
  const resultArea = $(`#${sectionID} .js-result`);
  try {
    const msg = fn(...params.inputValuesArray, resultArea);

    resultArea.hide();
    resultArea.text(msg);
    togglePeriod($(`span[id*="${sectionID}"]`), ':');
    resultArea.slideDown('slow');
  } catch (error) {
    Message.display('error', error.message, resultArea);
  }
}

const hasLargeNumber = inputValues => {
  return inputValues.some(number => number >= LIMIT) ? true : false;
};

const getNumberToCalculate = number => {
  const digits = (number + '').length;
  const factor = 3 * 2 ** (digits - 1);

  return number * factor;
};

const handleInputChange = (sectionID, fn) => {
  let inputValuesArray = [];

  for (const input of $(`#${sectionID} input`)) {
    inputValuesArray.push($(input).val());
  }

  const resultArea = $(`#${sectionID} .js-result`);

  if (inputValuesArray.some(value => value === '')) {
    resultArea.slideUp('slow');
    togglePeriod($(`span[id*="${sectionID}"]`), '.');
  } else {
    try {
      const tmp = [];
      inputValuesArray.forEach(number => {
        tmp.push(validateInput(number));
      });
      inputValuesArray = tmp;
    } catch (error) {
      Message.display('error', error.message, resultArea);
      return false;
    }

    const valuesToCheckLimit =
      sectionID === 'generate-first-n-primes'
        ? [getNumberToCalculate(inputValuesArray[0])]
        : inputValuesArray;

    const action = hasLargeNumber(valuesToCheckLimit)
      ? renderConfirmationArea
      : calculateAndDisplay;

    action(
      {
        sectionID,
        inputValuesArray,
      },
      fn
    );
  }
};

const checkInputValidity = jQueryElement => {
  let value = jQueryElement.val();
  if (value !== '' && value.match(/\D+/) !== null) {
    return false;
  }
  return true;
};

function handleInputInput(
  elementSelector,
  msg = 'Digite um número inteiro positvo.'
) {
  if (!checkInputValidity($(elementSelector))) {
    $(elementSelector).get(0).setCustomValidity(msg);
    $(elementSelector).get(0).reportValidity();
    $(elementSelector).attr(
      'style',
      'border-color: var(--invalid-input-border)'
    );
  } else {
    $(elementSelector).get(0).setCustomValidity('');
    $(elementSelector).attr('style', 'border-color: var(--input-border)');
  }
}

const primalityCheck = (number, resultArea) => {
  let result = cachedPrimes(number).isPrime;

  let msg = `${number} `;
  if (result === false) {
    msg += 'não ';
    resultArea.removeClass('success');
  } else {
    resultArea.addClass('success');
  }
  msg += 'é um número primo';

  return msg;
};

const generateListOfPrimes = (from, to) =>
  primeNumbersListBetween(from, to).join(' ');

const listFirstNPrimes = number => firstNPrimes(number).join(' ');

const initKeydownEvent = inputs => {
  inputs.forEach((handler, sectionID) => {
    $(`#${sectionID} input`).keydown(event => {
      if (['Enter', 'Tab'].includes(event.key)) {
        handleInputChange(sectionID, handler);
      }
    });
  });
};

const initInputEvent = inputs => {
  for (const elementID of inputs.keys()) {
    $(`#${elementID} input`).on('input', event => {
      handleInputInput(event.target);
    });
  }
};

const initInputs = inputs => {
  initKeydownEvent(inputs);
  initInputEvent(inputs);
};

const start = () => {
  /**
   * @type {Map.<string, Function>}
   * keys -> ID of the <section> element corresponding to a operation
   * values -> A callback funtion wich performs the operation
   */
  const inputs = new Map([
    ['verify-number', primalityCheck],
    ['generate-list', generateListOfPrimes],
    ['generate-first-n-primes', listFirstNPrimes],
  ]);

  initInputs(inputs);
};

start();
