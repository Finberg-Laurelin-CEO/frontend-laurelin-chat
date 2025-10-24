import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService, User } from './api.service';
import { environment, production } from '../config/environment';

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

  async loginWithGoogle(): Promise<{ success: boolean; error?: string; message?: string }> {
    try {
      // Load Google Identity Services
      await this.loadGoogleIdentityServices();

      return new Promise((resolve) => {
        // Initialize Google Sign-In
        const googleClientId = (typeof window !== 'undefined' && window.location.hostname !== 'localhost')
          ? production.googleClientId
          : environment.googleClientId;
        const client = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: 'email profile',
          callback: async (response: any) => {
            try {
              const result = await this.apiService.loginWithGoogle(response.access_token).toPromise();
              if (result && result.success) {
                this.isAuthenticatedSubject.next(true);
                resolve({ success: true });
              } else if (result && result.error) {
                // Handle greenlist rejection or other errors
                resolve({
                  success: false,
                  error: result.error,
                  message: result.message
                });
              } else {
                resolve({ success: false, error: 'unknown_error', message: 'Login failed' });
              }
            } catch (error) {
              console.error('Login error:', error);
              resolve({ success: false, error: 'unknown_error', message: 'An unexpected error occurred' });
            }
          }
        });

        // Request access token
        client.requestAccessToken();
      });
    } catch (error) {
      console.error('Google login initialization error:', error);
      return { success: false, error: 'initialization_failed', message: 'Failed to initialize Google Sign-In' };
    }
  }

  private loadGoogleIdentityServices(): Promise<void> {
    return new Promise((resolve, reject) => {
      const w = window as any;
      if (typeof w.google !== 'undefined' && w.google.accounts) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => {
        if (typeof w.google !== 'undefined' && w.google.accounts) {
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
