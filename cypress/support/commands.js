

Cypress.Commands.add('mockSignIn', (role = 'user') => {
    // You can mock different roles based on the argument passed
    const mockUser = {
      admin: {
        email: 'admin@example.com',
        role: 'admin',
        token: 'mock-admin-token', // Mock token
      },
      user: {
        email: 'user@example.com',
        role: 'user',
        token: 'mock-user-token', // Mock token
      },
    };
  
    const user = mockUser[role]; // Use the user based on the role passed
  
    // Save the mock token in localStorage (or sessionStorage if needed)
    window.localStorage.setItem('auth_token', user.token);
    window.localStorage.setItem('user_role', user.role);
    window.localStorage.setItem('user_email', user.email);
  
    // Optionally, mock the API request for fetching user data or orders, if needed
    cy.intercept('GET', '/api/orders', {
      statusCode: 200,
      body: [
        { orderNumber: 'PO-12345', Title: 'Office Chairs', status: 'Approved' },
        { orderNumber: 'PO-12346', Title: 'Laptops', status: 'Pending' },
      ],
    }).as('getOrders');
  });
  