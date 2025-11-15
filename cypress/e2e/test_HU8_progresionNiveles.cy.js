// cypress/e2e/test_HU8_progresionNiveles.cy.js

describe('HU-8: Progresión por niveles', () => {

  beforeEach(() => {
    cy.visit('http://localhost:5173'); // Ajusta el puerto si es distinto
    cy.wait(1000);
    cy.window().then((win) => win.localStorage.clear()); // reinicia progreso
  });

  // Escenario 1 — Completa 11 ejercicios para desbloquear el nivel intermedio
  it('HU-008 Escenario 1: Desbloqueo de nivel intermedio tras 10 ejercicios básicos', () => {

    const completarEjercicio = () => {
      cy.get('.feedback').invoke('text').then((correctCode) => {
        cy.get('textarea.overlay-textarea').clear().type(correctCode, { delay: 15 });
        cy.get('.success', { timeout: 6000 }).should('be.visible');
        cy.get('.quiz-modal').should('be.visible');
        cy.get('.quiz-modal').find('button.option').first().click();
        cy.get('button.start-level').click();
      });
    };

    // Completa 11 ejercicios (para asegurar el desbloqueo)
    for (let i = 0; i < 11; i++) {
      completarEjercicio();
      cy.wait(300);
    }

    // Verifica que "intermediate" esté desbloqueado en localStorage
    cy.window().then((win) => {
      const unlocked = JSON.parse(win.localStorage.getItem('coderush-unlocked') || '["basic"]');
      expect(unlocked).to.include('intermediate');
      cy.log('✅ Nivel intermedio desbloqueado:', unlocked);
    });

    // Cambia al nivel intermedio
    cy.contains('button', 'Intermedio').click();

    // Verifica que el nuevo nivel esté activo
    cy.get('.stats').should('contain.text', 'Nivel: Intermedio');
  });

});
