describe('Smoke Test', () => {
  it('should load the home page', () => {
    cy.visit('/');
    cy.findByRole('heading', { name: /Bookshelf/i }).should('be.visible');
  });

  it('should navigate to the books page', () => {
    cy.visit('/');
    cy.findByRole('link', { name: /Books/i }).click();
    cy.url().should('include', '/books');
    cy.findByRole('heading', { name: /Your Books/i }).should('be.visible');
  });
});
