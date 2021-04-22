import {Args, Mutation, Parent, ResolveField, Resolver} from '@nestjs/graphql';
import {BookEntity} from '../../books/entities/book.entity';
import {SeriesService} from '../services/series.service';
import {
  ConnectNextBookArgs,
  ConnectNextBookReturnType,
} from './dto/connect-next-book.dto';

@Resolver(() => BookEntity)
export class BooksResolver {
  constructor(private readonly seriesService: SeriesService) {}

  @Mutation(() => ConnectNextBookReturnType)
  async connectNextBook(
    @Args({type: () => ConnectNextBookArgs})
    {previousId, nextId}: ConnectNextBookArgs,
  ): Promise<ConnectNextBookReturnType> {
    return this.seriesService.connectBooksAsNextBook({previousId, nextId});
  }
}

@Resolver(() => ConnectNextBookReturnType)
export class ConnectNextBookReturnTypeResolver {
  @ResolveField(() => BookEntity)
  async previous(
    @Parent() {previousId}: ConnectNextBookReturnType,
  ): Promise<BookEntity> {
    return {id: previousId};
  }

  @ResolveField(() => BookEntity)
  async next(
    @Parent() {nextId}: ConnectNextBookReturnType,
  ): Promise<BookEntity> {
    return {id: nextId};
  }
}
