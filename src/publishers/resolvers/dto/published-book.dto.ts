import {ArgsType, Field, ID, ObjectType} from '@nestjs/graphql';

@ArgsType()
export class PublishedBookArgsType {
  @Field(() => ID)
  bookId!: string;

  @Field(() => ID)
  publisherId!: string;
}

@ObjectType('PublishedBookReturn')
export class PublishedBookReturnType {
  bookId!: string;
  publisherId!: string;
}
