import React from 'react';
import { Dashboard } from './Dashboard';
import {mount,contains,get} from "cypress"

describe('<Dashboard />', () => {
  beforeEach(() => {
    mount(<Dashboard />);
  });

  it('renders without crashing', () => {
    contains('Dash').should('exist'); // Replace with actual heading/text in the component
  });

  it('displays the navigation bar', () => {
    get('[data-testid="dashboard-navbar"]').should('exist');
  });

  it('shows the expected widgets or summary cards', () => {
    get('[data-testid="summary-card"]').should('have.length.at.least', 1);
  });

  it('contains a recent activity or table section', () => {
    get('[data-testid="recent-activity"]').should('exist');
  });

  it('responds to user interaction (e.g., button click)', () => {
    get('[data-testid="refresh-button"]').click();
    contains('Updated').should('exist'); // Replace with actual result of click
  });
});
