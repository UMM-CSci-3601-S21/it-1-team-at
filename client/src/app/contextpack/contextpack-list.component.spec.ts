import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ContextpackService } from './contextpack.service';

import { MockContextPackService } from '../../testing/contextpack.service.mock';
import { ContextpackListComponent } from './contextpack-list.component';
import { ContextPack } from './contextpack';
import { Observable } from 'rxjs';


const COMMON_IMPORTS: any[] = [
  FormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatOptionModule,
  MatButtonModule,
  MatInputModule,
  MatExpansionModule,
  MatTooltipModule,
  MatListModule,
  MatDividerModule,
  MatRadioModule,
  MatSnackBarModule,
  BrowserAnimationsModule,
  RouterTestingModule,
  HttpClientTestingModule
];

describe('ContextpackListComponent', () => {
  let contextPackList: ContextpackListComponent;
  let fixture: ComponentFixture<ContextpackListComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [ COMMON_IMPORTS ],
      declarations: [ ContextpackListComponent ],
      providers: [{ provide: ContextpackService, useClass: MockContextPackService}]
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(ContextpackListComponent);
      contextPackList = fixture.componentInstance;
      fixture.detectChanges();
      contextPackList.getContextPacksFromServer();
    });
  }));

  it('should create', () => {
    expect(contextPackList).toBeTruthy();
  });

  it('contains all the ContextPacks', () => {
    expect(contextPackList.serverFilteredContextPacks.length).toBe(3);
  });

  it('contains a ContextPack named \'fun\'', () => {
    expect(contextPackList.serverFilteredContextPacks.some((contextPack: ContextPack) => contextPack.name === 'fun')).toBe(true);
  });

  it('contain a ContextPack named \'sun\'', () => {
    expect(contextPackList.serverFilteredContextPacks.some((contextPack: ContextPack) => contextPack.name === 'sun')).toBe(true);
  });

  it('doesn\'t contain a ContextPack named \'Santa\'', () => {
    expect(contextPackList.serverFilteredContextPacks.some((contextPack: ContextPack) => contextPack.name === 'Santa')).toBe(false);
  });
});

describe('Misbehaving context pack list', () => {
  let contextPackList: ContextpackListComponent;
  let fixture: ComponentFixture<ContextpackListComponent>;

  let contextPackServiceStub: {
    getContextPacks: () => Observable<ContextPack[]>;
    getContextPacksFiltered: () => Observable<ContextPack[]>;
  };

  beforeEach(() => {
    // stub ContextPackService for test purposes
    contextPackServiceStub = {
      getContextPacks: () => new Observable(observer => {
        observer.error('Error-prone observable');
      }),
      getContextPacksFiltered: () => new Observable(observer => {
        observer.error('Error-prone observable');
      })
    };

    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [ContextpackListComponent],
      // providers:    [ ContextPackService ]  // NO! Don't provide the real service!
      // Provide a test-double instead
      providers: [{ provide: ContextpackService, useValue: contextPackServiceStub }]
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(ContextpackListComponent);
      contextPackList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('generates an error if we don\'t set up a ContextPackListService', () => {
    // Since the observer throws an error, we don't expect ContextPacks to be defined.
    expect(contextPackList.serverFilteredContextPacks).toBeUndefined();
  });
});
