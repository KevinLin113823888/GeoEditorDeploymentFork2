import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Welcome from '../../src/components/Welcome';
import Register from '../../src/components/Register';
import Login from '../../src/components/Login';
import ForgotUsername from '../../src/components/ForgotUsername';

describe('<Login />', () => {
  beforeEach(() => {
    cy.mount(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path={'/'} element={<Welcome />} />
          <Route path={'/login'} element={<Login />} />
          <Route path={'/register'} element={<Register />} />
          <Route path={"/forgotUsername"} element={<ForgotUsername />} />
        </Routes>
      </MemoryRouter>
    );
  })

  it('Login Message', () => {
    cy.get('h1').should('have.text', 'Login Page');
  });

  it ('Link Clicks', () => {
    cy.get('[data-cy="home-link"]').click();
    cy.get('[data-cy="login-link"]').click();
    cy.get('[data-cy="register-link"]').click();
    cy.get('[data-cy="home-link"]').click();
    cy.get('[data-cy="login-link"]').click();
    cy.get('[data-cy="forgotusername-link"]').click();
    cy.get('[data-cy="login-link"]').click();
  })

  it ('Login Account', () => {
    cy.get('[data-cy="username-input"]').type("Dave");
    cy.get('[data-cy="password-input"]').type("123abc");
    cy.get('[data-cy="submit-button"]').click();
  })
});