import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_BASE } from '../api.token';
import { Observable } from 'rxjs';




export interface PinMedia {
  uri: string;
  URL: string;
  filename: string;
  type: 'image' | 'video';
  thumbnail: string | null;
}

export interface PinPublisher {
  _id: string;
  username: string;
  avatar: string;
}

export interface PinItem {
  _id: string;
  title: string;
  description: string | null;
  link: string | null;
  privacy: 'public' | 'private';
  media: PinMedia;
  publisher: PinPublisher | null;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PinResponse {
  status: 'success' | 'error';
  message: string;
  data: {
    pins: PinItem[];
  };
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class Pin {
    private http = inject(HttpClient);
    private api = inject(API_BASE);

    getPin(): Observable<any> {
        return this.http.get(`${this.api}/api/v1/pins/recommendations`);
    }

}
