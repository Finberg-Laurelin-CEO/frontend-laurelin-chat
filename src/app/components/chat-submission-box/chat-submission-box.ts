import { Component, EventEmitter, Output, Input } from '@angular/core';
import { ChatSubmitButton } from '../chat-submit-button/chat-submit-button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'chat-submission-box',
  imports: [ChatSubmitButton, FormsModule],
  templateUrl: './chat-submission-box.html',
  styleUrl: './chat-submission-box.css'
})
export class ChatSubmissionBox {

  textareaContent: string = '';

  @Input() disabled: boolean = false;
  @Output("onSubmit") onSubmit: EventEmitter<string> = new EventEmitter();

  onSubmitClick(evt: boolean): void {
    if (!this.disabled && this.textareaContent.trim()) {
      this.onSubmit.emit(this.textareaContent);
      this.textareaContent = ''; // Clear the textarea after submission
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      this.onSubmitClick(true);
    }
  }
  
}
