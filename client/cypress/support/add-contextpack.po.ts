import { ContextPack } from '../../src/app/contextpack/contextpack';

export class AddWordPackPage {
  navigateTo() {
    return cy.visit('/contextpacks/new');
  }

  getTitle() {
    return cy.get('.add-pack-title');
  }

  addPackButton() {
    return cy.get('[data-test="confirmAddPackButton"]');
  }

  selectMatSelectValue(select: Cypress.Chainable, value: string) {
    // Find and click the drop down
    return select.click({ multiple: true, force:true })
      // Select and click the desired value from the resulting menu
      .get(`value="enabled"`).click({ multiple: true, force:true });
  }

  getFormField(fieldName: string) {
    return cy.get(`mat-form-field [formcontrolname=${fieldName}]`);
  }

  addWordPack(){
    return cy.get('.add-wordPack-button').click({force: true});
  }
  addPosArray(pos: string){
    return cy.get(`.add-${pos}-button`).click({force: true});
  }
  showJson(){
    return cy.get('[data-test="showJsonButton"]').click({force: true});
  }
  contextPackForm(){
    return cy.get('.form-value');
  }

  getEnabledBox(){
    return cy.get('.enabled-box-true');
  }


  addPack(newPack: ContextPack) {
    this.getFormField('name').type(newPack.name);
    this.getEnabledBox().click({force: true});
    this.addWordPack();
    this.addPosArray('noun');
    this.addPosArray('verb');
    this.addPosArray('adj');
    this.addPosArray('misc');
    if (newPack.wordPacks) {
      this.getFormField('name').then(els => {
        [...els].forEach(el => cy.wrap(el).type('horsies', {force:true}));
      });
    }
    this.selectMatSelectValue(this.getEnabledBox(), newPack.enabled.toString());
    return this.addPackButton().click({ multiple: true, force:true });
  }
}
