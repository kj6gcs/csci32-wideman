import { Field, ObjectType, InputType, ID } from 'type-graphql'

@InputType()
export class SignInInput {
  @Field(() => String)
  email!: string

  @Field(() => String)
  password!: string
}

@ObjectType()
export class UserDTO {
  @Field(() => ID)
  user_id!: string

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  email?: string
}

@ObjectType()
export class AuthPayload {
  @Field(() => String)
  token!: string

  @Field(() => UserDTO)
  user!: UserDTO
}
