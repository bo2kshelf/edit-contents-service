import {Directive, Field, ID, ObjectType} from '@nestjs/graphql';

@ObjectType('Publisher')
@Directive('@extends')
@Directive('@key(fields: "id")')
export class PublisherEntity {
  @Field(() => ID)
  @Directive('@external')
  id!: string;
}
