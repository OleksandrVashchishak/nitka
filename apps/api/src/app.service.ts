import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      service: 'wedding-api',
      revision: 'start-resilient',
      features: {
        content: true,
        guests: true,
        budget: true,
      },
      timestamp: new Date().toISOString(),
    };
  }
}
