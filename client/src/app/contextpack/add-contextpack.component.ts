import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ContextPack } from './contextpack';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { WordPack } from './contextpack';
import { ContextpackService } from './contextpack.service';
// import { AddContextPackPage } from '../../../cypress/support/add-contextpack.po';

@Component({
  selector: 'app-add-contextpack',
  templateUrl: './add-contextpack.component.html',
  styleUrls: ['./add-contextpack.component.scss']
})
export class AddContextpackComponent implements OnInit {

  // Most of this is from the Purple Tigers https://github.com/UMM-CSci-3601-S21/it-1-purple-tigers
  addContextPackForm: FormGroup;
  shown = false;
  wordPack: WordPack;
  contextpack: ContextPack;
  enabled = true;

  formErrors = {
    wordpacks: this.wordPacksErrors()
  };

  addContextPackValidationMessages = {
    wordPacks: {
      name: [
        {type: 'required', message: 'Name is required'}
      ],
      enabled: {required: 'Must be true or false'},
      nouns: { word: {}, forms: {}},
      verbs: { word: {}, forms: {}},
      adjectives: { word: {}, forms: {}},
      misc: { word: {}, forms: {}}
    }
  };

  constructor(private fb: FormBuilder, private contextPackService: ContextpackService,
    private snackBar: MatSnackBar, private router: Router) { }

    createForms() {
      this.addContextPackForm = this.fb.group({
        name: new FormControl('', Validators.compose([
          Validators.required
        ])),
        enabled: new FormControl('true', Validators.compose([
          Validators.required,
          Validators.pattern('^(true|false)'),
        ])),
        icon: '',
        wordPacks: this.fb.array([])
      });
      this.addContextPackForm.valueChanges.subscribe(data => this.validateForm());
    }

  ngOnInit(): void {
    this.createForms();
  }

  initWordPack() {
    return this.fb.group({
      name: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      enabled: new FormControl('true', Validators.compose([
        Validators.required,
        Validators.pattern('^(true|false)$'),
      ])),
      nouns: this.fb.array([]),
      adjectives: this.fb.array([]),
      verbs: this.fb.array([]),
      misc: this.fb.array([])

    });
  }

  initWords() {
    return this.fb.group({
      word: [''],
      forms: this.fb.array([
         this.fb.control('')
      ])
    });
  }

  addWordPack() {
    const control = this.addContextPackForm.controls.wordPacks as FormArray;
    control.push(this.initWordPack());
  }

  addPosArray(ix: number, pos: string){
    const control = (this.addContextPackForm.controls.wordPacks as FormArray).at(ix).get(`${pos}`) as FormArray;
    control.push(this.initWords());
  }

  addForms(ix: number, iy: number, pos: string) {
    const control = ((this.addContextPackForm.controls.wordPacks as FormArray).at(ix).get(`${pos}`) as FormArray)
    .at(iy).get('forms') as FormArray;
    control.push(this.fb.control(''));
  }

  setWord(ix: number, iy: number, pos: string){
    const control = ((this.addContextPackForm.controls.wordPacks as FormArray).at(ix).get(`${pos}`) as FormArray)
    .at(iy).get('forms') as FormArray;

    const formAdd = ((this.addContextPackForm.controls.wordPacks as FormArray).at(ix).get(`${pos}`) as FormArray).at(iy).get('word');
    console.log('didn\'t go through');
    if(control.getRawValue()[0] !== formAdd.value  ){
      control.insert(0,formAdd);
      console.log(ix,iy);
    }
  }

  validateForm(){
    this.validateWordPacks();
  }

  validateWordPacks() {
    const wordPacks = this.addContextPackForm.controls.wordPacks as FormArray;
    this.formErrors.wordpacks = [];
    for (let index = 1; index <= wordPacks.length; index++) {
      this.formErrors.wordpacks.push({
        name: [' ', [Validators.required]],
        enabled: [' ', [Validators.required]],
        nouns: [{
          word: '',
          forms: this.fb.array([
            this.fb.control('')
          ]),
        }]
      });
    }
  }

  wordPacksErrors() {
    return [{
      name: [' ', [Validators.required]],
      enabled: [' ', [Validators.required]],
      nouns: this.wordsErrors(),
    }];
  };

  wordsErrors() {
    return [{
      word: '',
      forms: this.fb.array([this.fb.control('')])
    }];
  };

  submitForm() {
    this.contextPackService.addContextPack(this.addContextPackForm.value).subscribe(newID => {
      this.snackBar.open('Added Pack ' + this.addContextPackForm.value.name, null, {
        duration: 2000,
      });
      this.router.navigate(['/contextpacks/', newID]);
    }, err => {
      this.snackBar.open(
        'Failed to add the context pack (check that all fields are filled in and the icon filename ends with .png)', 'OK', {
        duration: 5000,
      });
    });
  }
}
