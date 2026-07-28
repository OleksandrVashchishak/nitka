import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      service: 'wedding-api',
      revision: 'planning-first-2026-07-28',
      features: {
        content: true,
        guests: true,
        budget: true,
        vendorsHidden: true,
      },
      timestamp: new Date().toISOString(),
    };
  }
}
