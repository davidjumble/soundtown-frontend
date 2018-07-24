const { expect } = require('chai');

const { describe } = mocha;

describe('App', () => {
  it('loads the app', () => {
    cy.visit('');

    cy.get('.app');
  });
});
