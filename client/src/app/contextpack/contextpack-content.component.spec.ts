import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteStub } from 'src/testing/activated-route-stub';
import { MockContextPackService } from 'src/testing/contextpack.service.mock';
import { ContextpackService } from './contextpack.service';
import { ContextPack } from './contextpack';
import { ContextpackCardComponent} from './contextpack-card.component';
import { ContextpackContentComponent } from './contextpack-content.component';

describe('ContextpackContentComponent', () => {
  let component: ContextpackContentComponent;
  let fixture: ComponentFixture<ContextpackContentComponent>;
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports : [
        RouterTestingModule,
        MatCardModule
      ],
      declarations: [ ContextpackContentComponent, ContextpackCardComponent],
      providers: [
        {provide: ContextpackService, useValue: new MockContextPackService() },
        {provide: ActivatedRoute, useValue: activatedRoute }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextpackContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to a specific context pack profile', () => {
    const expectedContextPack: ContextPack = MockContextPackService.testContextPacks[0];
    // Setting this should cause anyone subscribing to the paramMap
    // to update. Our `ContextpackContentComponent` subscribes to that, so
    // it should update right away.
    activatedRoute.setParamMap({ id: expectedContextPack._id });

    expect(component.id).toEqual(expectedContextPack._id);
    expect(component.contextPack).toEqual(expectedContextPack);
  });

  it('should navigate to correct context pack when the id parameter changes', () => {
    let expectedContextPack: ContextPack = MockContextPackService.testContextPacks[0];
    // Setting this should cause anyone subscribing to the paramMap
    // to update. Our `ContextpackContentComponent` subscribes to that, so
    // it should update right away.
    activatedRoute.setParamMap({ id: expectedContextPack._id });

    expect(component.id).toEqual(expectedContextPack._id);

    //Changing the paramMap should update the displayed context pack profile.
    expectedContextPack = MockContextPackService.testContextPacks[1];
    activatedRoute.setParamMap({ id: expectedContextPack._id });
    expect(component.id).toEqual(expectedContextPack._id);
  });

  it('should have null for the user for a bad ID', () => {
    activatedRoute.setParamMap({ id: 'badID'});

    // If the given ID doesn't map to a context pack, we expect the service
    // to return `null`, so we would expect the component's contextpack
    // to also be `null`.
    expect(component.id).toEqual('badID');
    expect(component.contextPack).toBeNull();
  });

});
