import { TestBed } from '@angular/core/testing';

import { Pin } from './pin';

describe('Pin', () => {
  let service: Pin;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Pin);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
