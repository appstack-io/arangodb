import { Global, Module } from '@nestjs/common';
import { ArangodbService } from './arangodb.service';
import { ArangodbUtils } from './arangodbUtils';

@Global()
@Module({
  providers: [ArangodbService, ArangodbUtils],
  exports: [ArangodbService, ArangodbUtils],
})
export class ArangodbModule {}
