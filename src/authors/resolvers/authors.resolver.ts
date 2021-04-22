import {Args, Mutation, Parent, ResolveField, Resolver} from '@nestjs/graphql';
import {BookEntity} from '../../books/entities/book.entity';
import {AuthorEntity} from '../entities/author.entity';
import {WritingEntity} from '../entities/writing.entity';
import {AuthorsService} from '../services/authors.service';
import {CreateAuthorArgs} from './dto/create-author.dto';
import {WritedBookArgs, WritedBookReturnType} from './dto/writed-book.dto';

@Resolver(() => AuthorEntity)
export class AuthorsResolver {
  constructor(private readonly authorsService: AuthorsService) {}
  @Mutation(() => AuthorEntity)
  async createAuthor(
    @Args({type: () => CreateAuthorArgs})
    args: CreateAuthorArgs,
  ): Promise<AuthorEntity> {
    const id = await this.authorsService.create(args);
    return {id};
  }

  @Mutation(() => WritedBookReturnType)
  async writedBook(
    @Args({type: () => WritedBookArgs})
    {authorId, bookId, ...props}: WritedBookArgs,
  ) {
    return this.authorsService.writedBook({authorId, bookId}, props);
  }
}

@Resolver(() => WritedBookReturnType)
export class WritedBookReturnTypeResolver {
  constructor() {}

  @ResolveField(() => BookEntity)
  async book(@Parent() {bookId}: WritingEntity): Promise<BookEntity> {
    return {id: bookId};
  }

  @ResolveField(() => AuthorEntity)
  async author(@Parent() {authorId}: WritingEntity): Promise<AuthorEntity> {
    return {id: authorId};
  }
}
