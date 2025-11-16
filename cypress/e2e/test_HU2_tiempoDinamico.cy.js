// cypress/e2e/test_HU2_tiempoDinamico.cy.js

describe('HU-2: Ajuste dinámico del tiempo límite', () => {

  beforeEach(() => {
    cy.visit('http://localhost:5173'); // ajusta el puerto si es diferente
    cy.wait(1000);
  });

  // Escenario 1 — el usuario completa muy rápido (<5s) → reduce 5s
  it('HU-002 Escenario 1: Reducción del tiempo por rapidez', () => {
    // Captura tiempo inicial (usa 15s por defecto si no está en localStorage)
    cy.window().then((win) => {
      const initialTime = win.localStorage.getItem('coderush-time-limit') || '15';
      cy.log('Tiempo inicial:', initialTime);

      // Completa el código actual inmediatamente

      cy.get('textarea.overlay-textarea')
        .invoke('val')
        .then((val) => {
          cy.get('.feedback').invoke('text').then((correctCode) => {
            cy.get('textarea.overlay-textarea').clear()
              .type(correctCode, { delay: 10 }); // rápido (<5s)
          });
        });        

      cy.get('.success', { timeout: 5000 }).should('be.visible');
      cy.get('.quiz-modal').should('be.visible');
      cy.get('.quiz-modal').find('button.option').first().click(); // selecciona opción correcta
      cy.get('button.start-level').click(); // cierra el quiz y genera nuevo ejercicio

      cy.wait(1000);
      cy.window().then((win2) => {
        const newTime = win2.localStorage.getItem('coderush-time-limit') || '15';
        expect(parseInt(newTime, 10)).to.be.lessThan(parseInt(initialTime, 15));
        cy.log(`Tiempo reducido de ${initialTime}s a ${newTime}s`);
      });
    });
  });

  // Escenario 2 — el usuario se demora (>11s) → aumenta 5s
  it('HU-002 Escenario 2: Aumento del tiempo por lentitud', () => {
    cy.window().then((win) => {
      cy.get('textarea.overlay-textarea').clear().type('goku');
      const initialTime = win.localStorage.getItem('coderush-time-limit') || '15';
      cy.log('Tiempo inicial:', initialTime);
      // Wait long enough to trigger the slow completion branch in manager (>15s)
      cy.wait(17000);


      cy.wait(1000);
      cy.window().then((win2) => {
        const newTime = win2.localStorage.getItem('coderush-time-limit') || '15';
        expect(parseInt(newTime, 18)).to.be.greaterThan(parseInt(initialTime, 10));
        cy.log(`Tiempo incrementado de ${initialTime}s a ${newTime}s`);
      });
    });
  });
});
