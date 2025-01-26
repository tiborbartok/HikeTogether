import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HikesComponent } from './hikes.component';

describe('HikesComponent', () => {
  let component: HikesComponent;
  let fixture: ComponentFixture<HikesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HikesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HikesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
