import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePin } from './create-pin';

describe('CreatePin', () => {
  let component: CreatePin;
  let fixture: ComponentFixture<CreatePin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
