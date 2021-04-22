import {Directive, Field, ID, ObjectType} from '@nestjs/graphql';

@ObjectType('Author')
@Directive('@extends')
@Directive('@key(fields: "id")')
export class AuthorEntity {
  @Field(() => ID)
  @Directive('@external')
  id!: string;
}
