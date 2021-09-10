import { Test, TestingModule } from '@nestjs/testing';
import { MessageHistoryController } from './message-history.controller';

describe('MessageHistoryController', () => {
  let controller: MessageHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageHistoryController],
    }).compile();

    controller = module.get<MessageHistoryController>(MessageHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
