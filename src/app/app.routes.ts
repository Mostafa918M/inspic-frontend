import { Routes } from '@angular/router';
import { SignIn } from './auth/sign-in/sign-in';
import { SignUp } from './auth/sign-up/sign-up';
import { ForgotPassword } from './auth/forget-password/forgot-password';
import { FormBox } from './auth/form-box/form-box';
import { VerifyEmail } from './auth/verify-email/verify-email';
import { Home } from './core/pages/home/home';
import { ResendVerification } from './auth/resend-verification/resend-verification';
import { Profile } from './core/pages/profile/profile';
import { authGuard } from './auth/auth-guard';
import { Landing } from './core/pages/landing/landing';
import { noAuthGuard } from './auth/no-auth-guard';
import { ResetPassword } from './auth/reset-password/reset-password';
import { CreatePin } from './core/pages/create-pin/create-pin';
import { Feed } from './core/pages/feed/feed';
import { Search } from './core/pages/search/search';
import { PinDetails } from './core/pages/pin-details/pin-details';

export const routes: Routes = [
{ path: '', component: Landing, canActivate: [noAuthGuard] },

  { path: 'landing', redirectTo: '', pathMatch: 'full' },

  {
    path: 'auth',
    component: FormBox,
    children: [
      { path: 'sign-in', component: SignIn, canActivate: [noAuthGuard] },
      { path: 'sign-up', component: SignUp, canActivate: [noAuthGuard] },
      { path: 'reset-password', component: ResetPassword, canActivate: [noAuthGuard] },
      { path: 'forgot-password', component: ForgotPassword, canActivate: [noAuthGuard] },
      { path: 'verify-email', component: VerifyEmail },
      { path: 'resend-verification', component: ResendVerification },
      { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
    ],
  },

  {
    path: '',
    component: Home,              // <-- layout container
    canActivate: [authGuard],
    children: [
      { path: 'home', redirectTo: 'feed', pathMatch: 'full' }, 

      { path: 'feed', component: Feed },
      { path: 'profile', component: Profile },
      { path: 'create-pin', component: CreatePin },
      {path: 'search', component: Search},
      {path:'pin',component:PinDetails},

      { path: '', redirectTo: 'feed', pathMatch: 'full' },
    ],
  },


  { path: '**', redirectTo: '' },
];
