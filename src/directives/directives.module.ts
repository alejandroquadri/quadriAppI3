import { NgModule } from '@angular/core';
import { TextMaskDirective } from './text-mask/text-mask';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
	declarations: [
		TextMaskDirective
	],
	imports: [
		PipesModule
	],
	exports: [
		TextMaskDirective
	]
})
export class DirectivesModule {}
