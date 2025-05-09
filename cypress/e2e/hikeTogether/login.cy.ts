describe('Login', () => {
    it('should log in a user', () => {
      cy.visit('/register');
      cy.get('input[placeholder="Username"]').type('Teszt Elek');
      cy.get('input[placeholder="E-mail"]').type('teszt@valami.hu');
      cy.get('input[placeholder="Password"]').type('jelszo123');
      cy.get('input[placeholder="Password again"]').type('jelszo123');
      cy.get('button[type="submit"]').click();

      cy.url().should('include', '/home');
      cy.contains('Welcome');

      cy.get('a[href="#"]').click();
      cy.url().should('include', '/index');

      cy.visit('/login');
      cy.get('input[placeholder="E-mail"]').type('teszt@valami.hu');
      cy.get('input[placeholder="Password"]').type('jelszo123');
      cy.get('button[type="submit"]').click();
  
      cy.url().should('include', '/home');
      cy.contains('Welcome');

      cy.visit('/profile');
      cy.url().should('include', '/profile');
      cy.get('button[class="deleteButton"]').click();
      
      cy.url().should('include', '/index');
    });
});