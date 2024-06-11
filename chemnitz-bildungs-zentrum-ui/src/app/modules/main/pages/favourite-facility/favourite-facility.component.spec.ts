import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilitySearchResultsListComponent } from './favourite-facility.component';

describe('FacilitySearchResultsListComponent', () => {
  let component: FacilitySearchResultsListComponent;
  let fixture: ComponentFixture<FacilitySearchResultsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacilitySearchResultsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FacilitySearchResultsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
