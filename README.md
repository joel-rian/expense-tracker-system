# 💰 Sistema de Gestão Financeira Pessoal

## Descrição do Projeto

Desenvolvimento de um sistema web para Gestão Financeira Pessoal, permitindo que o usuário adicione, visualize e categorize transações (receitas e despesas). O objetivo é fornecer uma ferramenta simples e eficaz para que as pessoas tenham **maior controle e clareza** sobre suas finanças.

## 🎯 Desafio

O desafio foi criar uma aplicação front-end que gerenciasse dados de forma persistente e intuitiva, simulando a funcionalidade de um aplicativo de controle financeiro sem a necessidade de um backend complexo.

## ✨ Solução: Análise de Pontos Fortes do JavaScript

A lógica implementada no JavaScript demonstra um desenvolvimento robusto e focado em usabilidade:

1.  **Persistência de Dados (Local Storage):** O uso do `localStorage` para salvar e carregar as transações (`setItensBD`, `getItensBD`) é um ponto forte. Isso garante que os dados do usuário permaneçam salvos entre as sessões, simulando a persistência de um banco de dados e proporcionando uma experiência de usuário confiável.
2.  **Modularidade e Organização:** O código é dividido em funções claras (`loadItens`, `insertItem`, `deleteItem`, `updateTotals`), o que facilita a manutenção, a leitura e a escalabilidade do projeto.
3.  **Manipulação Dinâmica do DOM:** O uso eficiente de `document.createElement` e `appendChild` dentro da função `insertItem` demonstra habilidade em manipular o DOM de forma dinâmica e performática para construir a tabela de histórico.
4.  **Cálculo de Métricas Chave:** A função `updateTotals` calcula e exibe métricas financeiras essenciais (Receita Total, Despesa Total e Saldo), transformando dados brutos em informações úteis para o usuário.
5.  **Validação de Entrada:** A verificação de campos vazios (`if (desc.value === '' || amount.value === '' || type.value === '')`) garante a integridade dos dados antes de salvar a transação.

## 🛠️ Tecnologias Utilizadas

| Categoria | Tecnologias |
| :--- | :--- |
| **Front-end** | HTML5, CSS3, JavaScript |
| **Persistência** | Local Storage (Web Storage API) |
| **Lógica** | Manipulação do DOM, Estruturas de Dados (Arrays de Objetos) |

## 📈 Resultados Esperados

O sistema permite que o usuário:

*   **Tome Decisões Informadas:** Ao visualizar o saldo e as métricas, o usuário pode tomar decisões financeiras mais conscientes.
*   **Controle Detalhado:** O histórico de transações oferece um registro detalhado de receitas e despesas.
*   **Melhoria da Usabilidade:** A interface simples e a persistência de dados garantem uma experiência de controle financeiro eficaz.

## 🔗 Acesso ao Projeto

https://joel-rian.github.io/MinhasFinancas/

---
*Desenvolvido por Yerijhon Rian*
