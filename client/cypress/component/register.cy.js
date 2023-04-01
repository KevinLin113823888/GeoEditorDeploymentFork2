import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Welcome from '../../src/components/Welcome';
import Register from '../../src/components/Register';

describe('<Register />', () => {
  beforeEach(() => {
    cy.mount(
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path={'/'} element={<Welcome />} />
          <Route path={'/register'} element={<Register />} />
        </Routes>
      </MemoryRouter>
    );
  })

  it('Register Message', () => {
    cy.get('h1').should('have.text', 'Register Page');
  });

  it ('Link Clicks', () => {
    cy.get('[data-cy="home-link"]').click();
    cy.get('[data-cy="register-link"]').click();
  })

  it ('Register Account', () => {
    cy.get('[data-cy="name-input"]').type("David Wang");
    cy.get('[data-cy="username-input"]').type("Dave");
    cy.get('[data-cy="email-input"]').type("wang@gmail.com");
    cy.get('[data-cy="password-input"]').type("123abc");
    cy.get('[data-cy="submit-button"]').click();
  })
});