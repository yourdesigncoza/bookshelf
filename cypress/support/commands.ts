/// <reference types="cypress" />
import '@testing-library/cypress/add-commands';

// This file can be used to add custom commands to Cypress

// Example custom command:
// Cypress.Commands.add('login', (email, password) => {
//   cy.visit('/login');
//   cy.findByLabelText('Email').type(email);
//   cy.findByLabelText('Password').type(password);
//   cy.findByRole('button', { name: /Sign in/i }).click();
// });

// Add custom command for clearing and typing in an input field
Cypress.Commands.add('clearAndType', { prevSubject: 'element' }, (subject, text) => {
  cy.wrap(subject).clear();
  cy.wrap(subject).type(text);
  return cy.wrap(subject);
});

// Add custom command for checking if an element contains text
Cypress.Commands.add('containsText', { prevSubject: 'element' }, (subject, text) => {
  cy.wrap(subject).should('contain.text', text);
  return cy.wrap(subject);
});

// Add custom command for waiting for an API request to complete
Cypress.Commands.add('waitForApi', (method, url) => {
  cy.intercept(method, url).as('apiRequest');
  return cy.wait('@apiRequest');
});

// Declare the custom commands for TypeScript
declare global {
  namespace Cypress {
    interface Chainable {
      // login(email: string, password: string): Chainable<Element>;
      clearAndType(text: string): Chainable<Element>;
      containsText(text: string): Chainable<Element>;
      waitForApi(method: string, url: string): Chainable<Element>;
    }
  }
}
