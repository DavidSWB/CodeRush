// cypress/e2e/test_HU3_rachaRespuestas.cy.js

describe('HU-3: Racha de respuestas correctas', () => {

  beforeEach(() => {
    cy.visit('http://localhost:5173'); // Ajusta el puerto si es distinto
    cy.wait(1000);
    cy.window().then((win) => win.localStorage.clear()); // reinicia progreso
  });

  // Escenario 1: 5 ejercicios correctos seguidos → racha = 5 (éxito)
  it('HU-003 Escenario 1: Racha de 5 respuestas correctas consecutivas', () => {
    const completarEjercicio = () => {
      cy.get('.feedback').invoke('text').then((correctCode) => {
        cy.get('textarea.overlay-textarea').clear().type(correctCode, { delay: 20 });
        cy.get('.success', { timeout: 5000 }).should('be.visible');
        cy.get('.quiz-modal').should('be.visible');
        cy.contains('button.option', 'String').click(); // responde bien el quiz
        cy.get('button.start-level').click(); // continúa
      });
    };

    // Repite 5 ejercicios correctamente
    for (let i = 0; i < 5; i++) {
      completarEjercicio();
      cy.wait(500);
    }

    // Verifica que la racha sea 5
    cy.get('.stats').should('contain.text', 'Racha: 5');
  });

  // Escenario 2: Falla y deja expirar el tiempo → racha = 0 (éxito)
  it('HU-003 Escenario 2: Falla el código y deja expirar el tiempo (racha = 0)', () => {
    // Escribe algo incorrecto
    cy.get('textarea.overlay-textarea').clear().type('goku');
    cy.get('.hint').should('be.visible'); // debe aparecer el mensaje de error

    // Ahora deja que el tiempo se acabe
    cy.wait(16000); // más que el tiempo límite inicial (15s)
    cy.get('.stats').should('contain.text', 'Racha: 0');
  });

});
