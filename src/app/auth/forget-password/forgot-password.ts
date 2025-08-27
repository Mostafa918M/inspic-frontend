import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forget-password.css'
})
export class ForgotPassword {
forgotForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });
 isSubmitting = false;
  successMsg = '';
  errorMsg = '';

  
  onSubmit() {
    if (this.forgotForm.valid) {
      console.log(this.forgotForm.value);
      // Handle successful password reset
    }
  }
}
