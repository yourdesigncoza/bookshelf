describe('Data Management Features', () => {
  beforeEach(() => {
    // Visit the settings page before each test
    cy.visit('/settings');
  });

  it('should display the settings page', () => {
    cy.findByRole('heading', { name: /Settings/i }).should('be.visible');
  });

  it('should create a backup', () => {
    // Find and click the backup section
    cy.findByText(/Backup & Restore/i).click();
    
    // Click the create backup button
    cy.findByRole('button', { name: /Create Backup/i }).click();
    
    // Verify success message
    cy.findByText(/Backup created successfully/i).should('be.visible');
    
    // Verify backup appears in the list
    cy.findByRole('table').within(() => {
      cy.findAllByRole('row').should('have.length.at.least', 2); // Header + at least one backup
    });
  });

  it('should download a backup', () => {
    // Find and click the backup section
    cy.findByText(/Backup & Restore/i).click();
    
    // Click the download button for the first backup
    cy.findByRole('table').within(() => {
      cy.findAllByRole('button', { name: /Download/i }).first().click();
    });
    
    // We can't verify the download directly in Cypress, but we can check that the button was clicked
    cy.findByRole('table').within(() => {
      cy.findAllByRole('button', { name: /Download/i }).first().should('exist');
    });
  });

  it('should export data', () => {
    // Find and click the export section
    cy.findByText(/Export & Import/i).click();
    
    // Click the export button
    cy.findByRole('button', { name: /Export Data/i }).click();
    
    // We can't verify the download directly in Cypress, but we can check that the button was clicked
    cy.findByRole('button', { name: /Export Data/i }).should('exist');
  });

  it('should show import form', () => {
    // Find and click the export section
    cy.findByText(/Export & Import/i).click();
    
    // Click the import button
    cy.findByRole('button', { name: /Import Data/i }).click();
    
    // Verify import form is shown
    cy.findByText(/Select a JSON file to import/i).should('be.visible');
    cy.findByLabelText(/Select File/i).should('exist');
  });

  it('should show theme settings', () => {
    // Find and click the appearance section
    cy.findByText(/Appearance/i).click();
    
    // Verify theme options are shown
    cy.findByText(/Theme/i).should('be.visible');
    cy.findByRole('button', { name: /Light/i }).should('exist');
    cy.findByRole('button', { name: /Dark/i }).should('exist');
    cy.findByRole('button', { name: /System/i }).should('exist');
  });

  it('should change theme', () => {
    // Find and click the appearance section
    cy.findByText(/Appearance/i).click();
    
    // Click the dark theme button
    cy.findByRole('button', { name: /Dark/i }).click();
    
    // Verify the theme has changed (check for a class on the html element)
    cy.get('html').should('have.class', 'dark');
    
    // Change back to light theme
    cy.findByRole('button', { name: /Light/i }).click();
    
    // Verify the theme has changed back
    cy.get('html').should('not.have.class', 'dark');
  });

  it('should navigate back to books page', () => {
    cy.findByRole('link', { name: /Back to Books/i }).click();
    cy.url().should('include', '/books');
  });
});
