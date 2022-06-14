import { AbstractControl, Validators } from "@angular/forms";

export function requiredIfPw(formControl: AbstractControl) {
    if (!formControl.parent) {
      return null;
    }

    if (formControl.parent.get('password')?.value && !formControl.value) {
      return Validators.required(formControl);
    }
    return null;
}
