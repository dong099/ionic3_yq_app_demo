import { NgModule } from '@angular/core';
import { DisableControlDirective } from './disable-control/disable-control';
import { EmailValidatorDirective } from './email-validator/email-validator';
@NgModule({
	declarations: [DisableControlDirective,
    EmailValidatorDirective],
	imports: [],
	exports: [DisableControlDirective,
    EmailValidatorDirective]
})
export class DirectivesModule {}
