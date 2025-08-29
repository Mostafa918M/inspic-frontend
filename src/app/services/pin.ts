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

   getPin(NO_CACHE = false): Observable<any> { 
  const options: any = { withCredentials: true };
  const bust = NO_CACHE ? `&_=${Date.now()}` : '';
  return this.http.get<any>(`${this.api}/api/v1/pins/recommendations?limit=30${bust}`, options);
}
createPin(payload: {
  media: File;
  title: string;
  description?: string;
  link?: string;
  keywords?: string;
  privacy?: 'public' | 'private';
}) { return this.http.post<any>(`${this.api}/api/v1/pins/create-pin`,payload, {
    withCredentials: true,
  });
}
searchPins(query:string){
  return this.http.get<any>(`${this.api}/api/v1/pins/get-pins`, {
    params: { keywords: query },
    withCredentials: true,
  });
}
getPinById(PinId:string){
  return this.http.get<any>(`${this.api}/api/v1/pins/${PinId}`, { withCredentials: true });
}

likePin(pinId: string) {
  return this.http.post<any>(`${this.api}/api/v1/pins/liked-pins/${pinId}`, {}, { withCredentials: true });
}
unlikePin(pinId: string) {
  return this.http.post<any>(`${this.api}/api/v1/pins/unlike-pin/${pinId}`, {}, { withCredentials: true });
}
downloadPin(pinId: string) {
  return this.http.get(`${this.api}/api/v1/pins/${pinId}/download`, {
    withCredentials: true,
    responseType: 'blob' as const, 
  });
}
getPopularPins(){
  return this.http.get<any>(`${this.api}/api/v1/pins/popular`, { withCredentials: true });
}}
