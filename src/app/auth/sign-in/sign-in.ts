import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { first } from 'rxjs';
import { passwordValidator } from '../../Validators/passwordValidator';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { GoogleAuth } from '../../services/google-auth';


@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export class SignIn {
  private auth = inject(Auth);
  private router = inject(Router);
    private google = inject(GoogleAuth);


  SignInForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      passwordValidator('email', 'email'),
    ]),
  });

  loading = false;
  errorMsg = '';
  successMsg = '';

  onSubmit() {
    if (this.SignInForm.invalid || this.loading) {
      this.SignInForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    const email = (this.SignInForm.value.email || '').trim();
    const password = this.SignInForm.value.password as string;

    const payload = { email: email, password };

    this.auth.signIn(payload).subscribe({
      next: (res) => {
        this.loading = false;

        const user = res?.data?.user ?? res?.user ?? null;

        const isVerified = user?.isEmailVerified ?? true;

        if (!isVerified) {
          this.successMsg = 'Please verify your email to continue.';
          this.router.navigate(['/verify-email'], { queryParams: { email } });
          return;
        }

        this.successMsg = 'Signed in successfully.';
        const token =
          res?.data?.accessToken || // if your sendResponse wraps data
          res?.accessToken || // if it’s top-level
          '';

        if (token) {
          sessionStorage.setItem('accessToken', token); // or a service
        }
        this.router.navigate(['home']);
      },
      error: (err) => {
        this.loading = false;

        const msg = (err?.error?.message || '').toLowerCase();
        this.errorMsg =
          err?.error?.message || 'Sign in failed. Please try again.';

        if (msg.includes('verify') || msg.includes('unverified')) {
          this.router.navigate(['/verify-email'], { queryParams: { email } });
        }
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
        '486597157935-stn6eoocgi60pv8khvquftooeom6ufsr.apps.googleusercontent.com'; // or from environment
      const hint = (this.SignInForm.value.email || '') as string;
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
