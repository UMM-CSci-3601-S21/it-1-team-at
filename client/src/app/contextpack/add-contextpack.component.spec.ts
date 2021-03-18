import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormGroup, AbstractControl, FormArray } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockContextPackService } from 'src/testing/contextpack.service.mock';
import { AddContextpackComponent } from './add-contextpack.component';
import { ContextpackService } from './contextpack.service';
import { componentFactoryName } from '@angular/compiler';

describe('AddContextpackComponent', () => {
  let addContextpackComponent: AddContextpackComponent;
  let addContextPackForm: FormGroup;
  let fixture: ComponentFixture<AddContextpackComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      declarations: [ AddContextpackComponent ],
      providers: [{ provide: ContextpackService, useValue: new MockContextPackService() }]
    }).compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddContextpackComponent);
    addContextpackComponent = fixture.componentInstance;
    addContextpackComponent.ngOnInit();
    fixture.detectChanges();
    addContextPackForm = addContextpackComponent.addContextPackForm;
    expect(addContextPackForm).toBeDefined();
    expect(addContextPackForm.controls).toBeDefined();
  });

  it('should create the component and form', () => {
    expect(addContextpackComponent).toBeTruthy();
    expect(addContextPackForm).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(addContextPackForm.valid).toBeFalsy();
  });

  describe('The name field', () => {
    let nameControl: AbstractControl;

    beforeEach(() => {
      nameControl = addContextpackComponent.addContextPackForm.controls.name;
    });

    it('should not allow empty names', () => {
      nameControl.setValue('');
      expect(nameControl.valid).toBeFalsy();
    });

    it('should be fine with "fun"', () => {
      nameControl.setValue('fun');
      expect(nameControl.valid).toBeTruthy();
    });

    it('should allow digits in the name', () => {
      nameControl.setValue('Bad2Th3B0ne');
      expect(nameControl.valid).toBeTruthy();
    });
  });

  describe('The enabled field', () =>{
    let enabledControl: AbstractControl;
    beforeEach(() => {
      enabledControl = addContextpackComponent.addContextPackForm.controls.enabled;
    });
    it('should only allow boolean values', () => {
      enabledControl.setValue('559546sd');
      expect(enabledControl.valid).toBeFalsy();
      enabledControl.setValue('true');
      expect(enabledControl.valid).toBeTruthy();
      enabledControl.setValue('True');
      expect(enabledControl.valid).toBeFalsy();
      enabledControl.setValue('false');
      expect(enabledControl.valid).toBeTruthy();
    });
  });

  describe('Add word pack', () => {
    it('should add a word pack', () => {
      addContextpackComponent.addWordPack();
      let formValue = addContextpackComponent.addContextPackForm.value;
      expect(formValue.wordPacks.length).toEqual(1);
      addContextpackComponent.addWordPack();
      formValue = addContextpackComponent.addContextPackForm.value;
      expect(formValue.wordPacks.length).toEqual(2);
    });
  });

  describe('Add nouns', () => {
    it('should add an array of nouns', () =>{
      addContextpackComponent.addWordPack();
      addContextpackComponent.addPosArray(0, 'nouns');
      let control = ((addContextpackComponent.addContextPackForm.value.wordPacks as Array<any>)[0]);
      console.log(control.nouns);
      expect(control.nouns.length).toEqual(1);
      addContextpackComponent.addPosArray(0, 'nouns');
      control = ((addContextpackComponent.addContextPackForm.value.wordPacks as Array<any>)[0]);
      expect(control.nouns.length).toEqual(2);
    });
  });

  describe('Add verbs', () =>{
    it('should add an array of verbs', () =>{
      addContextpackComponent.addWordPack();
      addContextpackComponent.addPosArray(0, 'verbs');
      let control = ((addContextpackComponent.addContextPackForm.value.wordPacks as Array<any>)[0]);
      expect(control.verbs.length).toEqual(1);
      addContextpackComponent.addPosArray(0, 'verbs');
      control = ((addContextpackComponent.addContextPackForm.value.wordPacks as Array<any>)[0]);
      expect(control.verbs.length).toEqual(2);
    });
  });

  describe('Add forms', () =>{
    it('should add a form to the forms array', () =>{
      addContextpackComponent.addWordPack();
      addContextpackComponent.addPosArray(0, 'verbs');
      addContextpackComponent.addForms(0, 0, 'verbs');
      const control = ((addContextpackComponent.addContextPackForm.value.wordPacks as Array<any>)[0]);
      expect(control.verbs[0].forms.length).toEqual(2);
    });
  });

  describe('Test form submission', () =>{
    it('form should validate', () =>{
      addContextpackComponent.addWordPack();
      expect(addContextpackComponent.addContextPackForm.valid).toBeFalsy();
      ((addContextpackComponent.addContextPackForm).get('name').setValue('no'));
      ((addContextpackComponent.addContextPackForm).get('enabled').setValue('true'));
      ((addContextpackComponent.addContextPackForm.controls.wordPacks as FormArray).at(0).get('name').setValue('yes'));
      ((addContextpackComponent.addContextPackForm.controls.wordPacks as FormArray).at(0).get('enabled').setValue('true'));
      expect(addContextpackComponent.addContextPackForm.valid).toBeTruthy();
    });
  });
});
