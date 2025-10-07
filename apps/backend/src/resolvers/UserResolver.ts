import 'reflect-metadata'
import { Resolver, Query, Field, ObjectType, Ctx, ID, Arg, Mutation } from 'type-graphql'
import type { Context } from '@/utils/graphql'
import { AuthPayload, SignUpInput } from './types/AuthTypes'
import { SignInInput } from './types/SignInTypes'

@ObjectType()
class User {
  @Field(() => ID)
  user_id!: string

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  email?: string
}

@Resolver()
export class UserResolver {
  @Query(() => [User])
  findManyUsers(@Ctx() { userService }: Context) {
    return userService.findMany()
  }

  @Mutation(() => AuthPayload)
  async signUp(
    @Arg('input', () => SignUpInput) input: SignUpInput,
    @Ctx() { userService }: Context,
  ): Promise<AuthPayload> {
    if (!input.email || !input.password) {
      throw new Error('email and password are required')
    }
    const { user, token } = await userService.createUser(input)
    return { user, token }
  }

  @Mutation(() => AuthPayload)
  async signIn(
    @Arg('input', () => SignInInput) input: SignInInput,
    @Ctx() { userService }: Context,
  ): Promise<AuthPayload> {
    if (!input.email || !input.password) {
      throw new Error('email and password are required')
    }
    const { user, token } = await userService.authenticateUser(input)
    return { user, token }
  }
}
