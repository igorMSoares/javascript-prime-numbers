class InvalidArgumentError extends Error {
  constructor(message) {
    super();
    this.message = message;
    this.name = 'InvalidArgumentError';
  }
}

function multipleOf(num1, num2) {
  return Math.max(num1, num2) % Math.min(num1, num2) === 0;
}

const arrayToObject = array => {
  const obj = {};
  for (const n of array) {
    obj[n] = n;
  }

  return obj;
};

function testPrimality(number, exportPrimesList = false, primesList = false) {
  if (!exportPrimesList && number <= 1) {
    return false;
  }
  if (!exportPrimesList && number !== 2 && number % 2 === 0) {
    return false;
  }

  primesList = primesList || {};

  let numbersToTest = [2];
  for (let n = 3; n <= number; n += 2) {
    numbersToTest.push(n);
  }

  const limit = number ** 0.5;
  for (let i = 0; numbersToTest[i] <= limit; i++) {
    const num = numbersToTest[i];

    if (primesList[num] || testPrimality(num, true, primesList)) {
      if (!exportPrimesList && multipleOf(number, num)) {
        return false;
      }
      primesList[num] = num;
      numbersToTest = numbersToTest.filter(n => !multipleOf(num, n));
      i = -1;
    }
  }

  const lastPrimeInTheList = numbersToTest.pop();
  numbersToTest.push(lastPrimeInTheList);

  primesList = { ...primesList, ...arrayToObject(numbersToTest) };

  const isPrime = !!primesList[number];

  return exportPrimesList
    ? { isPrime, primesList, lastPrimeInTheList }
    : isPrime;
}

const memoizePrimesList = () => {
  let primeNumbersCache = {};
  let lastPrimeInTheList = null;

  return number => {
    isValidNumber(number);
    let result = {
      primesList: primeNumbersCache,
      isPrime: false,
      lastPrimeInTheList,
    };

    if (primeNumbersCache[number]) {
      result.isPrime = true;
      return result;
    }

    if (lastPrimeInTheList && number < lastPrimeInTheList) {
      return result;
    }

    result = testPrimality(number, true, primeNumbersCache);
    primeNumbersCache = result.primesList;
    lastPrimeInTheList = result.lastPrimeInTheList;

    return result;
  };
};

const cachedPrimes = memoizePrimesList();

const primeNumbersUpTo = number => {
  const { primesList } = cachedPrimes(number);

  return Object.values(primesList).filter(n => n <= number);
};

const setsDifference = (setA, setB) => {
  const result = new Set(setA);

  for (const n of setB) {
    if (setA.has(n)) {
      result.delete(n);
    } else {
      result.add(n);
    }
  }

  return result;
};

function primeNumbersListBetween(from, to) {
  const list1 = new Set(primeNumbersUpTo(from));
  const list2 = new Set(primeNumbersUpTo(to));

  const result = [...setsDifference(list1, list2)];
  const min = Math.min(from, to);

  if (cachedPrimes(min).isPrime) {
    result.unshift(min);
  }

  return result;
}

function firstNPrimes(number) {
  isValidNumber(number);
  if (number === 0) {
    return [];
  }
  const digits = (number + '').length;
  const weight = digits > 3 ? 1 : 3;
  const factor = weight * 2 ** (digits - 1);

  const listOfPrimes = primeNumbersUpTo(number * factor);

  return listOfPrimes.slice(0, number);
}

function isValidNumber(number) {
  let message = '';
  let limit = 20_000_000;

  if (typeof number !== 'number') {
    message = `Argument should be a number. Current type: ${typeof number}`;
    throw new InvalidArgumentError(message);
  }
  if (!Number.isInteger(number) || number < 0) {
    message = `Only positive integers are allowed. Current value: ${number}`;
    throw new InvalidArgumentError(message);
  }
  if (number > limit) {
    message = `Number too large. Only numbers less than or equal to ${limit} are allowed`;
    throw new InvalidArgumentError(message);
  }

  return true;
}

export {
  primeNumbersUpTo,
  cachedPrimes,
  primeNumbersListBetween,
  firstNPrimes,
  InvalidArgumentError,
  isValidNumber,
};
