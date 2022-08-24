import {
  isPrimeNumberV3,
  primeNumbersListBetween,
  firstNPrimes,
} from './primeNumbers.js';

$('#verify-number-input').on('change', event => {
  let input = $(event.target);
  let number = input.val();
  if (number === '') {
    $('#verify-number-result-p').hide();
  } else {
    let result = isPrimeNumberV3(number);

    let msg = `${number} `;
    if (result === false) {
      msg += 'não ';
    }
    msg += 'é um número primo.';

    $('#verify-number-result-p').hide();
    $('#verify-number-result-p').text(msg);
    $('#verify-number-result-p').slideDown('slow');
  }
});

const validateInput = input => {
  $('#generate-list-result-p').text('Preencha todos os campos');
};

const emptyInput = element => {
  let isEmpty = false;
  element.each((i, inputElement) => {
    if ($(inputElement).val() === '') {
      validateInput($(element));
      isEmpty = true;
    }
  });
  return isEmpty;
};

$('#generate-list-p').on('change', event => {
  if (!emptyInput($(`#generate-list-p .generate-list-input`))) {
    let inputFrom = $('#generate-list-from-input');
    let inputTo = $('#generate-list-to-input');
    let from = inputFrom.val();
    let to = inputTo.val();

    let result = primeNumbersListBetween(from, to);

    $('#generate-list-result-p').hide();
    $('#generate-list-result-p').text(result.join(' '));
    $('#generate-list-result-p').slideDown('slow');
  }
});

$('#generate-first-n-primes-p').on('change', event => {
  if (!emptyInput($(event.target))) {
    let number = $(event.target).val();

    let result = firstNPrimes(number);
    $('#generate-first-n-primes-result-p').hide();
    $('#generate-first-n-primes-result-p').text(result.join(' '));
    $('#generate-first-n-primes-result-p').slideDown('slow');
  }
});
