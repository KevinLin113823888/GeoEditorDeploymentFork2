describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://bejewelled-palmier-26e86d.netlify.app/');

    cy.get('[data-cy="login-link"]').click();
    cy.get('#userName').clear();
    cy.get('#userName').type('test');
    cy.get('#password').clear('t');
    cy.get('#password').type('test');
    cy.get('[data-cy="submit-button"]').click();
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#cardImage644f2092bcff9e2f3f9bed94').click();
    cy.get('#leaflet-tooltip-183').dblclick();
    cy.get('#leaflet-tooltip-183 > input').clear();
    cy.get('#leaflet-tooltip-183 > input').type('Russiaaaa{enter}');
    cy.get('[title="addText"] > .leaflet-buttons-control-button > .control-icon').click();
    cy.get('#mapitem').click();
    cy.get('.active > .leaflet-pm-actions-container > .leaflet-pm-action').click();
    cy.get('[title="undo"] > .leaflet-buttons-control-button').click();
    cy.get('.active > .leaflet-buttons-control-button').click();
    cy.get('[title="undo"] > .leaflet-buttons-control-button').click();
    /* ==== End Cypress Studio ==== */
  })
})