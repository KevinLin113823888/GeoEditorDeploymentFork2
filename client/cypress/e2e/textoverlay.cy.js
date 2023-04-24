describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://bejewelled-palmier-26e86d.netlify.app/');

    /* ==== Generated with Cypress Studio ==== */
    cy.get('[data-cy="login-link"]').click();
    cy.get('#userName').clear();
    cy.get('#userName').type('test');
    cy.get('#password').clear('t');
    cy.get('#password').type('test');
    cy.get('[data-cy="submit-button"]').click();
    cy.get('#cardImage6446ab663b7d0ddb8ecd43c3').click();
    cy.get('#leaflet-tooltip-259').dblclick();
    cy.get('#leaflet-tooltip-259 > input').clear();
    cy.get('#leaflet-tooltip-259 > input').type('Russiaaaaa');
    cy.get('.MuiGrid-grid-xs-8').click();
    cy.get('[title="addText"] > .leaflet-buttons-control-button > .control-icon').click();
    cy.get('#mapitem').click();
    cy.get('.active > .leaflet-pm-actions-container > .leaflet-pm-action').click();
    cy.get('[title="undo"] > .leaflet-buttons-control-button > .control-icon').click();
  })
})