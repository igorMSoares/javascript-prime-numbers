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

  try {
    isValidNumber(parsedValue);
  } catch (error) {
    throw new InvalidArgumentError(message);
  }

  return parsedValue;
}

const getNumberInput = elementSelector => $(elementSelector).val();

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
    for (let element of elementSelector) {
      inputArray.push(getNumberInput(element));
    }
    inputName = $(elementSelector[0]).attr('name').split(/-\w*$/)[0];
  } else {
    inputArray.push(getNumberInput(elementSelector));
    inputName = $(elementSelector).attr('name');
  }

  let resultArea = $(`p[id*="${inputName}"].js-result`);

  if (inputArray.some(value => value === '')) {
    resultArea.slideUp('slow');
  } else {
    try {
      let msg = fn(...inputArray, resultArea);

      resultArea.hide();
      resultArea.text(msg);
      resultArea.slideDown('slow');
    } catch (error) {
      Message.display('error', error.message, resultArea);
    }
  }
}

const start = () => {
  $('#verify-number-input').on('change', event => {
    handleInputChange(event.target, number => {
      number = validateInput(number);
      let result = cachedPrimes(number).isPrime;

      let msg = `${number} `;
      if (result === false) {
        msg += 'não ';
      }
      msg += 'é um número primo';

      return msg;
    });
  });

  $('#generate-list-p').on('change', event => {
    handleInputChange(
      ['#generate-list-from-input', '#generate-list-to-input'],
      (from, to) => {
        from = validateInput(from);
        to = validateInput(to);

        return primeNumbersListBetween(from, to).join(' ');
      }
    );
  });

  $('#generate-first-n-primes-p').on('change', event => {
    handleInputChange(event.target, (number, resultArea) => {
      number = validateInput(number);

      return firstNPrimes(number).join(' ');
    });
  });
};

start();
