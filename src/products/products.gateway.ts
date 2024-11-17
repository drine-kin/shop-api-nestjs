import {
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ProductsGateway {
  constructor(private readonly authService: AuthService) {}

  @WebSocketServer()
  private readonly server: Server;

  handleProductUpdated() {
    this.server.emit('productUpdated');
  }

  handleConnection(client: Socket) {
    const token = client.handshake.auth?.Authentication;

    if (token) {
      try {
        this.authService.verifyToken(token.value);
      } catch (error) {
        console.error('Token verification failed:', error.message);
        throw new WsException('Unauthorized: Invalid token');
      }
    }
  }
}
