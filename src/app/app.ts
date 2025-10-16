import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LaurelinChatStartup } from './components/laurelin-chat-startup/laurelin-chat-startup';
import { CommonModule } from '@angular/common';
import { LaurelinChatEntry } from './components/laurelin-chat-entry/laurelin-chat-entry';
import { LaurelinChatPane } from './components/laurelin-chat-pane/laurelin-chat-pane';

@Component({
  selector: 'app-root',
  imports: [LaurelinChatStartup, LaurelinChatEntry, LaurelinChatPane, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend-laurelin-chat');
}
