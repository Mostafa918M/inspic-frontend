import { Component, inject, OnInit } from '@angular/core';
import {
  passwordValidator,
  confirmPasswordValidator,
} from '../../Validators/passwordValidator';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Auth, SignUpDto } from '../../services/auth';
import { first } from 'rxjs';
import { Router } from '@angular/router';
import { GoogleAuth } from '../../services/google-auth';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  private auth = inject(Auth);
  private router = inject(Router);
  private google = inject(GoogleAuth);

  signupForm: FormGroup = new FormGroup(
    {
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        passwordValidator('username', 'email'),
      ]),
      confirmPassword: new FormControl('', Validators.required),
    },
    { validators: confirmPasswordValidator('password', 'confirmPassword') }
  );

  loading = false;
  errorMsg = '';
  successMsg = '';
  onSubmit() {
    if (this.signupForm.invalid || this.loading) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    const { confirmPassword, ...raw } = this.signupForm.getRawValue();

    const payload: SignUpDto = {
      firstName: (raw.firstName || '').trim(),
      lastName: (raw.lastName || '').trim(),
      username: (raw.username || '').trim(),
      email: (raw.email || '').trim(),
      password: raw.password as string,
    };

    this.auth
      .signUp(payload)
      .pipe(first())
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/auth/verify-email'], {
            queryParams: { email: payload.email },
          });
        },
        error: (err) => {
          this.loading = false;
          this.errorMsg =
            err?.error?.message ||
            'An error occurred during sign-up. Please try again.';
        },
      });
  }

  async googleSignIn() {
    if (this.loading) return;
    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';
    try {
      const clientId =
        '486597157935-stn6eoocgi60pv8khvquftooeom6ufsr.apps.googleusercontent.com'; 
      const hint = (this.signupForm.value.email || '') as string;
      const idToken = await this.google.getIdToken(clientId, hint);

      this.auth.googleCallback(idToken).subscribe({
        next: (res) => {
          this.loading = false;
          this.successMsg = res?.message || 'Signed in with Google.';

          const token = res?.data?.accessToken || res?.accessToken || '';
          if (token) {
            sessionStorage.setItem('accessToken', token);
          }
          this.router.navigate(['profile']);
        },
        error: (err) => {
          this.loading = false;
          this.errorMsg = err?.error?.message || 'Google sign-in failed.';
        },
      });
    } catch (e: any) {
      this.loading = false;
      this.errorMsg = e?.message || 'Google sign-in cancelled.';
    }
  }
}
