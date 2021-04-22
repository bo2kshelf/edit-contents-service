import {ArgsType, Field, ID, ObjectType} from '@nestjs/graphql';

@ArgsType()
export class LabeledBookArgs {
  @Field(() => ID)
  bookId!: string;

  @Field(() => ID)
  labelId!: string;
}

@ObjectType('LabeledBookReturn')
export class LabeledBookReturnType {
  bookId!: string;
  labelId!: string;
}
