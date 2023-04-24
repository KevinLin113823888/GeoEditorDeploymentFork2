describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://bejewelled-palmier-26e86d.netlify.app/')
    /* ==== Generated with Cypress Studio ==== */
    cy.get('[data-cy="login-link"]').click();
    cy.get('#userName').clear();
    cy.get('#userName').type('test');
    cy.get('[data-cy="password-input"]').click();
    cy.get('#password').clear();
    cy.get('#password').type('test');
    cy.get('[data-cy="submit-button"]').click();

    cy.get('#cardImage644683a310eedf34e440433d').click();

    cy.get('#leaflet-tooltip-2485 > input').dblclick();
    cy.get('#leaflet-tooltip-2485 > input').clear();
    cy.get('#leaflet-tooltip-2485 > input').type('Russiaaaaa');

    cy.get('.MuiGrid-grid-xs-8').click();
    cy.get('[title="addText"] > .leaflet-buttons-control-button > .control-icon').click();
    cy.get('#mapitem').click();
    cy.get('.active > .leaflet-pm-actions-container > .leaflet-pm-action').click();
    cy.get('[title="undo"] > .leaflet-buttons-control-button > .control-icon').click();
    cy.get('.active > .leaflet-buttons-control-button > .control-icon').click();
    /* ==== End Cypress Studio ==== */
  })
})