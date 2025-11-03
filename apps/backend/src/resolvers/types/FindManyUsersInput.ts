import { InputType, Field, Int } from 'type-graphql'
import { SortOrder } from './SortOrder'
import { FindManyUsersFilters } from './FindManyUsersFilters'

@InputType()
export class FindManyUsersInput {
  @Field(() => Int, { nullable: true })
  skip?: number

  @Field(() => Int, { nullable: true })
  take?: number

  @Field(() => SortOrder, { nullable: true })
  sortDirection?: SortOrder

  @Field(() => String, { nullable: true })
  sortColumn?: 'name' | 'email'

  @Field(() => FindManyUsersFilters, { nullable: true })
  filters?: FindManyUsersFilters
}
