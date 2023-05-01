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
    cy.get('.css-1cju3ff > .css-oqv722 > .css-wkpw2c > .css-1udklsk > [data-testid="FileCopyIcon"] > path').click({ multiple: true, force: true });
    cy.get('.css-wkpw2c > .MuiFormControl-root > .MuiInputBase-root > #outlined-basic').clear('te');
    cy.get('.css-wkpw2c > .MuiFormControl-root > .MuiInputBase-root > #outlined-basic').type('test copy');
    cy.get('.modal-confirm-button').click();
    cy.get(':nth-child(12) > .css-1cju3ff > .css-oqv722 > .css-wkpw2c > .css-1udklsk > [data-testid="BorderColorIcon"]').click();
    cy.get('.css-wkpw2c > .MuiFormControl-root > .MuiInputBase-root > #outlined-basic').clear('te');
    cy.get('.css-wkpw2c > .MuiFormControl-root > .MuiInputBase-root > #outlined-basic').type('test rename');
    cy.get('.modal-confirm-button').click();
    cy.get(':nth-child(12) > .css-1cju3ff > .css-oqv722 > .css-wkpw2c > .css-1udklsk > [data-testid="DeleteIcon"] > path').click();
    /* ==== End Cypress Studio ==== */
  })
})