import { Test, TestingModule } from '@nestjs/testing';
import { HistoryDbService } from './history-db.service';

describe('HistoryDbService', () => {
  let service: HistoryDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoryDbService],
    }).compile();

    service = module.get<HistoryDbService>(HistoryDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
