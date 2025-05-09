describe('Share A Hike', () => {
    it('should share a new hike', () => {
      cy.visit('/register');
      cy.get('input[placeholder="Username"]').type('Teszt Elek');
      cy.get('input[placeholder="E-mail"]').type('teszt@valami.hu');
      cy.get('input[placeholder="Password"]').type('jelszo123');
      cy.get('input[placeholder="Password again"]').type('jelszo123');
      cy.get('button[type="submit"]').click();

      cy.url().should('include', '/home');
      cy.contains('Welcome');

      cy.visit('/sharehike');
      cy.contains('Share A Hike');

      const uniqueName = `Test Hike ${Date.now()}`;
      cy.get('input[placeholder="Name"]').type(uniqueName);
      cy.get('input[placeholder="Location"]').type("Budapest");
      cy.get('input[type="datetime-local"]').type('2025-10-01T10:00');
      cy.get('input[formControlName="capacity"]').type("12");
      cy.get('input[formControlName="length"]').type("12");

      cy.get('button[type="submit"]').click();

      cy.url().should('include', '/myhikes');
      cy.contains(uniqueName);

      cy.visit('/profile');
      cy.url().should('include', '/profile');
      cy.get('button[class="deleteButton"]').click();
      
      cy.url().should('include', '/index');
    });
});