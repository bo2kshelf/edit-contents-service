import {Args, Mutation, Parent, ResolveField, Resolver} from '@nestjs/graphql';
import {BookEntity} from '../../books/entities/book.entity';
import {PublisherEntity} from '../entities/publisher.entity';
import {PublishersService} from '../services/publishers.service';
import {CreatePublisherArgs} from './dto/create-publisher.dto';
import {
  PublishedBookArgsType,
  PublishedBookReturnType,
} from './dto/published-book.dto';

@Resolver(() => PublisherEntity)
export class PublishersResolver {
  constructor(private readonly publishersService: PublishersService) {}

  @Mutation(() => PublisherEntity)
  async createPublisher(
    @Args({type: () => CreatePublisherArgs})
    args: CreatePublisherArgs,
  ): Promise<PublisherEntity> {
    const id = await this.publishersService.create(args);
    return {id};
  }

  @Mutation(() => PublishedBookReturnType)
  async publishedBook(
    @Args({type: () => PublishedBookArgsType})
    args: PublishedBookArgsType,
  ): Promise<PublishedBookReturnType> {
    return this.publishersService.publishedBook(args);
  }
}

@Resolver(() => PublishedBookReturnType)
export class PublishedBookReturnTypeResolver {
  @ResolveField(() => BookEntity)
  async book(@Parent() {bookId}: PublishedBookReturnType): Promise<BookEntity> {
    return {id: bookId};
  }

  @ResolveField(() => PublisherEntity)
  async publisher(
    @Parent() {publisherId}: PublishedBookReturnType,
  ): Promise<PublisherEntity> {
    return {id: publisherId};
  }
}
