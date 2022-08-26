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

function validateInput(value) {
  let parsedValue = parseInt(value);

  try {
    isValidNumber(parsedValue);
  } catch (error) {
    throw new InvalidArgumentError(`Digite um número inteiro positivo.`);
  }

  return parsedValue;
}

const getNumberInput = elementSelector => $(elementSelector).val();

const handleInputChange = (elementSelector, fn) => {
  let inputArray = [];
  let inputName = undefined;

  if (Array.isArray(elementSelector)) {
    for (let element of elementSelector) {
      inputArray.push(getNumberInput(element));
    }
    inputName = $(elementSelector[0])
      .parent()
      .attr('for')
      .split('-from-input')[0];
  } else {
    inputArray.push(getNumberInput(elementSelector));
    inputName = $(elementSelector).parent().attr('for').split('-input')[0];
  }

  let resultArea = $(`p[id*="${inputName}"].js-result`);

  if (inputArray.some(value => value === '')) {
    resultArea.slideUp('slow');
  } else {
    let msg = fn(...inputArray, resultArea);

    resultArea.hide();
    resultArea.text(msg);
    resultArea.slideDown('slow');
  }
};

$('#verify-number-input').on('change', event => {
  handleInputChange(event.target, (number, resultArea) => {
    try {
      number = validateInput(number);
      let result = cachedPrimes(number).isPrime;

      let msg = `${number} `;
      if (result === false) {
        msg += 'não ';
      }
      msg += 'é um número primo';

      return msg;
    } catch (error) {
      Message.display('error', error.message, resultArea);
    }
  });
});

$('#generate-list-p').on('change', event => {
  handleInputChange(
    ['#generate-list-from-input', '#generate-list-to-input'],
    (from, to, resultArea) => {
      try {
        from = validateInput(from);
        to = validateInput(to);

        return primeNumbersListBetween(from, to).join(' ');
      } catch (error) {
        Message.display('error', error.message, resultArea);
      }
    }
  );
});

$('#generate-first-n-primes-p').on('change', event => {
  handleInputChange(event.target, (number, resultArea) => {
    try {
      number = validateInput(number);

      return firstNPrimes(number).join(' ');
    } catch (error) {
      Message.display('error', error.message, resultArea);
    }
  });
});
