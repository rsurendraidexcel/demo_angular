import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipationPartiesComponent } from './participation-parties.component';

describe('ParticipationPartiesComponent', () => {
  let component: ParticipationPartiesComponent;
  let fixture: ComponentFixture<ParticipationPartiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipationPartiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipationPartiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
