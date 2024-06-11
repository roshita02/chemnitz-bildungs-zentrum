import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateUserAccountModalComponent } from './update-user-account-modal.component';

describe('UpdateUserAccountModalComponent', () => {
  let component: UpdateUserAccountModalComponent;
  let fixture: ComponentFixture<UpdateUserAccountModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateUserAccountModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateUserAccountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
