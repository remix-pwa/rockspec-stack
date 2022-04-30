// import { mount } from "@cypress/react";
// import Notes from "../../app/routes/notes";

describe("Notes route security", () => {
  it("Is a private route, so we should be redirected to login route", () => {
    cy.visit("http://localhost:3000/notes");

    cy.url().should("include", "/login");
  });
});
