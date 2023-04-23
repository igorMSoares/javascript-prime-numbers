import { expect } from 'chai';
import { strict as assert } from 'assert';
import {
  isValidNumber,
  InvalidArgumentError,
  cachedPrimes,
  primeNumbersUpTo,
  primeNumbersListBetween,
  firstNPrimes,
} from '../primeNumbers.js';

describe('Prime number verifier and prime numbers list generator', () => {
  describe('cachedPrimes().isPrime', () => {
    it('should verify if a given number is prime', () => {
      assert.equal(cachedPrimes(2).isPrime, true);
      assert.equal(cachedPrimes(3).isPrime, true);
      assert.equal(cachedPrimes(5).isPrime, true);
      assert.equal(cachedPrimes(7).isPrime, true);
      assert.equal(cachedPrimes(11).isPrime, true);
      assert.equal(cachedPrimes(59).isPrime, true);
      assert.equal(cachedPrimes(71).isPrime, true);
      assert.equal(cachedPrimes(149).isPrime, true);
      assert.equal(cachedPrimes(9).isPrime, false);
      assert.equal(cachedPrimes(4).isPrime, false);
      assert.equal(cachedPrimes(50).isPrime, false);
      assert.equal(cachedPrimes(55).isPrime, false);
      assert.equal(cachedPrimes(33).isPrime, false);
      assert.equal(cachedPrimes(21).isPrime, false);
      assert.equal(cachedPrimes(79).isPrime, true);
    });
  });
  describe('cachedPrimes', () => {
    it(`should use cache to verify if a number is prime`, () => {
      assert.equal(cachedPrimes(2).isPrime, true);
      assert.equal(cachedPrimes(2, false).isPrime, true);
      assert.equal(cachedPrimes(3).isPrime, true);
      assert.equal(cachedPrimes(3, false).isPrime, true);
      assert.equal(cachedPrimes(5).isPrime, true);
      assert.equal(cachedPrimes(7).isPrime, true);
      assert.equal(cachedPrimes(7, false).isPrime, true);
      assert.equal(cachedPrimes(11).isPrime, true);
      assert.equal(cachedPrimes(11, false).isPrime, true);
      assert.equal(cachedPrimes(59).isPrime, true);
      assert.equal(cachedPrimes(71).isPrime, true);
      assert.equal(cachedPrimes(149).isPrime, true);
      assert.equal(cachedPrimes(149, false).isPrime, true);
      assert.equal(cachedPrimes(9).isPrime, false);
      assert.equal(cachedPrimes(9, false).isPrime, false);
      assert.equal(cachedPrimes(4).isPrime, false);
      assert.equal(cachedPrimes(4, false).isPrime, false);
      assert.equal(cachedPrimes(50).isPrime, false);
      assert.equal(cachedPrimes(50, false).isPrime, false);
      assert.equal(cachedPrimes(55).isPrime, false);
      assert.equal(cachedPrimes(55, false).isPrime, false);
      assert.equal(cachedPrimes(33).isPrime, false);
      assert.equal(cachedPrimes(21).isPrime, false);
      assert.equal(cachedPrimes(79).isPrime, true);
    });
  });
  describe('primeNumbersUpTo', () => {
    it(`display a list of prime numbers up to a limit, using the cache`, () => {
      expect(primeNumbersUpTo(2)).to.deep.equal([2]);
      expect(primeNumbersUpTo(3)).to.deep.equal([2, 3]);
      expect(primeNumbersUpTo(5)).to.deep.equal([2, 3, 5]);
      expect(primeNumbersUpTo(11)).to.deep.equal([2, 3, 5, 7, 11]);
      expect(primeNumbersUpTo(1010)).to.deep.equal([
        2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67,
        71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139,
        149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223,
        227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293,
        307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383,
        389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463,
        467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569,
        571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647,
        653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743,
        751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839,
        853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941,
        947, 953, 967, 971, 977, 983, 991, 997, 1009,
      ]);
    });
  });

  describe('primeNumberListBetween', () => {
    it('generates a list of prime numbers between two numbers', () => {
      expect(primeNumbersListBetween(0, 0)).to.deep.equal([]);
      expect(primeNumbersListBetween(0, 1)).to.deep.equal([]);
      expect(primeNumbersListBetween(0, 2)).to.deep.equal([2]);
      expect(primeNumbersListBetween(0, 11)).to.deep.equal([2, 3, 5, 7, 11]);
      expect(primeNumbersListBetween(2, 11)).to.deep.equal([2, 3, 5, 7, 11]);
      expect(primeNumbersListBetween(0, 12)).to.deep.equal([2, 3, 5, 7, 11]);
      expect(primeNumbersListBetween(2, 12)).to.deep.equal([2, 3, 5, 7, 11]);
      expect(primeNumbersListBetween(4, 12)).to.deep.equal([5, 7, 11]);
    });
  });

  describe('firstNPrimes', () => {
    it('generates a list with the first N primes', () => {
      expect(firstNPrimes(0)).to.deep.equal([]);
      expect(firstNPrimes(1)).to.deep.equal([2]);
      expect(firstNPrimes(2)).to.deep.equal([2, 3]);
      expect(firstNPrimes(10)).to.deep.equal([
        2, 3, 5, 7, 11, 13, 17, 19, 23, 29,
      ]);
    });
  });
});

describe('Function parameters validations and error handling', () => {
  describe('validation function', () => {
    it('throws an error if the argument is not a number type nor a integer >=0', () => {
      expect(() => isValidNumber('string')).to.throw(InvalidArgumentError);
      expect(() => isValidNumber([])).to.throw(InvalidArgumentError);
      expect(() => isValidNumber({})).to.throw(InvalidArgumentError);
      expect(() => isValidNumber(-1)).to.throw(InvalidArgumentError);

      expect(() => isValidNumber('string')).to.throw('should be a number');
      expect(() => isValidNumber([])).to.throw('should be a number');
      expect(() => isValidNumber({})).to.throw('should be a number');
      expect(() => isValidNumber(-1)).to.throw('positive integers');

      expect(() => isValidNumber(0)).to.not.throw(InvalidArgumentError);
      expect(() => isValidNumber(2)).to.not.throw(InvalidArgumentError);
    });
  });

  describe('cachedPrimes() number validation', () => {
    it('throws an error if the argument is not a number type nor a integer >=0', () => {
      expect(() => cachedPrimes('2')).to.throw(InvalidArgumentError);
      expect(() => cachedPrimes('2')).to.throw('should be a number');
      expect(() => cachedPrimes([])).to.throw(InvalidArgumentError);
      expect(() => cachedPrimes([])).to.throw('should be a number');
      expect(() => cachedPrimes({})).to.throw(InvalidArgumentError);
      expect(() => cachedPrimes({})).to.throw('should be a number');
      expect(() => cachedPrimes(-1)).to.throw(InvalidArgumentError);
      expect(() => cachedPrimes(-1)).to.throw('positive integers');

      expect(() => cachedPrimes(2)).to.not.throw(InvalidArgumentError);
      expect(() => cachedPrimes(3)).to.not.throw(InvalidArgumentError);
      expect(() => cachedPrimes(4)).to.not.throw(InvalidArgumentError);
    });
  });

  describe('firstNPrimes() number validation', () => {
    it('throws an error if the argument is not a number type nor a integer >=0', () => {
      expect(() => firstNPrimes('2')).to.throw(InvalidArgumentError);
      expect(() => firstNPrimes('2')).to.throw('should be a number');
      expect(() => firstNPrimes([])).to.throw(InvalidArgumentError);
      expect(() => firstNPrimes([])).to.throw('should be a number');
      expect(() => firstNPrimes({})).to.throw(InvalidArgumentError);
      expect(() => firstNPrimes({})).to.throw('should be a number');
      expect(() => firstNPrimes(-1)).to.throw(InvalidArgumentError);
      expect(() => firstNPrimes(-1)).to.throw('positive integers');

      expect(() => firstNPrimes(2)).to.not.throw(InvalidArgumentError);
      expect(() => firstNPrimes(3)).to.not.throw(InvalidArgumentError);
      expect(() => firstNPrimes(4)).to.not.throw(InvalidArgumentError);
    });
  });
});
