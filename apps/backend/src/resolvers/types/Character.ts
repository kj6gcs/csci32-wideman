import { Field, ID, ObjectType } from 'type-graphql'

@ObjectType()
export class Character {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  name!: string

  @Field(() => String, { nullable: true })
  callsign?: string | null

  @Field(() => String, { nullable: true })
  role?: string | null

  @Field(() => String, { nullable: true })
  species?: string | null

  @Field(() => String, { nullable: true })
  homeworld?: string | null

  @Field(() => String, { nullable: true })
  bio?: string | null

  @Field(() => String, { nullable: true })
  shipId?: string | null

  @Field(() => String, { nullable: true })
  factionId?: string | null

  @Field(() => Date)
  createdAt!: Date

  @Field(() => Date)
  updatedAt!: Date
}
