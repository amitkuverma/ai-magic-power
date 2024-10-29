import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class CookieService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.getCookie("token")
  }

  getCookie(name: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const nameEQ = name + "=";
      const cookiesArray = document.cookie.split(';');
      for (let i = 0; i < cookiesArray.length; i++) {
        let cookie = cookiesArray[i].trim();
        if (cookie.indexOf(nameEQ) === 0) {
          return cookie.substring(nameEQ.length, cookie.length);
        }
      }
    }
    return null;
  }

  setCookie(name: string, value: string, days: number): void {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${value}; ${expires}; path=/`;
  }

  deleteCookie(name: string): void {
    if (isPlatformBrowser(this.platformId)) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  }

  decodeToken(): any {
    try {
      const token = this.getCookie('token');
      return token ? jwtDecode(token) : null; // Check if token exists before decoding
    } catch (error) {
      console.error('Token decoding failed', error);
      return null;
    }
  }

  isAdmin(): boolean {
    const decodedToken = this.decodeToken();
    return decodedToken ? decodedToken.isAdmin : false; // Return false if decodedToken is null
  }
  
  getTokenExpiration(): number | null {
    const decodedToken = this.decodeToken();
    return decodedToken ? decodedToken.exp : null;
  }

  isTokenExpired(): boolean {
    const exp = this.getTokenExpiration();
    if (exp === null) return true; // Return true if there's no expiration time
    
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return exp < currentTime;
  }
}
