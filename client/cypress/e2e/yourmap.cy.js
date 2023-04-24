describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://bejewelled-rugelach-940512.netlify.app/')
    /* ==== Generated with Cypress Studio ==== */
    cy.get('[data-cy="login-link"]').click();
    cy.get('#userName').clear();
    cy.get('#userName').type('test');
    cy.get('#password').clear('t');
    cy.get('#password').type('test');
    cy.get('[data-cy="submit-button"]').click();
    cy.get(':nth-child(7) > .css-1cju3ff > .css-oqv722 > .css-wkpw2c > .css-1udklsk > [data-testid="FileCopyIcon"] > path').click();
    cy.get('.css-wkpw2c > .MuiFormControl-root > .MuiInputBase-root > #outlined-basic').clear('c');
    cy.get('.css-wkpw2c > .MuiFormControl-root > .MuiInputBase-root > #outlined-basic').type('copy');
    cy.get('.modal-confirm-button').click();
    cy.get(':nth-child(9) > .css-1cju3ff > .css-oqv722 > .css-wkpw2c > .css-1udklsk > [data-testid="BorderColorIcon"]').click();
    cy.get('.css-wkpw2c > .MuiFormControl-root > .MuiInputBase-root > #outlined-basic').clear('re');
    cy.get('.css-wkpw2c > .MuiFormControl-root > .MuiInputBase-root > #outlined-basic').type('rename');
    cy.get('.modal-confirm-button').click();
    cy.get(':nth-child(9) > .css-1cju3ff > .css-oqv722 > .css-wkpw2c > .css-1udklsk > [data-testid="DeleteIcon"] > path').click();
    /* ==== End Cypress Studio ==== */
  })
})