import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { EmailProvider } from './email.interface';

class MockProvider implements EmailProvider {
  sendEmail = jest.fn();
}

describe('EmailService', () => {
  let service: EmailService;
  let mockProvider: MockProvider;

  beforeEach(async () => {
    mockProvider = new MockProvider();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        { provide: 'EmailProvider', useValue: mockProvider },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
    (service as any).provider = mockProvider; // force provider
  });

  it('should send email using provider', async () => {
    await service.send('test@gmail.com', 'Hello', "test",true);

    expect(mockProvider.sendEmail).toHaveBeenCalledWith(
      'test@gmail.com',
      'Hello',
      true,
      undefined, // attachments
    );
  });
});
