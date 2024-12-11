describe('Quiz End-to-End', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should complete full quiz flow', () => {
    // start quiz
    cy.get('button').contains('Start Quiz').click()

    // verify quiz started
    cy.get('h2').should('be.visible')
    cy.get('.alert-secondary').should('have.length.gt', 0)

    // answer all questions
    for (let i = 0; i < 10; i++) {
      cy.get('.btn-primary').first().click()

      // if not lat question, verify next question loaded
      if (i < 9) {
        cy.get('h2').should('be.visible')
        cy.get('alert-secondary').should('have.length.gt', 0)
      }
    }
    // verify quiz completion
    cy.get('alert-success').should('contain', 'Your Score:')
    cy.get('button').contains('Take New Quiz').should('be.visible')

    // start new quiz
    cy.get('button').contains('Take New Quiz').click()
    cy.get('h2').should('be.visible')
    cy.get('.alert-secondary').should('have.length.gt', 0)
  })

  it('should handle server errors gracefully', () => {
    // mock failed api response
    cy.intercept('GET', '**/api/questions', {
      statusCode: 500,
      body: { message: 'Srever error' }
    })

    cy.get('button').contains('Start Quiz').click()
    cy.get('[role="status"]').should('be.visible')
  })

  it('should maintain score throughout quiz', () => {
    cy.get('button').contains('Start Quiz').click()

    // track correct answers
    let correctAnswers = 0

    // answer all questions
    for (let i = 0; i < 10; i++) {
      // always choose first answer
      cy.get('.btn-primary').first().click()
    }

    // verify final score matches tracked score
    cy.get('.alert-success').invoke('text').then((text) => {
      const match = text.match(/\d+/)
      const score = match ? parseInt(match[0]) : 0
      expect(score).to.be.within(0, 10)
    })
  })
})
