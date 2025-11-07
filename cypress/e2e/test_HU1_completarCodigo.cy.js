// cypress/e2e/test_HU1_completarCodigo.cy.js

describe('HU-1: Ejercicio con sintaxis incompleta', () => {

  beforeEach(() => {
    // Asegúrate de que el servidor de desarrollo esté corriendo (por ejemplo: npm run dev)
    cy.visit('http://localhost:5173'); // Ajusta el puerto si es distinto
  });

  it('HU-001 Escenario 1: Usuario no escribe nada', () => {
    cy.get('textarea.overlay-textarea').clear();
    cy.wait(500);
    cy.get('.success').should('not.exist');
    cy.get('.hint').should('not.exist');
  });

  it('HU-001 Escenario 2: Usuario escribe sintaxis incorrecta', () => {
    cy.get('textarea.overlay-textarea').clear()
      .type('System.out.print("Hola")'); // Faltan paréntesis o punto y coma
    cy.get('.hint').should('be.visible').and('contain.text', 'Error');
  });

  it('HU-001 Escenario 3: Usuario completa código correctamente (dinámico)', () => {
    // Obtiene el código correcto mostrado en pantalla desde el atributo data-correct-code
    cy.get('.typing-container')
      .invoke('attr', 'data-correct-code')
      .then((correctCode) => {
        cy.log('Ejercicio actual:', correctCode);
        cy.get('textarea.overlay-textarea').clear()
          .type(correctCode, { delay: 15 });
        cy.get('.success', { timeout: 5000 })
          .should('be.visible')
          .and('contain.text', 'Correcto');
      });
  });

});
