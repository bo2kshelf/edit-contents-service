import {Directive, Field, ID, ObjectType} from '@nestjs/graphql';

@ObjectType('Label')
@Directive('@extends')
@Directive('@key(fields: "id")')
export class LabelEntity {
  @Field(() => ID)
  @Directive('@external')
  id!: string;
}
