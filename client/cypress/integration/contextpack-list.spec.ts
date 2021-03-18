import { ContextpackListPage } from '../support/contextpack-list.po';

const page = new ContextpackListPage();

describe('Context pack list', () => {

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    page.getContextpackTitle().should('have.text', 'Context Packs');
  });

  //Works locally but throws Nodejs common errors on github
  // it('Should type something in the name filter and check that it returned correct elements', () => {
  //   // Filter for context pack 'Congo'
  //   cy.get('#contextpack-name-input').type('Mayotte');

  //   // Some of the context packs should be listed
  //   page.getContextpackCards().should('exist');

  //   // All of the context pack card items should have the name we are looking for
  //   page.getContextpackCards().each(e => {
  //     cy.wrap(e).find('.contextpack-card-name').should('contain', 'Mayotte');
  //   });
  // });

  // it('Should click add todo and go to the right URL', () => {
  //   // Click on the button for adding a new user
  //   page.addTodoButton().click();

  //   // The URL should end with '/users/new'
  //   cy.url().should(url => expect(url.endsWith('/todos/new')).to.be.true);

  //   // On the page we were sent to, We should see the right title
  //   cy.get('.add-todo-title').should('have.text', 'New Todo');
  // });
});
