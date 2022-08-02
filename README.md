## Verificador de Números Primos

Algumas funções para testar se um número é primo ou gerar uma lista de números primos.

Criado com o intuito de praticar a linguagem Javascript. :nerd_face:


### Descrição
-------

O algoritmo usado para implementar a função de teste de número primo faz uso do
[*Crivo de Erastóstenes*](https://pt.wikipedia.org/wiki/Crivo_de_Erat%C3%B3stenes), no qual para descobrir se um número **N** é primo
devemos testar se ele é **divisível por algum número primo menor que N**.

No entanto, implementei uma variação mais eficiente, na qual somente é
necessário testar a divisibilidade  de N com os números primos menores ou
iguais a **raiz quadrada de N**.

Outro característica desse algoritmo que impacta diretamenta
na eficiência é que: ao descobrir um número primo na lista de números
menores ou iguais a raiz quadrada de N, excluímos da lista todos os
múltiplos desse número primo, reduzindo consideravelmente a lista a cada
número primo.


### Eficiência e limitações
----------

Dada a característica recursiva desse algoritmo, apesar da eficiência
proporcional a *Nlog(logN)*, o uso de memória se torna excessivo para
números com mais de **8 dígitos**.

Em um notebook com
processador Dual Core 3GHz, levou menos de **7 segundos** para
gerar uma lista com os **664.579** números primos de 2 até 10 milhões, usando a função [*generatePrimeNumbersList(from, to)*](#generate-primes).


### Como usar
-----------

- **Opção 1:** Acesse [aqui](https://iguhsoares.github.io/javascript-prime-numbers/) a página do repositório e use o console web do seu navegador para chamar as funções.

  ![Usando as funções a partir do console web](https://i.imgur.com/v4Bgh1h.png)

- **Opção 2:** Importar o arquivo javascript *primeNumbers.js* e rodar as funções da forma como você preferir.

  ```html
  <!-- importar o arquivo direto do repositório remoto: -->
  <script src="https://iguhsoares.github.io/javascript-prime-numbers/primeNumbers.js"></script>

  ```

**To-do:** Interface Web para rodar as funções de forma mais user friendly.


### Documentação
----------

- <h6 id="is-prime-number"><i>verifyPrimeNumber(number, upTo=null, outputType="string")</i>:</h6>

  Se o parâmetro *upTo* for omitido, a função devolve *true* se *number* for primo ou *false* caso contrário.

  ```Javascript
  verifyPrimeNumber(13);
  >> true

  verifyPrimeNumber(10);
  >> false
  ```

  Caso seja passado um número inteiro positivo **N** no segundo parâmetro, a função retorna uma lista com os **N** primeiros números primos. O tipo de retorno pode ser alterado para "array" no terceiro parâmetro.

  ```Javascript
  verifyPrimeNumber(0,10);
  >> "2, 3, 5, 7"

  verifyPrimeNumber(0,10,"array");
  >> Array(4) [ 2, 3, 5, 7 ]
  ```

- ###### *multipleOf(num1, num2):*
  Verifica se um número é múltiplo do outro. A ordem dos parâmetros não importa.

  ```Javascript
  multipleOf(2,4);
  >> true

  multipleOf(10,3);
  >> false
  ```

- <h6 id="generate-primes"><i>generatePrimeNumbersList(from, to, outputType="string")</i></h6>

  Gera uma lista de números primos maiores ou iguais a **from** e menores ou iguais a **to**.
  - Por default, retorna a lista no formato *string*, a menos que especificado <i>"array"</i> no terceiro parâmetro.

  ```Javascript
  generatePrimeNumbersList(20, 50);
  >> "23, 29, 31, 37, 41, 43, 47"

  generatePrimeNumbersList(20, 50, "array");
  >> Array(7) [ 23, 29, 31, 37, 41, 43, 47 ]
  ```

- ###### *verificaNumeroPrimo(num):*
  Um wrapper para a função [*verifyPrimeNumber()*](#is-prime-number), com mensagem em português.

  ```Javascript
  verificaNumeroPrimo(1199);
  >> "O número 1199 não é primo."

  verificaNumeroPrimo(2347);
  >> "O número 2347 é primo."
  ```

- ###### *validate(num):*
  Função auxiliar que testa se *num* é realmente um **número inteiro** e **positivo**.
  - Retorna um objeto em que o índice *0* é **true** ou **false** e o índice *\"message\"* contém a **mensagem de erro**, quando houver.

  ```Javascript
  validate(13);
  >> { 0: true, message: "" }

  validate("qualquer outra coisa");
  >> { 0: false, message: "Entrada inválida.\nApenas números inteiros positivos serão computados." }
  ```

- ###### *InvalidArgumentException(message):*
  Usada internamente para lançar uma *InvalidArgumentException*, no caso de alguma função receber um argumento inválido.
