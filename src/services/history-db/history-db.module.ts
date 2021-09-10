import { Global, Module } from '@nestjs/common';
import { HistoryDbService } from './history-db.service';

@Global()
@Module({
    providers: [ HistoryDbService ],
    exports: [HistoryDbService]
})
export class HistoryDbModule { }