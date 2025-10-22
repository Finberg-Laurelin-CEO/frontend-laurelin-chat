import { AfterViewInit, Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ChatSubmissionBox } from '../chat-submission-box/chat-submission-box';
import { LaurelinChatEntry } from '../laurelin-chat-entry/laurelin-chat-entry';
import { LaurelinChatPane } from '../laurelin-chat-pane/laurelin-chat-pane';
import { LaurelinChatStartup } from '../laurelin-chat-startup/laurelin-chat-startup';
import { AbTestingPanel } from '../ab-testing-panel/ab-testing-panel';
import { CommonModule } from '@angular/common';
import { ApiService, ChatSession, ChatMessage } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'laurelin-chat-component',
  templateUrl: './laurelin-chat-component.html',
  styleUrl: './laurelin-chat-component.css',
  imports: [ChatSubmissionBox, LaurelinChatPane, LaurelinChatStartup, AbTestingPanel, CommonModule]
})

export class LaurelinChatComponent implements AfterViewInit, OnInit, OnDestroy {

  renderStartupAnim: boolean = true;
  isAuthenticated: boolean = false;
  currentSession: ChatSession | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  private subscriptions: Subscription = new Subscription();

  @ViewChild('startupAnimation') startupAnim: LaurelinChatStartup = new LaurelinChatStartup();
  @ViewChild('chatPane') chatPane: LaurelinChatPane = new LaurelinChatPane();
  @ViewChild('submissionBox') submissionBox: ChatSubmissionBox = new ChatSubmissionBox();

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Subscribe to authentication status
    this.subscriptions.add(
      this.authService.isAuthenticated$.subscribe(isAuth => {
        this.isAuthenticated = isAuth;
        if (isAuth) {
          this.initializeChatSession();
        }
      })
    );

    // Subscribe to current session updates
    this.subscriptions.add(
      this.apiService.currentSession$.subscribe(session => {
        this.currentSession = session;
        if (session) {
          this.updateChatPane(session);
        }
      })
    );
  }

  ngAfterViewInit(): void {
    setTimeout( ()=> {this.startupAnim.triggerFadein();}, 50);
    setTimeout( ()=> {
      this.startupAnim.triggerFadeout();
      setTimeout( () => {this.renderStartupAnim=false;}, 1000);
    }, 3500);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private async initializeChatSession(): Promise<void> {
    try {
      this.isLoading = true;
      this.errorMessage = '';

      // Create a new chat session
      const response = await this.apiService.createChatSession().toPromise();
      if (response && response.success && response.data) {
        this.currentSession = response.data;
        this.apiService.sessionSubject.next(this.currentSession);
      } else {
        this.errorMessage = 'Failed to create chat session';
      }
    } catch (error) {
      console.error('Error initializing chat session:', error);
      this.errorMessage = 'Error initializing chat session';
    } finally {
      this.isLoading = false;
    }
  }

  private updateChatPane(session: ChatSession): void {
    // Clear existing entries
    this.chatPane.entries = [];
    
    // Add all messages from the session
    session.messages.forEach(message => {
      const isUser = message.role === 'user';
      this.chatPane.addChatEntry(
        new Date(message.timestamp).getTime(),
        isUser,
        message.content
      );
    });
  }

  async onChatSubmission(msg: string) {
    if (!this.currentSession || !msg.trim()) {
      return;
    }

    try {
      this.isLoading = true;
      this.errorMessage = '';

      // Add user message to chat pane immediately
      this.chatPane.addChatEntry(-1, true, msg);

      // Send message to backend
      const response = await this.apiService.sendMessage(this.currentSession.session_id, msg).toPromise();
      
      if (response && response.success) {
        // The session will be updated via the subscription
        console.log('Message sent successfully, model used:', response.model_used);
      } else {
        this.errorMessage = 'Failed to send message';
        // Remove the user message if sending failed
        this.chatPane.entries.pop();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      this.errorMessage = 'Error sending message';
      // Remove the user message if sending failed
      this.chatPane.entries.pop();
    } finally {
      this.isLoading = false;
    }
  }

  async loginWithGoogle(): Promise<void> {
    try {
      const success = await this.authService.loginWithGoogle();
      if (!success) {
        this.errorMessage = 'Login failed';
      }
    } catch (error) {
      console.error('Login error:', error);
      this.errorMessage = 'Login error';
    }
  }

  logout(): void {
    this.authService.logout();
    this.currentSession = null;
    this.chatPane.entries = [];
  }
}
