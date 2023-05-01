describe('template spec', () => {
    it('passes', () => {
      cy.visit('https://bejewelled-palmier-26e86d.netlify.app/');

      cy.get('[data-cy="login-link"]').click();
      cy.get('#userName').clear();
      cy.get('#userName').type('test');
      cy.get('#password').clear('t');
      cy.get('#password').type('test');
      cy.get('[data-cy="submit-button"]').click();
      cy.get('#cardImage644f2092bcff9e2f3f9bed94').click();

      /* ==== Generated with Cypress Studio ==== */
      cy.get('[title="addLegend"] > .leaflet-buttons-control-button > .control-icon').click();
      cy.get('.MuiGrid-grid-xs-12 > .MuiGrid-container > .MuiGrid-root > .MuiBox-root > .mb-3 > #validationCustom01').click();
      cy.get('.MuiGrid-grid-xs-12 > .MuiGrid-container > .MuiGrid-root > .MuiBox-root > .mb-3 > #validationCustom01').click();
      cy.get('.MuiGrid-grid-xs-12 > .MuiGrid-container > .MuiGrid-root > .MuiBox-root > .mb-3 > #validationCustom01').click();
      cy.get('.MuiGrid-grid-xs-12 > .MuiGrid-container').click();
      cy.get('.MuiGrid-grid-xs-12 > .MuiGrid-container > .MuiGrid-root > .MuiBox-root > .mb-3 > #validationCustom01').clear();
      cy.get('.MuiGrid-grid-xs-12 > .MuiGrid-container > .MuiGrid-root > .MuiBox-root > .mb-3 > #validationCustom01').type('legend test');
      cy.get('.MuiGrid-grid-xs-12 > .MuiGrid-container').click();
      cy.get('[title="undo"] > .leaflet-buttons-control-button > .control-icon').click();
      cy.get('.active > .leaflet-buttons-control-button > .control-icon').click();
      /* ==== End Cypress Studio ==== */
      /* ==== Generated with Cypress Studio ==== */
      cy.get('[title="redo"] > .leaflet-buttons-control-button > .control-icon').click();
      cy.get('[data-testid="DeleteIcon"] > path').click();
      cy.get('[title="undo"] > .leaflet-buttons-control-button > .control-icon').click();
      /* ==== End Cypress Studio ==== */
    })
  })