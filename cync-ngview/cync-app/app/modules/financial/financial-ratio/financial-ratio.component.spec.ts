import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialRatioComponent } from './financial-ratio.component';

describe('FinancialRatioComponent', () => {
	let component: FinancialRatioComponent;
	let fixture: ComponentFixture<FinancialRatioComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [FinancialRatioComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FinancialRatioComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
