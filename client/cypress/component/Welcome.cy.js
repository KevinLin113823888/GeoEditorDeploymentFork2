import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Welcome from '../../src/components/Welcome';
import Register from '../../src/components/Register';
import Login from '../../src/components/Login';

describe('<Welcome />', () => {
  beforeEach(() => {
    cy.mount(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path={'/'} element={<Welcome />} />
          <Route path={'/register'} element={<Register />} />
          <Route path={'/login'} element={<Login />} />
        </Routes>
      </MemoryRouter>
    );
  })

  it('Welcome Message', () => {
    cy.get('h1').should('have.text', 'Welcome to GeoEditor');
  });

  it ('link Clicks', () => {
    cy.get('[data-cy="register-link"]').click();
    cy.get('[data-cy="home-link"]').click();
    cy.get('[data-cy="login-link"]').click();
    cy.get('[data-cy="home-link"]').click();
  })
});