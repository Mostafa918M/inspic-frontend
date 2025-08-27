import { Injectable } from '@angular/core';

declare global {
  interface Window { google: any; }
}

@Injectable({
  providedIn: 'root'
})
export class GoogleAuth {
  
  private scriptLoaded?: Promise<void>;

  private loadScript(): Promise<void> {
    if (this.scriptLoaded) return this.scriptLoaded;
    this.scriptLoaded = new Promise<void>((resolve, reject) => {
      const el = document.createElement('script');
      el.src = 'https://accounts.google.com/gsi/client';
      el.async = true;
      el.defer = true;
      el.onload = () => resolve();
      el.onerror = reject;
      document.head.appendChild(el);
    });
    return this.scriptLoaded;
  }

  async getIdToken(clientId: string, loginHint?: string): Promise<string> {
  await this.loadScript();
  return new Promise<string>((resolve, reject) => {
    const cb = (resp: any) => {
      if (resp?.credential) resolve(resp.credential);
      else reject(new Error('No Google credential returned'));
    };

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: cb,
      ux_mode: 'popup',
      use_fedcm_for_prompt:  true, // <— recommended going forward
      auto_select: false,
      itp_support: true,
      login_hint: loginHint || undefined,
      context: 'signin',
    });

    window.google.accounts.id.prompt((n: any) => {
      if (n.isNotDisplayed?.()) {
        console.warn('GSI not displayed:', n.getNotDisplayedReason?.());
        reject(new Error(`Google Sign-In not displayed: ${n.getNotDisplayedReason?.() || 'unknown'}`));
      } else if (n.isSkippedMoment?.()) {
        console.warn('GSI skipped:', n.getSkippedReason?.());
        reject(new Error(`Google Sign-In skipped: ${n.getSkippedReason?.() || 'unknown'}`));
      } else if (n.isDismissedMoment?.()) {
        console.warn('GSI dismissed:', n.getDismissedReason?.());
        reject(new Error(`Google Sign-In dismissed: ${n.getDismissedReason?.() || 'unknown'}`));
      }
    });
  });
}}