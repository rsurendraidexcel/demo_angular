import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUdfDefinitionComponent } from './list-udf-definition.component';

describe('ListUdfDefinitionComponent', () => {
	let component: ListUdfDefinitionComponent;
	let fixture: ComponentFixture<ListUdfDefinitionComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ListUdfDefinitionComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ListUdfDefinitionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
