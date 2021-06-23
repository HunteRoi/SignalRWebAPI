import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HubConnectionBuilder, HubConnection, LogLevel } from '@microsoft/signalr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'app';
  connection: HubConnection;
  messages: string[];
  connected: boolean;
  newMessage: string;
  @ViewChild('messageInput', { static: false }) messageInputElement;
  @ViewChild('userInput', { static: false }) userInputElement;

  constructor() {
    this.messages = [];
    this.connected = false;
    this.connection = new HubConnectionBuilder()
      .withUrl('/chat')
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Debug)
      .build();

    this.connection.on('messageReceived', (user: string, message: string) => {
      const newMessage = `${user}> ${message}`;
      this.messages.push(newMessage);
    });
  }

  ngOnInit() {
    this.connection.start()
      .then(() => {
        console.log('started!');
        this.connected = true;
      })
      .catch(err => console.error('error', err));
  }

  ngOnDestroy() {
    this.connection.stop()
      .then(() => {
        console.log('stopped!');
        this.connected = false;
      })
      .catch(err => console.error('error', err));
  }

  onEnter(event: KeyboardEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (event.key !== 'Enter') return;
    this.sendMessage();
  }

  sendMessage() {
    const newMessage = this.messageInputElement.nativeElement.value;
    const user = this.userInputElement.nativeElement.value || `Guest#${this.connection.connectionId}`;
    if (!newMessage || !newMessage.trim()) return;

    const prefix = `${new Date().toTimeString().split(' ')[0]} - ${user}`;
    this.connection.invoke('sendMessage', prefix, newMessage)
      .then(() => {
        console.log('sent!', prefix, newMessage);
        this.messageInputElement.nativeElement.value = '';
      })
      .catch(err => console.error('error', err));
  }
}
