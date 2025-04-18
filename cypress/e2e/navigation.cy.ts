describe('Navigation and Layout', () => {
  beforeEach(() => {
    // Visit the home page before each test
    cy.visit('/');
  });

  it('should have a working navbar', () => {
    // Check that the navbar is visible
    cy.findByRole('navigation').should('be.visible');
    
    // Check that the logo is visible
    cy.findByAltText(/Bookshelf Logo/i).should('be.visible');
    
    // Check that the navigation links are visible
    cy.findByRole('link', { name: /Home/i }).should('be.visible');
    cy.findByRole('link', { name: /Books/i }).should('be.visible');
    cy.findByRole('link', { name: /Statistics/i }).should('be.visible');
    cy.findByRole('link', { name: /Settings/i }).should('be.visible');
  });

  it('should navigate to different pages', () => {
    // Navigate to Books page
    cy.findByRole('link', { name: /Books/i }).click();
    cy.url().should('include', '/books');
    cy.findByRole('heading', { name: /Your Books/i }).should('be.visible');
    
    // Navigate to Statistics page
    cy.findByRole('link', { name: /Statistics/i }).click();
    cy.url().should('include', '/statistics');
    cy.findByRole('heading', { name: /Reading Statistics/i }).should('be.visible');
    
    // Navigate to Settings page
    cy.findByRole('link', { name: /Settings/i }).click();
    cy.url().should('include', '/settings');
    cy.findByRole('heading', { name: /Settings/i }).should('be.visible');
    
    // Navigate back to Home page
    cy.findByRole('link', { name: /Home/i }).click();
    cy.url().should('not.include', '/books');
    cy.url().should('not.include', '/statistics');
    cy.url().should('not.include', '/settings');
  });

  it('should have a working theme toggle', () => {
    // Find and click the theme toggle
    cy.findByRole('button', { name: /Toggle theme/i }).click();
    
    // Check that the theme has changed
    cy.get('html').should('have.class', 'dark');
    
    // Toggle back
    cy.findByRole('button', { name: /Toggle theme/i }).click();
    
    // Check that the theme has changed back
    cy.get('html').should('not.have.class', 'dark');
  });

  it('should have a responsive layout', () => {
    // Test on mobile viewport
    cy.viewport('iphone-x');
    
    // Check that the mobile menu button is visible
    cy.findByRole('button', { name: /Open menu/i }).should('be.visible');
    
    // Open the mobile menu
    cy.findByRole('button', { name: /Open menu/i }).click();
    
    // Check that the navigation links are visible in the mobile menu
    cy.findByRole('link', { name: /Home/i }).should('be.visible');
    cy.findByRole('link', { name: /Books/i }).should('be.visible');
    cy.findByRole('link', { name: /Statistics/i }).should('be.visible');
    cy.findByRole('link', { name: /Settings/i }).should('be.visible');
    
    // Close the mobile menu
    cy.findByRole('button', { name: /Close menu/i }).click();
    
    // Test on tablet viewport
    cy.viewport('ipad-2');
    
    // Check that the navigation is adapted for tablet
    cy.findByRole('navigation').should('be.visible');
    
    // Test on desktop viewport
    cy.viewport(1280, 720);
    
    // Check that the navigation is adapted for desktop
    cy.findByRole('navigation').should('be.visible');
    cy.findByRole('link', { name: /Home/i }).should('be.visible');
    cy.findByRole('link', { name: /Books/i }).should('be.visible');
    cy.findByRole('link', { name: /Statistics/i }).should('be.visible');
    cy.findByRole('link', { name: /Settings/i }).should('be.visible');
  });

  it('should have a footer with links', () => {
    // Check that the footer is visible
    cy.findByRole('contentinfo').should('be.visible');
    
    // Check that the footer has links
    cy.findByRole('contentinfo').within(() => {
      cy.findByText(/© 2023 Bookshelf/i).should('be.visible');
      cy.findAllByRole('link').should('have.length.at.least', 1);
    });
  });

  it('should have a skip to content link for accessibility', () => {
    // Tab to focus the skip link (it's usually visually hidden until focused)
    cy.get('body').tab();
    
    // Check that the skip link is now visible
    cy.findByText(/Skip to content/i).should('be.visible');
    
    // Click the skip link
    cy.findByText(/Skip to content/i).click();
    
    // Check that the focus is now on the main content
    cy.focused().should('have.attr', 'id', 'main-content');
  });
});
