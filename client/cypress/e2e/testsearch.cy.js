describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://bejewelled-palmier-26e86d.netlify.app/')
    cy.get('[data-cy="login-link"]').click();
    cy.get('#userName').clear();
    cy.get('#userName').type('test');
    cy.get('#password').clear('te');
    cy.get('#password').type('test');
    cy.get('[data-cy="submit-button"]').click();

    /* ==== Generated with Cypress Studio ==== */
    cy.get('#outlined-basic').clear('a');
    cy.get('#outlined-basic').type('aaa{enter}');
    cy.get('.css-1gvxqsq > .MuiGrid-container').click();
    cy.get('#outlined-basic').clear();
    cy.get('#outlined-basic').type('{enter}');
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#outlined-basic').clear();
    cy.get('#outlined-basic').type('bbb{enter}');
    cy.get('.MuiGrid-grid-xs-8').click();
    cy.get('#outlined-basic').clear();
    cy.get('#outlined-basic').type('{enter}');
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('[data-testid="PeopleIcon"] > path').click({force: true} );
    cy.get('#outlined-basic').clear('a');
    cy.get('#outlined-basic').type('aaa{enter}');
    cy.get('.MuiInputBase-root').click();
    cy.get('#outlined-basic').clear();
    cy.get('#outlined-basic').type('bbb{enter}');
    cy.get('.MuiGrid-grid-xs-8').click();
    cy.get('#outlined-basic').clear();
    cy.get('#outlined-basic').type('{enter}');
    /* ==== End Cypress Studio ==== */
  })

  /* ==== Test Created with Cypress Studio ==== */
  it('sort', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('https://bejewelled-palmier-26e86d.netlify.app');
    cy.get('[data-cy="login-link"]').click();
    cy.get('#userName').clear();
    cy.get('#userName').type('test');
    cy.get('#password').clear('te');
    cy.get('#password').type('test');
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-testid="SortIcon"]').click();
    cy.get('#sort-menu > .MuiPaper-root > .MuiList-root > [tabindex="0"]').click();
    cy.get('[data-testid="SortIcon"]').click();
    cy.get('#sort-menu > .MuiPaper-root > .MuiList-root > [tabindex="-1"]').click();
    cy.get('[data-testid="PeopleIcon"] > path').click({force: true});
    cy.get('[data-testid="SortIcon"]').click();
    cy.get('#sort-menu > .MuiPaper-root > .MuiList-root > [tabindex="0"]').click();
    cy.get('[data-testid="SortIcon"]').click();
    cy.get('#sort-menu > .MuiPaper-root > .MuiList-root > [tabindex="-1"]').click();
    /* ==== End Cypress Studio ==== */
  });
})