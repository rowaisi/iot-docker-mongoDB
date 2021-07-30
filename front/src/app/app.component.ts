import { Component } from '@angular/core';
import { SocketioService } from './services/socketio.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'argon-dashboard-angular';

  constructor(
    private socketioService: SocketioService
  ) {}

  ngOnInit() {
    if (this.socketioService.getSocketInstance() == null){
      this.socketioService.setupSocketConnection();
    }
  }
}
