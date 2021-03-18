export class AppPage {
  navigateTo() {
    return cy.visit('/');
  }

  getAppTitle() {
    return cy.get('.app-title');
  };
}
