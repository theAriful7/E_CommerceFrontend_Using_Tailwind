import { TestBed } from '@angular/core/testing';

import { CartStateServiceService } from './cart-state-service.service';

describe('CartStateServiceService', () => {
  let service: CartStateServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartStateServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
