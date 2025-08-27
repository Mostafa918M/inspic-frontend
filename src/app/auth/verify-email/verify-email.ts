import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css'
})
export class VerifyEmail {
private route = inject(ActivatedRoute);
  private auth  = inject(Auth);
  private router = inject(Router);

  email = signal<string>('');
  loading = signal(false);
  successMsg = signal('');
  errorMsg = signal('');
  cooldown = signal(0);

  form = new FormGroup({
    code: new FormControl('',[Validators.required,Validators.minLength(6),Validators.maxLength(6)])
  })

   constructor() {
    this.route.queryParamMap.subscribe(q => this.email.set((q.get('email') || '').trim()));
  }

  onSubmit(){
    if (this.form.invalid || this.loading()) { this.form.markAllAsTouched(); return; }
    if (!this.email()) { this.errorMsg.set('Missing email. Please sign up again.'); return; }

    this.loading.set(true); this.errorMsg.set(''); this.successMsg.set('');

    this.auth.verifyEmail({ email: this.email(), code: this.form.value.code as string })
      .subscribe({
        next: (res) => {
          this.loading.set(false);
          const msg = res?.message || 'Email verified successfully!';
          this.successMsg.set(msg);
          const token = res?.data?.accessToken ?? res?.accessToken;
          if (token) {
            sessionStorage.setItem('accessToken', token);
          }
          setTimeout(() => this.router.navigate(['home']), 600);
        },
        error: (err) => {
          this.loading.set(false);

          this.errorMsg.set(err?.error?.message || 'Verification failed.');
        }
      });

  }

  resend() {
    if (!this.email() || this.loading() || this.cooldown() > 0) return;

    this.loading.set(true); this.errorMsg.set(''); this.successMsg.set('');
    this.auth.resendVerificationCode(this.email()).subscribe({
      next: (res) => {
        this.loading.set(false);
        // Success message could be:
        //  - "Verification code sent."
        //  - "If this email exists, a new code was sent."
        this.successMsg.set(res?.message || 'A new code has been sent.');
        this.startCooldown(60); // client-side cool-down; server enforces own window too
      },
      error: (err) => {
        this.loading.set(false);
        // e.g. "Please wait before requesting another code."
        this.errorMsg.set(err?.error?.message || 'Could not resend code.');
      }
    });
  }
  private startCooldown(s: number) {
    this.cooldown.set(s);
    const id = setInterval(() => {
      const n = this.cooldown() - 1;
      this.cooldown.set(n);
      if (n <= 0) clearInterval(id);
    }, 1000);
  }
}
