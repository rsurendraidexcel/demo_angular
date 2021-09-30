import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { FormulaDirective } from './formula.directive';
import { FormulaListComponent } from './formula-list.component';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        FormulaDirective,
        FormulaListComponent
    ],
    entryComponents: [
        FormulaListComponent
    ],
    declarations: [
        FormulaDirective,
        FormulaListComponent
    ]
})
export class FormulaModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: FormulaModule
        };
    }
}
