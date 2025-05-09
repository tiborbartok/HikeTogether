describe('Change profile data', () => {
  it('should change profile data', () => {
    cy.visit('/register');
    cy.get('input[placeholder="Username"]').type('Teszt Elek');
    cy.get('input[placeholder="E-mail"]').type('teszt@valami.hu');
    cy.get('input[placeholder="Password"]').type('jelszo123');
    cy.get('input[placeholder="Password again"]').type('jelszo123');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/home');
    cy.contains('Welcome');

    cy.visit('/profile');
    cy.url().should('include', '/profile');
    cy.get('input[placeholder="Username"]').clear().type('Teszt Elek 2');
    cy.get('button[type="submit"]').contains('Change Name').click();

    cy.contains('Teszt Elek 2');

    cy.get('input[placeholder="Photo URL"]').clear().type('https://i.pinimg.com/736x/41/e7/e3/41e7e330abd571ce9a8585e2b826c451.jpg');
    cy.get('button[type="submit"]').contains('Upload Photo').click();

    cy.get('img[alt="Profile Picture"]');

    cy.get('button[class="deleteButton"]').click();

    cy.url().should('include', '/index');
  });
});