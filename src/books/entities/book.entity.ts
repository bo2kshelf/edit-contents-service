import {Directive, Field, ID, ObjectType} from '@nestjs/graphql';

@ObjectType('Book')
@Directive('@extends')
@Directive('@key(fields: "id")')
export class BookEntity {
  @Field(() => ID)
  @Directive('@external')
  id!: string;
}
