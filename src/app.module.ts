import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HistoryDbModule } from './services/history-db/history-db.module';
import { MessageHistoryController } from './controllers/message-history/message-history.controller';

@Module({
  imports: [ HistoryDbModule ],
  controllers: [AppController, MessageHistoryController],
  providers: [AppService]
})
export class AppModule {}
