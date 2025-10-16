import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'laurelin-chat-entry',
  imports: [CommonModule],
  templateUrl: './laurelin-chat-entry.html',
  styleUrl: './laurelin-chat-entry.css'
})
export class LaurelinChatEntry implements OnInit{

  @Input('ts') ts: number = -1;
  @Input('sent') sent: boolean = true;
  @Input('msg') msg: string = 'Default text';

  constructor() {
  }
  ngOnInit(): void {
    return
  }
}
