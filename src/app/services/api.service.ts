import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment, production } from '../config/environment';

export interface User {
  user_id: string;
  email: string;
  name?: string;
  created_at: string;
  last_login?: string;
  preferences: any;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  model_used?: string;
  metadata?: any;
}

export interface ChatSession {
  session_id: string;
  user_id: string;
  title?: string;
  created_at: string;
  updated_at: string;
  messages: ChatMessage[];
  metadata: any;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
  message?: string;
}

export interface ChatResponse {
  success: boolean;
  response: string;
  model_used: string;
  session: ChatSession;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = (typeof window !== 'undefined' && window.location.hostname !== 'localhost')
    ? production.apiUrl
    : environment.apiUrl;
  private authToken: string | null = null;
  private currentUser: User | null = null;
  
  // BehaviorSubjects for reactive state management
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  public sessionSubject = new BehaviorSubject<ChatSession | null>(null);
  public currentSession$ = this.sessionSubject.asObservable();

  constructor(private http: HttpClient) {
    // Load token from localStorage on service initialization
    this.loadStoredAuth();
  }

  private loadStoredAuth(): void {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('current_user');
    
    if (token && user) {
      this.authToken = token;
      this.currentUser = JSON.parse(user);
      this.userSubject.next(this.currentUser);
    }
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    if (this.authToken) {
      headers = headers.set('Authorization', `Bearer ${this.authToken}`);
    }
    
    return headers;
  }

  // Authentication Methods
  loginWithGoogle(googleToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, {
      token: googleToken
    }).pipe(
      tap(response => {
        if (response.success && response.token && response.user) {
          this.authToken = response.token;
          this.currentUser = response.user;
          this.userSubject.next(this.currentUser);

          // Store in localStorage
          localStorage.setItem('auth_token', this.authToken);
          localStorage.setItem('current_user', JSON.stringify(this.currentUser));
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        // Handle greenlist rejection (403 error)
        if (error.status === 403 && error.error) {
          return of({
            success: false,
            error: error.error.error || 'not_authorized',
            message: error.error.message || 'You are not authorized to access this application.'
          });
        }
        return of({
          success: false,
          error: 'authentication_failed',
          message: 'Authentication failed. Please try again.'
        });
      })
    );
  }

  verifyToken(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}/auth/verify`, {
      headers: this.getHeaders()
    }).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.currentUser = response.data;
          this.userSubject.next(this.currentUser);
        }
      }),
      catchError(error => {
        console.error('Token verification error:', error);
        this.logout();
        return of({ success: false, error: 'Token verification failed' });
      })
    );
  }

  logout(): void {
    this.authToken = null;
    this.currentUser = null;
    this.userSubject.next(null);
    this.sessionSubject.next(null);
    
    // Clear localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
  }

  isAuthenticated(): boolean {
    return !!this.authToken && !!this.currentUser;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Chat Session Methods
  getChatSessions(): Observable<ApiResponse<ChatSession[]>> {
    return this.http.get<ApiResponse<ChatSession[]>>(`${this.baseUrl}/chat/sessions`, {
      headers: this.getHeaders()
    });
  }

  createChatSession(title?: string): Observable<ApiResponse<ChatSession>> {
    return this.http.post<ApiResponse<ChatSession>>(`${this.baseUrl}/chat/sessions`, {
      title: title || `Chat ${new Date().toLocaleString()}`
    }, {
      headers: this.getHeaders()
    });
  }

  getChatSession(sessionId: string): Observable<ApiResponse<ChatSession>> {
    return this.http.get<ApiResponse<ChatSession>>(`${this.baseUrl}/chat/sessions/${sessionId}`, {
      headers: this.getHeaders()
    });
  }

  sendMessage(sessionId: string, message: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.baseUrl}/chat/sessions/${sessionId}/messages`, {
      message: message
    }, {
      headers: this.getHeaders()
    }).pipe(
      tap(response => {
        if (response.success) {
          this.sessionSubject.next(response.session);
        }
      }),
      catchError(error => {
        console.error('Send message error:', error);
        return of({ success: false, response: 'Error sending message', model_used: '', session: null as any });
      })
    );
  }

  deleteChatSession(sessionId: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/chat/sessions/${sessionId}`, {
      headers: this.getHeaders()
    });
  }

  // Model Testing Methods
  testModel(message: string, modelProvider: string = 'openai'): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/models/test`, {
      message: message,
      model_provider: modelProvider
    }, {
      headers: this.getHeaders()
    });
  }

  getAvailableModels(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/models/available`, {
      headers: this.getHeaders()
    });
  }

  checkModelHealth(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/models/health`, {
      headers: this.getHeaders()
    });
  }

  // A/B Testing Methods
  getExperiments(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/ab-testing/experiments`, {
      headers: this.getHeaders()
    });
  }

  assignToExperiment(experimentName: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/ab-testing/experiments/${experimentName}/assign`, {}, {
      headers: this.getHeaders()
    });
  }

  trackEvent(experimentName: string, eventType: string, eventData?: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/ab-testing/experiments/${experimentName}/track`, {
      event_type: eventType,
      event_data: eventData || {}
    }, {
      headers: this.getHeaders()
    });
  }

  getExperimentResults(experimentName: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/ab-testing/experiments/${experimentName}/results`, {
      headers: this.getHeaders()
    });
  }
}
