describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://bejewelled-rugelach-940512.netlify.app/')
    /* ==== Generated with Cypress Studio ==== */
    cy.get('[data-cy="login-link"]').click();
    cy.get('#userName').clear();
    cy.get('#userName').type('test');
    cy.get('[data-cy="password-input"]').click();
    cy.get('#password').clear();
    cy.get('#password').type('test');
    cy.get('[data-cy="submit-button"]').click();
    cy.get('#cardImage644606653d389749e5e550d4').click();
    cy.get('#leaflet-tooltip-259').dblclick();
    cy.get('#leaflet-tooltip-259 > input').clear();
    cy.get('#leaflet-tooltip-259 > input').type('Russiaaaaa');
    cy.get('.MuiGrid-grid-xs-8').click();
    cy.get('[title="addText"] > .leaflet-buttons-control-button > .control-icon').click();
    cy.get('#mapitem').click();
    cy.get('.active > .leaflet-pm-actions-container > .leaflet-pm-action').click();
    cy.get('[title="undo"] > .leaflet-buttons-control-button > .control-icon').click();
    cy.get('.active > .leaflet-buttons-control-button > .control-icon').click();
    /* ==== End Cypress Studio ==== */
  })
})