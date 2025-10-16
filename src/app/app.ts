import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LaurelinChatStartup } from './components/laurelin-chat-startup/laurelin-chat-startup';
import { CommonModule } from '@angular/common';
import { LaurelinChatEntry } from './components/laurelin-chat-entry/laurelin-chat-entry';

@Component({
  selector: 'app-root',
  imports: [LaurelinChatStartup, LaurelinChatEntry, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend-laurelin-chat');
}
