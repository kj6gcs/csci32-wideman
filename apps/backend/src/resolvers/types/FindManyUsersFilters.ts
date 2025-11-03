import { InputType, Field } from 'type-graphql'

@InputType()
export class FindManyUsersFilters {
  @Field(() => String, { nullable: true })
  query?: string
}
