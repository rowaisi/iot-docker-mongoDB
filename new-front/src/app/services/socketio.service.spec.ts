import { TestBed } from '@angular/core/testing';

import { SocketioServiceService } from './socketio.service';

describe('SocketioServiceService', () => {
  let service: SocketioServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocketioServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
