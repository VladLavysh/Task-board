import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SERVICES } from '@app/shared';

@Injectable()
export class AuthService {
  constructor(@Inject(SERVICES.AUTH_SERVICE) private authClient: ClientProxy) {}

  getHello() {
    return this.authClient.send({ cmd: 'getHello' }, {});
  }
}
