import { Component, inject, OnInit } from '@angular/core';
import { Auth } from '../../../services/auth';
import { Router } from '@angular/router';
import { GoogleAuth } from '../../../services/google-auth';
import { RouterLink } from "@angular/router";


@Component({
  selector: 'app-landing',
  imports: [RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing implements OnInit {
  private auth = inject(Auth);
  private router = inject(Router);
  private google = inject(GoogleAuth);

  loading = false;
  errorMsg = '';
  successMsg = '';

  ngOnInit() {
    this.googleSignIn();
  }

  async googleSignIn() {
    if (this.loading) return;
    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';
    try {
      const clientId =
        '486597157935-stn6eoocgi60pv8khvquftooeom6ufsr.apps.googleusercontent.com'; // or from environment
      const idToken = await this.google.getIdToken(clientId);

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

year = new Date().getFullYear();

  heroPins = [
    { src: 'https://images.unsplash.com/photo-1520880867055-1e30d1cb001c?q=80&w=1200&auto=format&fit=crop', alt: 'Moroccan tiles bathroom' },
    { src: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop', alt: 'Bedroom art wall' },
    { src: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1200&auto=format&fit=crop', alt: 'Avocado toasts' },
    { src: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=1200&auto=format&fit=crop', alt: 'Roasted chicken' },
    { src: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1200&auto=format&fit=crop', alt: 'Vibrant food' },
  ];

  pins = Array.from({ length: 24 }).map((_, i) => {
    const img = [
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520880867055-1e30d1cb001c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop',
    ][i % 7];

    return {
      src: img + '&sat=-5',
      alt: 'Inspiration ' + (i + 1),
      title: ['Cozy bath', 'Warm wood', 'Pattern mix', 'Art wall', 'Minimal corner'][i % 5],
      author: 'Designer ' + ((i % 9) + 1),
      authorAvatar: `https://i.pravatar.cc/48?img=${(i % 70) + 1}`
    };
  });


 

}
