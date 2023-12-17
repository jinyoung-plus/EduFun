import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurVenuesComponent } from './our-venues.component';

describe('OurVenuesComponent', () => {
  let component: OurVenuesComponent;
  let fixture: ComponentFixture<OurVenuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OurVenuesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OurVenuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
