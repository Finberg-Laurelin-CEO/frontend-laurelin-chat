import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ChatSubmissionBox } from '../chat-submission-box/chat-submission-box';
import { LaurelinChatEntry } from '../laurelin-chat-entry/laurelin-chat-entry';
import { LaurelinChatPane } from '../laurelin-chat-pane/laurelin-chat-pane';
import { LaurelinChatStartup } from '../laurelin-chat-startup/laurelin-chat-startup';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'laurelin-chat-component',
  templateUrl: './laurelin-chat-component.html',
  styleUrl: './laurelin-chat-component.css',
  imports: [ChatSubmissionBox, LaurelinChatPane, LaurelinChatStartup, CommonModule]
})

export class LaurelinChatComponent implements AfterViewInit{

  renderStartupAnim: boolean = true;

  @ViewChild('startupAnimation') startupAnim: LaurelinChatStartup = new LaurelinChatStartup();
  @ViewChild('chatPane') chatPane: LaurelinChatPane = new LaurelinChatPane();
  @ViewChild('submissionBox') submissionBox: ChatSubmissionBox = new ChatSubmissionBox();

  ngAfterViewInit(): void {
    setTimeout( ()=> {this.startupAnim.triggerFadein();}, 50);
    setTimeout( ()=> {
      this.startupAnim.triggerFadeout();
      setTimeout( () => {this.renderStartupAnim=false;}, 1000);
    }, 3500);
  }

  onChatSubmission(msg: string) {
    this.chatPane.addChatEntry(-1, true, msg);

    // Here's where we'd submit an api call.
  }

  
}
