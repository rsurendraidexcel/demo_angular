import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialStatementsComponent } from './financial-statements.component';

describe('FinancialStatementsComponent', () => {
	let component: FinancialStatementsComponent;
	let fixture: ComponentFixture<FinancialStatementsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [FinancialStatementsComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FinancialStatementsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});
});
