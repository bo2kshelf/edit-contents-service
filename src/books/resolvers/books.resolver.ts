import {Args, Mutation, Resolver} from '@nestjs/graphql';
import {BookEntity} from '../entities/book.entity';
import {BooksService} from '../services/books.service';
import {CreateBookArgs} from './dto/create-books.dto';

@Resolver(() => BookEntity)
export class BooksResolver {
  constructor(private readonly booksService: BooksService) {}
  @Mutation(() => BookEntity)
  async createBook(
    @Args({type: () => CreateBookArgs})
    args: CreateBookArgs,
  ): Promise<BookEntity> {
    return this.booksService.create(args);
  }
}
