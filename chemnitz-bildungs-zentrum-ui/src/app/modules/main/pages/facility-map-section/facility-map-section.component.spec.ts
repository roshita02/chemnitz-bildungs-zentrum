import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityMapSectionComponent } from './facility-map-section.component';

describe('FacilityMapSectionComponent', () => {
  let component: FacilityMapSectionComponent;
  let fixture: ComponentFixture<FacilityMapSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacilityMapSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FacilityMapSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
