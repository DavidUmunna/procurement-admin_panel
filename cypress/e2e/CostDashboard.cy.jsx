import React from 'react'
import CostDashboard from '../../src/pages/CostDashboard'
describe('<CostDashboard />', () => {
  it('renders without crashing', () => {
    cy.mount(<CostDashboard />);
    cy.contains('Cost Dashboard').should('exist'); // Check page title or header
  });

  it('displays the cost table', () => {
    cy.mount(<CostDashboard />);
    cy.get('[data-testid="cost-table"]').should('exist');
  });

  it('shows at least one row', () => {
    cy.mount(<CostDashboard />);
    cy.get('[data-testid="cost-row"]').should('have.length.greaterThan', 0);
  });

  it('allows status change', () => {
    cy.mount(<CostDashboard />);
    cy.get('[data-testid="status-dropdown"]').first().click();
    cy.contains('Approved').click();
    cy.contains('Approved').should('exist');
  });
});