import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Welcome from '../../src/components/Welcome';
import Register from '../../src/components/Register';
import AppBanner from '../../src/components/AppBanner';
import Login from '../../src/components/Login';
import GlobalStoreContext from '../../src/store';

describe('<Welcome />', () => {
  beforeEach(() => {
    cy.mount(
      <MemoryRouter initialEntries={['/']}>
        {/* <GlobalStoreContext>
        <AppBanner/> */}
          <Routes>
            <Route path={'/'} element={<Welcome />} />
            <Route path={'/register'} element={<Register />} />
            <Route path={'/login'} element={<Login />} />
          </Routes>
        {/* </GlobalStoreContext> */}
      </MemoryRouter>
    );
  })

  it('Welcome Message', () => {
    cy.get('[data-cy="message"]').should('have.text', 'Create, share, and explore community maps with an easy to use map editor');
  });

  it ('link Clicks', () => {
    cy.get('[data-cy="register-link"]').click();
    cy.go('back')
    cy.get('[data-cy="login-link"]').click();
    cy.go('back')
  })
});