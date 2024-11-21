import { mount } from 'cypress/react';
import Quiz from '../../client/src/components/Quiz';

describe('Quiz Component', () => {
  beforeEach(() => {
    // mock the api response
    cy.intercept('GET', '**/api/questions', {
      fixture: 'questions.json'
    }).as('getQuestions')
  })

  it('should show start button initially', () => {
    mount(<Quiz />)
    cy.get('button').contains('Start Quiz').should('be.visible')
  })

  it('should load questions when quiz starts', () => {
    mount(<Quiz />)
    cy.get('button').contains('Start Quiz').click()
    cy.wait('@getQuestions')
    cy.get('h2').should('exist') // question text
    cy.get('button').should('have.length.gt', 1) // answer buttons
  })

  it('should show loading stat while fetching questions', () => {
    mount(<Quiz />)
    cy.get('button').contains('Start Quiz').click()
    cy.get('[role="status"]').should('be.visable')
  })

  it('should display question and anser options', () => {
    mount(<Quiz />)
    cy.get('button').contains('Start Quiz').click()
    cy.wait('@getQuestions')
    cy.get('h2').should('have.length.gt', 0)
  })

  it('should progress through questions when answering', () => {
    mount(<Quiz />)
    cy.get('button').contains('Start Quiz').click()
    cy.wait('@getQuestions')

    // get initial question
    cy.get('h2').invoke('text').as('firstQuestion')

    // Answer first question
    cy.get('.btn-primary').first().click()

    // verify we moved to next question
    cy.get('h2').invoke('text').should('not.equal', '@firstQuestion')
  })

  it('should show final score when quiz completes', () => {
    mount(<Quiz />)
    cy.get('button').contains('Start Quiz').click()
    cy.wait('@getQuestions')

    // answer all questions
    cy.get('.btn-primary').first().as('answerBtn')
    Cypress._.times(10, () => {
      cy.get('@answerBtn').click()
    })

    // verify score display
    cy.get('.alert-success').should('contain', 'Your score:')
    cy.get('button').contains('Take New Quiz').should('be.visible')
  })

  it('should restart quiz with new questions', () => {
    mount(<Quiz />)
    cy.get('button').contains('Start Quiz').click()
    cy.wait('@getQuestions')

    // complete quiz
    cy.get('.btn-primary').first().as('answerBtn')
    Cypress._.times(10, () => {
      cy.get('@anserBtn').click()
    })

    // start new quiz
    cy.get('button').contains('Take New Quiz').click()
    cy.wait('@getQuestions')
    cy.get('h2').should('exist')
    cy.get('.btn-primary').should('have.length.gt', 1)
  })
})

