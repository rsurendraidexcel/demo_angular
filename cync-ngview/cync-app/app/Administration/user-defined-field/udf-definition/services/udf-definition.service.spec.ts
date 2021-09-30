import { TestBed, inject } from '@angular/core/testing';

import { UdfDefinitionService } from './udf-definition.service';

describe('UdfDefinitionService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [UdfDefinitionService]
		});
	});

	it('should be created', inject([UdfDefinitionService], (service: UdfDefinitionService) => {
		expect(service).toBeTruthy();
	}));
});
