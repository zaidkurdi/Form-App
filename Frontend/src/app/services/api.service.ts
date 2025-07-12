import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  signUp(data: any) {
    return this.http.post('http://localhost:5000/api/signup', data);
  }

  logIn(data: any) {
    return this.http.post('http://localhost:5000/api/login', data);
  }

  home() {
    return this.http.get('http://localhost:5000/api/home');
  }

  refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    console.log('refresh: ', refreshToken);

    return this.http.post('http://localhost:5000/api/refresh', {
      refreshToken,
    });
  }

  sharedData: any;
}
