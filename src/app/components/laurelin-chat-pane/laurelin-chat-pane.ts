import { Component, OnInit } from '@angular/core';
import { LaurelinChatEntry } from '../laurelin-chat-entry/laurelin-chat-entry';
import { CommonModule } from '@angular/common';

class ChatEntry {
  ts: number = -1;
  sent: boolean = true;
  msg: string = 'Default text.';

  constructor(ts: number=-1, sent: boolean=true, msg: string='Default text.') {
    this.ts = ts;
    this.sent = sent;
    this.msg = msg;
  }
}

@Component({
  selector: 'laurelin-chat-pane',
  imports: [CommonModule, LaurelinChatEntry],
  templateUrl: './laurelin-chat-pane.html',
  styleUrl: './laurelin-chat-pane.css'
})
export class LaurelinChatPane implements OnInit{
  
  entries: ChatEntry[] = [];

  constructor() {
    for ( let i = 0; i < 30; ++i ) {
      if ( i % 2 == 0 ) {
        this.entries.push(new ChatEntry())
      }
      else {
        this.entries.push(new ChatEntry(-1, false, 'default text'));
      }
    }
  }
  ngOnInit(): void {}

  
}
