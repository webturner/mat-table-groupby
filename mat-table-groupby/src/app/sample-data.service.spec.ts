import { TestBed, inject } from '@angular/core/testing';

import { SampleDataService } from './sample-data.service';

describe('SampleDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SampleDataService]
    });
  });

  it('should be created', inject([SampleDataService], (service: SampleDataService) => {
    expect(service).toBeTruthy();
  }));
});
