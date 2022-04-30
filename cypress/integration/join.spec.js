describe("Test the Joining function", () => {
  it("Should ensure a clean signing up workflow. Create a new account and confirm registration", () => {
    cy.visit("http://localhost:3000");

    cy.contains("Sign up").click();

    cy.get("#email-address").type("example-join@gmail.com");
    cy.get("#password").type("12345678");

    cy.contains("Create account").click();

    cy.url().should("include", "/");
  });
});
