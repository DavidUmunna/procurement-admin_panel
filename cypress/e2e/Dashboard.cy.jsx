import React from 'react';
import { Dashboard } from '../../src/pages/Dashboard';
import {mount,contains,get} from "cypress"

describe('<Dashboard />', () => {
  beforeEach(() => {
    cy.mount(<Dashboard />);
  });

  it('renders without crashing', () => {
    cy.contains('Dash').should('exist'); // Replace with actual heading/text in the component
  });

  it('displays the navigation bar', () => {
    cy.get('[data-testid="dashboard-navbar"]').should('exist');
  });

  it('shows the expected widgets or summary cards', () => {
    cy.get('[data-testid="summary-card"]').should('have.length.at.least', 1);
  });

  it('contains a recent activity or table section', () => {
    cy.get('[data-testid="recent-activity"]').should('exist');
  });

  it('responds to user interaction (e.g., button click)', () => {
    cy.get('[data-testid="refresh-button"]').click();
    cy.contains('Updated').should('exist'); // Replace with actual result of click
  });
});
