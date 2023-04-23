## Verificador de Números Primos

Algumas funções para testar se um número é primo ou gerar uma lista de números primos.

Criado com o intuito de praticar a linguagem Javascript. :nerd_face:

### Descrição

---

O algoritmo usado para implementar a função de teste de número primo faz uso do
[_Crivo de Erastóstenes_](https://pt.wikipedia.org/wiki/Crivo_de_Erat%C3%B3stenes), no qual para descobrir se um número **N** é primo
devemos testar se ele é **divisível por algum número primo menor que N**.

No entanto, implementei uma variação mais eficiente, na qual somente é
necessário testar a divisibilidade de N com os números primos menores ou
iguais a **raiz quadrada de N**.

Outro característica desse algoritmo que impacta diretamenta
na eficiência é que: ao descobrir um número primo na lista de números
menores ou iguais a raiz quadrada de N, excluímos da lista todos os
múltiplos desse número primo, reduzindo consideravelmente a lista a cada
número primo.

### Limitações

---

Dada a característica recursiva desse algoritmo, apesar da eficiência
proporcional a _Nlog(logN)_, o uso de memória se torna excessivo para
números com mais de **8 dígitos**.

### Como usar

---

Acesse [aqui](https://igormsoares.github.io/javascript-prime-numbers/) a interface web para:

- Verificar se um número é primo
- Gerar lista de primos entre dois números
- Gerar lista dos N primeiros números primos
