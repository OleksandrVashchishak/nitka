import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      service: 'wedding-api',
      revision: '95e5882-render-start',
      features: {
        content: true,
        guests: true,
        budget: true,
      },
      timestamp: new Date().toISOString(),
    };
  }
}
