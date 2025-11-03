import { ObjectType, Field, ID } from 'type-graphql'

@ObjectType()
export class Permission {
  @Field(() => ID)
  permission_id!: string

  @Field(() => String)
  name!: string
}
