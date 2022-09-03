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

const getInputValue = elementSelector => $(elementSelector).val();

const togglePeriod = (element, char) => {
  let punctuationMark = element.text();
  if (punctuationMark !== char) {
    element.text(char);
  }
};

function renderConfirmationArea(params, fn) {
  params.resultArea.text('').slideUp('slow');
  let sectionID = params.inputName;
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
  let action = $(event.target).attr('type');
  $(`#${params.inputName} input`).prop('disabled', false);
  $('div.largeNumbersMsg').remove();

  if (action === 'confirm') {
    params.resultArea.text('Calculando...').slideDown('slow');
    window.setTimeout(() => {
      calculateAndDisplay(params, fn);
    }, 500);
  } else if (action === 'cancel') {
    cleanInput(params.inputName);
  }
}

function cleanInput(sectionName) {
  $(`#${sectionName} input`).val('');
}

function calculateAndDisplay(params, fn) {
  let inputArray = params.inputArray;
  let resultArea = params.resultArea;
  let inputName = params.inputName;
  try {
    let msg = fn(...inputArray, resultArea);

    resultArea.hide();
    resultArea.text(msg);
    togglePeriod($(`span[id*="${inputName}"]`), ':');
    resultArea.slideDown('slow');
  } catch (error) {
    Message.display('error', error.message, resultArea);
  }
}

/**
 * Encapsulates operations performed on input change
 *
 * @function handleInputChange
 * @typedef {Object} jQuerySelector -
 *  Any valid Selector, as a string or a DOM Element
 * @typedef {Object} jQuery -
 *  Objets created using jQuery() or $()
 * @params {jQuerySelector|jQuerySelector[]} elementSelector -
 *  If there's more than one input to handle,
 *  they're passed as an array of Selectors
 * @params {function (number,[number],jQuery):string} fn -
 *  Callback function wich performs actual operations with the input value
 */
function handleInputChange(elementSelector, fn) {
  let inputArray = [];
  let inputName = undefined;

  if (Array.isArray(elementSelector)) {
    elementSelector.forEach(element => {
      inputArray.push(getInputValue(element));
    });

    /** @type {string} - The name attribute of the input tag,
     *    corresponding to the action being performed. In case there are more than
     *    one input for the same action, each name attribute must have a '-something'
     *    at the end to differentiate each input
     */
    inputName = $(elementSelector[0]).attr('name').split(/-\w*$/)[0];
  } else {
    inputArray.push(getInputValue(elementSelector));
    inputName = $(elementSelector).attr('name');
  }

  let resultArea = $(`p[id*="${inputName}"].js-result`);

  if (inputArray.some(value => value === '')) {
    resultArea.slideUp('slow');
    togglePeriod($(`span[id*="${inputName}"]`), '.');
  } else {
    let largeNumbers = inputArray.filter(value => value >= LIMIT);

    if (inputName === 'generate-first-n-primes') {
      let digits = (inputArray[0] + '').length;
      let factor = 3 * 2 ** (digits - 1);
      let numberToCalculate = inputArray[0] * factor;
      if (numberToCalculate >= LIMIT) {
        largeNumbers.push(inputArray[0]);
      }
    }

    if (largeNumbers.length > 0) {
      renderConfirmationArea(
        {
          inputName,
          inputArray,
          resultArea,
        },
        fn
      );
    } else {
      calculateAndDisplay(
        {
          inputName,
          inputArray,
          resultArea,
        },
        fn
      );
    }
  }
}

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
  number = validateInput(number);
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

const generateListOfPrimes = (from, to) => {
  from = validateInput(from);
  to = validateInput(to);

  return primeNumbersListBetween(from, to).join(' ');
};

const listFirstNPrimes = number => {
  number = validateInput(number);

  return firstNPrimes(number).join(' ');
};

function initKeydownEvent(inputs) {
  inputs.forEach((handler, elementID) => {
    $(elementID).keydown(event => {
      const [callback, target] = Array.isArray(handler)
        ? handler
        : [handler, event.target];

      if (['Enter', 'Tab'].includes(event.key)) {
        handleInputChange(target, callback);
      }
    });
  });
}

function initInputEvent(inputs) {
  for (const elementID of inputs.keys()) {
    $(`${elementID} input`).on('input', event => {
      handleInputInput(event.target);
    });
  }
}

const initInputs = inputs => {
  initKeydownEvent(inputs);
  initInputEvent(inputs);
};

const start = () => {
  /**
   * @type {Map.<string, Function|Array[Function, Array[string]]}
   * keys -> ID of the element to attach the eventListener
   * values -> A callback or an Array: [callback, inputIDs[]]
   */
  const inputs = new Map([
    ['#verify-number', primalityCheck],
    [
      '#generate-list',
      [
        generateListOfPrimes,
        ['#generate-list-from-input', '#generate-list-to-input'],
      ],
    ],
    ['#generate-first-n-primes', listFirstNPrimes],
  ]);

  initInputs(inputs);
};

start();
