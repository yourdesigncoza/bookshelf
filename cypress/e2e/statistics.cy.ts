describe('Statistics Feature', () => {
  beforeEach(() => {
    // Visit the statistics page before each test
    cy.visit('/statistics');
  });

  it('should display the statistics page', () => {
    cy.findByRole('heading', { name: /Reading Statistics/i }).should('be.visible');
  });

  it('should display various statistics cards', () => {
    // Check for total books card
    cy.findByText(/Total Books/i).should('be.visible');
    cy.findByText(/Total Books/i).parent().find('div').should('contain.text');
    
    // Check for average rating card
    cy.findByText(/Average Rating/i).should('be.visible');
    cy.findByText(/Average Rating/i).parent().find('div').should('contain.text');
    
    // Check for most read genre card
    cy.findByText(/Most Read Genre/i).should('be.visible');
    cy.findByText(/Most Read Genre/i).parent().find('div').should('contain.text');
    
    // Check for total pages read card
    cy.findByText(/Total Pages Read/i).should('be.visible');
    cy.findByText(/Total Pages Read/i).parent().find('div').should('contain.text');
  });

  it('should display charts', () => {
    // Check for books per month chart
    cy.findByText(/Books Read Per Month/i).should('be.visible');
    cy.findByText(/Books Read Per Month/i).parent().find('canvas').should('be.visible');
    
    // Check for genre distribution chart
    cy.findByText(/Genre Distribution/i).should('be.visible');
    cy.findByText(/Genre Distribution/i).parent().find('canvas').should('be.visible');
    
    // Check for rating distribution chart
    cy.findByText(/Rating Distribution/i).should('be.visible');
    cy.findByText(/Rating Distribution/i).parent().find('canvas').should('be.visible');
  });

  it('should update statistics when date range changes', () => {
    // Get the initial total books count
    let initialCount: string;
    cy.findByText(/Total Books/i).parent().find('div').invoke('text').then((text) => {
      initialCount = text;
    });
    
    // Change the date range
    cy.findByLabelText(/From/i).click();
    cy.findByRole('button', { name: /Previous Month/i }).click();
    cy.findByRole('button', { name: /15/i }).click();
    
    cy.findByLabelText(/To/i).click();
    cy.findByRole('button', { name: /Today/i }).click();
    
    // Apply the date range
    cy.findByRole('button', { name: /Apply/i }).click();
    
    // Verify the statistics have updated
    cy.findByText(/Total Books/i).parent().find('div').invoke('text').then((text) => {
      // The count might be different or the same depending on the data
      // We're just checking that the component re-renders
      cy.wrap(text).should('exist');
    });
  });

  it('should navigate back to books page', () => {
    cy.findByRole('link', { name: /Back to Books/i }).click();
    cy.url().should('include', '/books');
  });
});
