import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forget-password.css'
})
export class ForgotPassword {
  private auth = inject(Auth);
  forgotForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });
 isSubmitting = false;

 loading = false;
  successMsg = '';
  errorMsg = '';

  
  onSubmit() {
    if (this.forgotForm.valid) {
      const email = this.forgotForm.value.email.trim();
  
      this.loading = true;
      this.errorMsg = '';
      this.successMsg = '';
      this.auth.forgetPassword(email).subscribe({
        next: () => {
          this.loading = false;
          this.successMsg ='Password reset email sent.';
        },
        error: () => {
          this.loading = false;
          this.errorMsg = 'Failed to send password reset email.';
        },
      });

  }
}
}
