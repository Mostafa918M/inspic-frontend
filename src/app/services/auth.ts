import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_BASE } from '../api.token';


export interface SignUpDto {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}
@Injectable({
  providedIn: 'root',
})



export class Auth {

  private http = inject(HttpClient);
  private api = inject(API_BASE);

  signUp(dto:SignUpDto){
    return this.http.post<any>(`${this.api}/api/v1/auth/signup`,dto);
  }
  verifyEmail(payload: {email: string; code: string}) {
    return this.http.post<any>(`${this.api}/api/v1/auth/verify-email`, payload,{withCredentials: true});
  }
  resendVerificationCode(email: string) {
    return this.http.post<any>(`${this.api}/api/v1/auth/resend-verification`, { email });
  }
  signIn(payload: {email: string; password: string}) {
    return this.http.post<any>(`${this.api}/api/v1/auth/signin`, payload,{withCredentials: true});
  }

  forgetPassword(email: string) {
    return this.http.post<any>(`${this.api}/api/v1/auth/forget-password`, { email });
  }

  googleCallback(idToken: string) {
    return this.http.post<any>(`${this.api}/api/v1/auth/callback`, { idToken },{withCredentials: true});
  }
  
  signOut() {
    return this.http.post<any>(`${this.api}/api/v1/auth/signout`, {},{withCredentials: true});
  }
   clearSession() {
    sessionStorage.removeItem('accessToken');
    localStorage.removeItem('accessToken');
  }
}
