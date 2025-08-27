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

export const routes: Routes = [
    {path: 'auth',component:FormBox,children:[
        { path: 'sign-in', component: SignIn , canActivate:[noAuthGuard]},
        { path: 'sign-up', component: SignUp , canActivate:[noAuthGuard]},
        { path: 'forgot-password', component: ForgotPassword , canActivate:[noAuthGuard]},
        { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
        { path: 'verify-email', component: VerifyEmail },
        { path: 'resend-verification', component: ResendVerification },
    ]},

    {path:'home',component:Home, canActivate:[authGuard]},
    {path:'profile',component:Profile , canActivate:[authGuard]},
    {path:'',component:Landing,canActivate:[noAuthGuard]},
    {path:'',redirectTo:'landing',pathMatch:'full'},

    {path: '**', redirectTo: '' }
];
