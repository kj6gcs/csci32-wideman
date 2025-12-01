import { Field, InputType, Int, registerEnumType } from 'type-graphql'

export enum PostSortField {
  CreatedAt = 'createdAt',
  Title = 'title',
}

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

registerEnumType(PostSortField, {
  name: 'PostSortField',
})

registerEnumType(SortDirection, {
  name: 'SortDirection',
})

@InputType()
export class ListPostsInput {
  @Field({ nullable: true })
  search?: string

  @Field(() => Int, { nullable: true, description: 'Number of records to skip' })
  skip?: number

  @Field(() => Int, { nullable: true, description: 'Number of records to take' })
  take?: number

  @Field(() => PostSortField, {
    nullable: true,
    description: 'Field to sort by (defaults to createdAt)',
  })
  sortField?: PostSortField

  @Field(() => SortDirection, {
    nullable: true,
    description: 'Sort direction (defaults to Desc)',
  })
  sortDirection?: SortDirection
}
