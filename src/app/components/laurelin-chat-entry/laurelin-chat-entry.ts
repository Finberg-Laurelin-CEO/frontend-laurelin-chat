import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-laurelin-chat-entry',
  imports: [],
  templateUrl: './laurelin-chat-entry.html',
  styleUrl: './laurelin-chat-entry.css'
})
export class LaurelinChatEntry implements OnInit{

  @Input('ts') ts: number = -1;
  @Input('isResp') isResp: boolean = false;

  constructor() {
  }
  ngOnInit(): void {
    return
  }
}
