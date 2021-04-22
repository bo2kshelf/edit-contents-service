import {Args, Mutation, Parent, ResolveField, Resolver} from '@nestjs/graphql';
import {BookEntity} from '../../books/entities/book.entity';
import {LabelEntity} from '../entities/label.entity';
import {LabelsService} from '../services/labels.service';
import {CreateLabelArgs} from './dto/create-label.dto';
import {LabeledBookArgs, LabeledBookReturnType} from './dto/labeled-book.dto';

@Resolver(() => LabelEntity)
export class LabelsResolver {
  constructor(private readonly labelsService: LabelsService) {}

  @Mutation(() => LabelEntity)
  async createLabel(
    @Args({type: () => CreateLabelArgs})
    args: CreateLabelArgs,
  ): Promise<LabelEntity> {
    const id = await this.labelsService.create(args);
    return {id};
  }

  @Mutation(() => LabeledBookReturnType)
  async labeledBook(
    @Args({type: () => LabeledBookArgs})
    args: LabeledBookArgs,
  ): Promise<LabeledBookReturnType> {
    return this.labelsService.labeledBook(args);
  }
}

@Resolver(() => LabeledBookReturnType)
export class LabeledBookReturnTypeResolver {
  @ResolveField(() => BookEntity)
  async book(@Parent() {bookId}: LabeledBookReturnType): Promise<BookEntity> {
    return {id: bookId};
  }

  @ResolveField(() => LabelEntity)
  async publisher(
    @Parent() {labelId}: LabeledBookReturnType,
  ): Promise<LabelEntity> {
    return {id: labelId};
  }
}
