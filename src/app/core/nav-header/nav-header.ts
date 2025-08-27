import { Component, HostListener, inject, Input } from '@angular/core';
import { Auth } from '../../services/auth';
import { Pin } from '../../services/pin';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../services/user';
import { map, shareReplay } from 'rxjs';
import { ProfileUser } from '../pages/profile/profile';

type AnyObj = Record<string, any>;

@Component({
  selector: 'app-nav-header',
  imports: [RouterLink],
  templateUrl: './nav-header.html',
  styleUrl: './nav-header.css'
})
export class NavHeader {
   private auth = inject(Auth);
   private user = inject(User)
  private router = inject(Router);



profileOpen = false;

 constructor() {
    // Ensure profile is loaded even if Profile page hasn't been opened yet
    this.user.ensureProfile();
  }

  profilePrimary = [
    { label: 'Profile',  route: '/profile' },
    { label: 'Notifications', route: 'profile' },
  ];
  

 get u(): ProfileUser | null { return this.user.profile(); }
  get avatarUrl(): string | null { return this.u?.avatar ?? null; }
  get displayName(): string {
    const full = `${this.u?.firstName ?? ''} ${this.u?.lastName ?? ''}`.trim();
    return this.u?.username || full || 'User';
  }

    onAvatarError(e: Event) { (e.target as HTMLImageElement).src = 'assets/avatar-fallback.png'; }


  toggleProfile() { this.profileOpen = !this.profileOpen; }

  @HostListener('document:click', ['$event'])
  closeOnOutsideClick(e: MouseEvent) {
    const t = e.target as HTMLElement;
    if (!t.closest('[data-profile]')) this.profileOpen = false;
  }

  @HostListener('document:keydown.escape')
  closeOnEsc() { this.profileOpen = false;}

  onSignOut() {
    this.auth.signOut().subscribe({
      next: () => {
        this.auth.clearSession();          
        this.router.navigate(['']); 
      },
      error: (err) => {
        console.error('Error signing out', err);
        
        this.auth.clearSession();
        this.router.navigate(['']);
      }
    });
  }


}
