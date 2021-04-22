import {Module} from '@nestjs/common';
import {IDModule} from '../common/id/id.module';
import {
  AuthorsResolver,
  WritedBookReturnTypeResolver,
} from './resolvers/authors.resolver';
import {AuthorsService} from './services/authors.service';

@Module({
  imports: [IDModule],
  providers: [AuthorsService, AuthorsResolver, WritedBookReturnTypeResolver],
  exports: [AuthorsService],
})
export class AuthorsModule {}
