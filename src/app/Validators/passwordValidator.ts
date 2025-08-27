import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

function passwordValidator(usernameKey: string, emailKey: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.value || '';
    const parent = control.parent;
    if (!parent) return null;

    const username = parent.get(usernameKey)?.value || '';
    const email = parent.get(emailKey)?.value || '';

    const errors: string[] = [];

    if (password.length < 8) errors.push("At least 8 characters");
    if (password.length > 128) errors.push("No more than 128 characters");
    if (!/[A-Z]/.test(password)) errors.push("Add at least one uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("Add at least one lowercase letter");
    if (!/[0-9]/.test(password)) errors.push("Add at least one number");
    if (!/[^A-Za-z0-9]/.test(password)) errors.push("Add at least one symbol (e.g., @#$%&)");
    if (/\s/.test(password)) errors.push("Remove spaces");

    const common = ["password","passw0rd","password1","123456","123456789","12345678","qwerty","abc123","111111"];
    if (common.includes(password.toLowerCase())) errors.push("Avoid common/breached passwords");

    const lower = password.toLowerCase();
    const local = email.includes('@') ? email.split('@')[0] : '';
    if ((username && username.length >= 3 && lower.includes(username.toLowerCase())) ||
        (local && local.length >= 3 && lower.includes(local.toLowerCase()))) {
      errors.push("Password must not contain your name or email");
    }

    return errors.length > 0 ? { passwordInvalid: errors } : null;
  };
}


function confirmPasswordValidator(passwordKey: string, confirmKey: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get(passwordKey)?.value;
    const confirm = group.get(confirmKey)?.value;
    return password && confirm && password !== confirm ? { passwordMismatch: true } : null;
  };
}

export { passwordValidator, confirmPasswordValidator };