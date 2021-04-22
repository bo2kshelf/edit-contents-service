import {Module} from '@nestjs/common';
import {IDModule} from '../common/id/id.module';
import {
  PublishedBookReturnTypeResolver,
  PublishersResolver,
} from './resolvers/publishers.resolver';
import {PublishersService} from './services/publishers.service';

@Module({
  imports: [IDModule],
  providers: [
    PublishersService,
    PublishersResolver,
    PublishedBookReturnTypeResolver,
  ],
  exports: [PublishersService],
})
export class PublishersModule {}
