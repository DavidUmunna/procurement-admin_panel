import OrderList from "../../src/components/OrderList";
import { Provider } from "react-redux";
import React from "react";
import store from "../../src/js/store/store";
import { searchSlice } from "../../src/js/reducer/rootreducer";

describe("template spec", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000/adminlogin");
    cy.get('[data-testid="pagelogin"]').should("exist");
  });

  it("redirects unauthenticated user to /adminlogin", () => {
    cy.visit("http://localhost:3000/dashboard");
    cy.url().should("include", "/adminlogin");
  });

  it("allows access to dashboard for authenticated users", () => {
    localStorage.setItem("authToken", "fake-valid-token");

    // Intercept the auth check API call
    cy.intercept("GET", "/api/access", {
      statusCode: 200,
      body: { authenticated: true },
    }).as("authCheck");

    cy.visit("http://localhost:3000/dashboard");
    cy.wait("@authCheck"); // Wait specifically for the authCheck call to complete
  });

  it("redirects authenticated users from /adminlogin to /dashboard", () => {
    localStorage.setItem("authToken", "fake-valid-token");
    

    // Intercept necessary API calls
    cy.intercept("GET", "/api/access", {
      statusCode: 200,
      body: { authenticated: true },
    }).as("authCheck");

    cy.intercept("GET", "/api/orders", {
      statusCode: 200,
     
      body: { orders: [{ id: 1, name: "Order 1" }, { id: 2, name: "Order 2" }] },
    }).as("getorders");

    cy.intercept("POST", "/api/orders", {
      statusCode: 200,
      body: { authenticated: true },
    }).as("POSTorders");

    

    // Visit the page after intercepts are set
    cy.visit("http://localhost:3000/requestlist");

    // Wait for the specific API calls to complete
    cy.wait(["@getorders", ]);

    // Ensure the URL includes '/dashboard' after all API calls are done
    cy.url().should("include", "/dashboard");
  });
});
