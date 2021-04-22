import {Directive, Field, ID, ObjectType} from '@nestjs/graphql';

@ObjectType('Series')
@Directive('@extends')
@Directive('@key(fields: "id")')
export class SeriesEntity {
  @Field(() => ID)
  @Directive('@external')
  id!: string;
}
