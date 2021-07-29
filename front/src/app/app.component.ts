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
      console.log(`whoops, there's no socket connection .. :(, creating ...`);
      this.socketioService.setupSocketConnection();
      console.log(`wohoo, socket created successfully`);
    }
  }
}
