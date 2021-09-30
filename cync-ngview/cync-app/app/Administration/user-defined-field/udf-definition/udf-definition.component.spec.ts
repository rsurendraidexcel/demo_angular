import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UdfDefinitionComponent } from './udf-definition.component';

describe('UdfDefinitionComponent', () => {
	let component: UdfDefinitionComponent;
	let fixture: ComponentFixture<UdfDefinitionComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UdfDefinitionComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UdfDefinitionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
