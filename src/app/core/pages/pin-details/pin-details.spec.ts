import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PinDetails } from './pin-details';

describe('PinDetails', () => {
  let component: PinDetails;
  let fixture: ComponentFixture<PinDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PinDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PinDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
