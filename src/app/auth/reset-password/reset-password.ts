import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordValidator } from '../../Validators/passwordValidator';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword {
  private route = inject(ActivatedRoute);
    private router = inject(Router);
  private auth = inject(Auth)

  token: string | null = null;

  NewPasswordForm :FormGroup = new FormGroup({
    newPassword: new FormControl('', [Validators.required, passwordValidator('username', 'email')])
  });

  loading = false;
  errorMsg = '';
  successMsg = '';

  onSubmit(){

    const token = (this.route.snapshot.queryParamMap.get('token') || '').trim();
    console.log('Token from URL:', token);
    console.log('New Password:', this.NewPasswordForm.value.newPassword);
    if (!token) {
      this.errorMsg = 'Missing token in URL.';
      return;
    }
 

    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    this.auth.resetPassword({ token, newPassword: this.NewPasswordForm.value.newPassword as string }).subscribe({
      next: () => {
        this.loading = false;
        this.successMsg = 'Password reset successful';
        this.router.navigate(['/sign-in']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Password reset failed';
        console.error('Password reset failed', err);
      },
    });
  }
}


