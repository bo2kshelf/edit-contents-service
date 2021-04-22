import {ArgsType, Field, ID, ObjectType} from '@nestjs/graphql';
import {AuthorRole} from '../../entities/roles.enitty';

@ArgsType()
export class WritedBookArgs {
  @Field(() => ID)
  bookId!: string;

  @Field(() => ID)
  authorId!: string;

  @Field(() => [AuthorRole], {nullable: true})
  roles?: AuthorRole[];
}

@ObjectType('WritedBookReturn')
export class WritedBookReturnType {
  bookId!: string;
  authorId!: string;

  @Field(() => [AuthorRole], {nullable: true})
  roles?: AuthorRole[];
}
