import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class ConfirmPasswordValidator {
  static passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const passwordControl = control.get('password');
    const confirmPasswordControl = control.get('confirmPassword');

    if (!passwordControl || !confirmPasswordControl) {
      return null; // return if form controls are not found
    }

    const password = passwordControl.value;
    const confirmPassword = confirmPasswordControl.value;

    if (password !== confirmPassword) {
      confirmPasswordControl.setErrors({ NoPasswordMatch: true });
    } else {
      confirmPasswordControl.setErrors(null);
    }

    return null; // return null to indicate no error on the parent form group
  }
}
