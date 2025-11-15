// cypress/e2e/test_HU4_sistemaPuntos.cy.js

describe('HU-4: Sistema de puntos', () => {

  beforeEach(() => {
    cy.visit('http://localhost:5173'); // Ajusta el puerto si es distinto
    cy.wait(1000);
    cy.window().then((win) => win.localStorage.clear()); // reinicia progreso
  });

  // Escenario 1 — Ejercicio correcto → los puntos deben aumentar
  it('HU-004 Escenario 1: Aumento de puntos por ejercicio correcto', () => {
    cy.window().then((win) => {
      const initialScore = parseInt(win.localStorage.getItem('coderush-score') || '0');
      cy.log('Puntaje inicial:', initialScore);

      // Completa correctamente el ejercicio mostrado
      cy.get('.feedback').invoke('text').then((correctCode) => {
        cy.get('textarea.overlay-textarea').clear().type(correctCode, { delay: 20 });
      });

      // Espera al mensaje de éxito
      cy.get('.success', { timeout: 5000 }).should('be.visible');

      // Completa el quiz
      cy.get('.quiz-modal').should('be.visible');
      cy.get('.quiz-modal').find('button.option').first().click();
      cy.get('button.start-level').click();

      cy.wait(500);
      cy.window().then((win2) => {
        const newScore = parseInt(win2.localStorage.getItem('coderush-score') || '0');
        expect(newScore).to.be.greaterThan(initialScore);
        cy.log(`✅ Puntos aumentaron de ${initialScore} a ${newScore}`);
      });
    });
  });

  // Escenario 2 — Ejercicio fallado + tiempo agotado → los puntos no deben aumentar
  it('HU-004 Escenario 2: Sin aumento de puntos al fallar y agotar el tiempo', () => {
    cy.window().then((win) => {
      const initialScore = parseInt(win.localStorage.getItem('coderush-score') || '0');
      cy.log('Puntaje inicial:', initialScore);

      // Escribe mal el código
      cy.get('textarea.overlay-textarea').clear().type('goku');
      cy.get('.hint').should('be.visible');

      // Deja que el tiempo se acabe
      cy.wait(16000); // excede el límite inicial (15s)

      cy.window().then((win2) => {
        const finalScore = parseInt(win2.localStorage.getItem('coderush-score') || '0');
        expect(finalScore).to.equal(initialScore);
        cy.log(`✅ Puntos permanecen iguales (${finalScore}) tras fallar y dejar expirar el tiempo`);
      });
    });
  });

});
