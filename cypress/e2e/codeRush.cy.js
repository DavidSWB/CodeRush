describe('CodeRush - Pruebas de usuario', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173'); // ajusta el puerto si es distinto
    cy.get('[data-testid="typing-textarea"]').as('input');
    cy.get('[data-testid="expected-code"]').as('expected');
  });

  // -------------------------------
  // HU-1: Completar código
  // -------------------------------

  it('HU-001 Escenario 1: Usuario no escribe nada', () => {
    cy.get('@input').should('have.value', '');
    cy.get('[data-testid="success"]').should('not.exist');
  });

  it('HU-001 Escenario 2: Usuario rellena con sintaxis incorrecta', () => {
    cy.get('@input').type('System.out.print("Hola")'); // falta el ln
    cy.get('[data-testid="hint"]').should('exist');
    cy.get('[data-testid="success"]').should('not.exist');
  });

  it('HU-001 Escenario 3: Usuario rellena correctamente', () => {
    cy.get('@expected').invoke('text').then((expected) => {
      cy.get('@input').type(expected, { delay: 0 });
    });
    cy.get('[data-testid="success"]').should('exist');
  });

  it('HU-001 Escenario 4: Serie de ejercicios completos', () => {
    for (let i = 0; i < 3; i++) {
      cy.get('@expected').invoke('text').then((expected) => {
        cy.get('@input').clear().type(expected, { delay: 0 });
      });
      cy.get('[data-testid="success"]').should('exist');
      cy.wait(1500); // espera a que cargue nuevo ejercicio
    }
    cy.get('.stats').should('contain.text', 'Racha: 3');
  });

  it('HU-001 Escenario 5: Serie con errores', () => {
    cy.get('@expected').invoke('text').then(() => {
      cy.get('@input').type('ç'); // error forzado con "ç"
    });
    cy.get('[data-testid="hint"]').should('exist');
  });

  // -------------------------------
  // HU-8: Progresión por niveles
  // -------------------------------
  it('HU-008 Escenario 1: Completar nivel 1 desbloquea el 2', () => {
    // simula completar suficientes ejercicios para desbloquear intermedio
    for (let i = 0; i < 10; i++) {
      cy.get('@expected').invoke('text').then((expected) => {
        cy.get('@input').clear().type(expected, { delay: 0 });
      });
      cy.wait(1200);
    }
    cy.get('.level-buttons button').contains('Intermedio').should('not.have.class', 'locked');
  });

  it('HU-008 Escenario 2: Intentar acceder a nivel bloqueado', () => {
    cy.get('.level-buttons button').contains('Avanzado').click();
    cy.on('window:alert', (txt) => {
      expect(txt).to.contain('Te faltan');
    });
  });

  // -------------------------------
  // HU-3: Racha de respuestas
  // -------------------------------
  it('HU-003 Escenario 1: Racha inicial de 1', () => {
    cy.get('@expected').invoke('text').then((expected) => {
      cy.get('@input').type(expected, { delay: 0 });
    });
    cy.get('.stats').should('contain.text', 'Racha: 1');
  });

  it('HU-003 Escenario 3: Racha interrumpida', () => {
    cy.get('@expected').invoke('text').then(() => {
      cy.get('@input').type('ç');
    });
    cy.get('.stats').should('contain.text', 'Racha: 0');
  });

  // -------------------------------
  // HU-2: Tiempo dinámico
  // -------------------------------
  it('HU-002 Escenario 1: Reducir tiempo por racha', () => {
    cy.get('@expected').invoke('text').then((expected) => {
      cy.get('@input').type(expected, { delay: 0 });
    });
    cy.wait(500);
    cy.get('@expected').invoke('text').then((expected) => {
      cy.get('@input').clear().type(expected, { delay: 0 });
    });
    cy.get('.time-value').invoke('text').then((time1) => {
      expect(parseInt(time1)).to.be.lessThan(60);
    });
  });

  it('HU-002 Escenario 2: Aumentar tiempo al usar máximo', () => {
    cy.wait(61000); // consumir tiempo máximo
    cy.get('@expected').invoke('text').then((expected) => {
      cy.get('@input').type(expected, { delay: 0 });
    });
    cy.get('.time-value').invoke('text').then((time2) => {
      expect(parseInt(time2)).to.be.greaterThan(60);
    });
  });
});
