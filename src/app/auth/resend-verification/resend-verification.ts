import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-resend-verification',
  imports: [RouterLink],
  templateUrl: './resend-verification.html',
  styleUrl: './resend-verification.css'
})
export class ResendVerification {
private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(Auth);

   email = signal<string>('');
  loading = signal<boolean>(true);
  success = signal<string>('');
  error = signal<string>('');

   constructor() {
    this.route.queryParamMap.subscribe(q => {
      const e = (q.get('email') || '').trim();
      this.email.set(e);

      if (!e) {
        this.loading.set(false);
        this.error.set('Missing email. Please sign up again.');
        return;
      }

      this.auth.resendVerificationCode(e).subscribe({
        next: (res) => {
          this.loading.set(false);
          this.success.set(res?.message || 'Verification code sent.');
          setTimeout(() => {
            this.router.navigate(['/verify-email'], { queryParams: { email: e } });
          }, 800);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err?.error?.message || 'Could not resend the code. Please try again later.');
        }
      });
    });
  }
}
