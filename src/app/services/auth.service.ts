import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService, User } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private apiService: ApiService) {
    // Check if user is already authenticated on service initialization
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    if (this.apiService.isAuthenticated()) {
      this.isAuthenticatedSubject.next(true);
      // Verify token is still valid
      this.apiService.verifyToken().subscribe({
        next: (response) => {
          if (!response.success) {
            this.logout();
          }
        },
        error: () => {
          this.logout();
        }
      });
    }
  }

  async loginWithGoogle(): Promise<boolean> {
    try {
      // Load Google Identity Services
      await this.loadGoogleIdentityServices();
      
      // Initialize Google Sign-In
      const client = google.accounts.oauth2.initTokenClient({
        client_id: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your actual client ID
        scope: 'email profile',
        callback: async (response: any) => {
          try {
            const result = await this.apiService.loginWithGoogle(response.access_token).toPromise();
            if (result && result.success) {
              this.isAuthenticatedSubject.next(true);
              return true;
            }
          } catch (error) {
            console.error('Login error:', error);
          }
          return false;
        }
      });

      // Request access token
      client.requestAccessToken();
      return true;
    } catch (error) {
      console.error('Google login initialization error:', error);
      return false;
    }
  }

  private loadGoogleIdentityServices(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof google !== 'undefined' && google.accounts) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => {
        if (typeof google !== 'undefined' && google.accounts) {
          resolve();
        } else {
          reject(new Error('Google Identity Services failed to load'));
        }
      };
      script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
      document.head.appendChild(script);
    });
  }

  logout(): void {
    this.apiService.logout();
    this.isAuthenticatedSubject.next(false);
  }

  getCurrentUser(): User | null {
    return this.apiService.getCurrentUser();
  }

  isAuthenticated(): boolean {
    return this.apiService.isAuthenticated();
  }
}

// Extend the global Window interface to include google
declare global {
  interface Window {
    google: any;
  }
}
