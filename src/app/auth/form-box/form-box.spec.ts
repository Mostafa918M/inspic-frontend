import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBox } from './form-box';

describe('FormBox', () => {
  let component: FormBox;
  let fixture: ComponentFixture<FormBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormBox]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormBox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
