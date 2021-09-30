import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUdfDefinitionComponent } from './manage-udf-definition.component';

describe('ManageUdfDefinitionComponent', () => {
	let component: ManageUdfDefinitionComponent;
	let fixture: ComponentFixture<ManageUdfDefinitionComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ManageUdfDefinitionComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ManageUdfDefinitionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
