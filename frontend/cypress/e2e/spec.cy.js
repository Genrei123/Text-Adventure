describe('template spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173')
  })

  it('should have a title', () => {
    cy.get('h1').should('have.text', 'Welcome to Sage.AI')

  })
})