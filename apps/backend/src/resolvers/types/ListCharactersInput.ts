import { Field, InputType, Int, registerEnumType } from 'type-graphql'

export enum CharacterSortField {
  CreatedAt = 'createdAt',
  Name = 'name',
}

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

registerEnumType(CharacterSortField, {
  name: 'CharacterSortField',
  description: 'Fields available for sorting Starwoven Datacore character records',
})

registerEnumType(SortDirection, {
  name: 'SortDirection',
  description: 'Sort direction for Datacore queries',
})

@InputType({ description: 'Options for querying the Starwoven Datacore character index' })
export class ListCharactersInput {
  @Field(() => String, {
    nullable: true,
    description: 'Free-text search across name, callsign, role, etc.',
  })
  search?: string | null

  @Field(() => Int, {
    nullable: true,
    description: 'Number of records to skip (for pagination / datacore offset)',
  })
  skip?: number | null

  @Field(() => Int, {
    nullable: true,
    description: 'Number of records to take (page size)',
  })
  take?: number | null

  @Field(() => CharacterSortField, {
    nullable: true,
    description: 'Field to sort by (defaults to createdAt if available, otherwise name)',
  })
  sortField?: CharacterSortField | null

  @Field(() => SortDirection, {
    nullable: true,
    description: 'Sort direction (defaults to Desc for newest-first)',
  })
  sortDirection?: SortDirection | null
}
