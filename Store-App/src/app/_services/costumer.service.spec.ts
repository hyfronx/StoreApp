/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CostumerService } from './costumer.service';

describe('Service: Costumer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CostumerService]
    });
  });

  it('should ...', inject([CostumerService], (service: CostumerService) => {
    expect(service).toBeTruthy();
  }));
});
