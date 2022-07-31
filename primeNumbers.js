function isPrimeNumber(number) {
  if (number === 1 || number === 0 || number < 0) { return false; }

  const sqrt = Math.floor(Math.sqrt(number));
  var numbersList = [];

  for (i=2; i <= sqrt; i++) {
    numbersList.push(i);
  }

  var num = null;
  while (numbersList.length > 0) {
    num = numbersList.shift();

    if (isPrimeNumber(num)) {
      if (multipleOf(number, num)) {
        return false;
      } else {
        numbersList = numbersList.filter((n) => !multipleOf(num,n));
      }
    }

  }

  return true; // numbersList.length === 0
}


function multipleOf(num1, num2) {
  return (Math.max(num1, num2) % Math.min(num1, num2)) === 0 ? true : false;
}


function generatePrimes(from, to, listType="string") {
  if (!validate(from)[0]) { return validate(from)["message"]; }
  if (!validate(to)[0]) { return validate(to)["message"]; }

  var primes = [];
  for (let i=from; i<= to; i++) {
    if (isPrimeNumber(i)) {
      primes.push(i);
    }
  }

  if (listType == "string") {
    return primes.toString();

  } else {
    return primes;
  }
}


function verificaNumeroPrimo(num) {
  if (!validate(num)[0]) { return validate(num)["message"]; }

  var simPrimo = `O número ${num} é primo.`;
  var naoPrimo = `O número ${num} não é primo.`;

  return isPrimeNumber(num) ? simPrimo : naoPrimo;
}


function validate(num) {
  var response = { 0: true, "message": "" };

  if (!Number.isInteger(num) || num < 0) {
    response[0] = false;
    response["message"] = "Entrada inválida.\n"+
              "Apenas números inteiros positivos serão computados.";
  }
  return response;
}
