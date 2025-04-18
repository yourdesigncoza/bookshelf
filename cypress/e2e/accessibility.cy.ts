describe('Accessibility', () => {
  it('should support keyboard navigation', () => {
    cy.visit('/');
    
    // Tab to the first link
    cy.get('body').tab();
    
    // Skip link should be focused first
    cy.focused().should('contain.text', 'Skip to content');
    
    // Tab to the next element (should be a navigation link)
    cy.focused().tab();
    cy.focused().should('have.attr', 'role', 'link');
    
    // Press Enter to navigate
    cy.focused().type('{enter}');
    
    // Should navigate to the clicked link's destination
    cy.url().should('not.equal', '/');
  });
  
  it('should have proper heading structure', () => {
    cy.visit('/books');
    
    // Check for h1 heading
    cy.get('h1').should('exist');
    
    // Check that h1 is unique
    cy.get('h1').should('have.length', 1);
    
    // Check that headings are in order (no h3 without h2, etc.)
    cy.get('h2 + h4').should('not.exist');
    cy.get('h1 + h3').should('not.exist');
    cy.get('h2 + h4').should('not.exist');
  });
  
  it('should have proper ARIA attributes', () => {
    cy.visit('/books');
    
    // Check for aria-label on buttons without text
    cy.get('button:not(:has(span:visible)):not(:has(div:visible))').each(($el) => {
      cy.wrap($el).should('have.attr', 'aria-label');
    });
    
    // Check for aria-expanded on dropdown buttons
    cy.get('[aria-haspopup="true"]').should('have.attr', 'aria-expanded');
    
    // Check for aria-controls on tabs
    cy.get('[role="tab"]').should('have.attr', 'aria-controls');
  });
  
  it('should have sufficient color contrast', () => {
    // This is a visual test that Cypress can't fully automate
    // But we can check for the presence of contrast-related classes
    
    cy.visit('/');
    
    // Check for text color classes that provide sufficient contrast
    cy.get('.text-foreground').should('exist');
    cy.get('.text-muted-foreground').should('exist');
  });
  
  it('should have proper form labels', () => {
    cy.visit('/books/add');
    
    // Check that all inputs have associated labels
    cy.get('input, select, textarea').each(($el) => {
      const id = $el.attr('id');
      if (id) {
        cy.get(`label[for="${id}"]`).should('exist');
      } else {
        // If no ID, the input should be wrapped in a label
        cy.wrap($el).parents('label').should('exist');
      }
    });
  });
  
  it('should have proper focus indicators', () => {
    cy.visit('/');
    
    // Tab to the first focusable element
    cy.get('body').tab();
    
    // Check that the focused element has a visible focus style
    cy.focused().should('have.css', 'outline').and('not.equal', 'none');
    
    // Continue tabbing and check focus styles
    cy.focused().tab();
    cy.focused().should('have.css', 'outline').and('not.equal', 'none');
  });
  
  it('should handle error states accessibly', () => {
    cy.visit('/books/add');
    
    // Submit the form without filling required fields
    cy.findByRole('button', { name: /Add Book/i }).click();
    
    // Check that error messages are associated with inputs
    cy.get('[aria-invalid="true"]').should('exist');
    cy.get('[aria-describedby]').should('exist');
  });
});
