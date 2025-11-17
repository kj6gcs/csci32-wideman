import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import type { Context } from '@/utils/graphql'
import { CreatePostInput } from '@/resolvers/types/CreatePostInput'
import { getUserIdFromJwt } from '@/utils/authHelpers'
// import { Authorized } from 'type-graphql'
// import { PermissionName } from 'csci32-database'

@Resolver()
export class PostResolver {
  @Mutation(() => String)
  async createPost(
    @Ctx() ctx: Context,
    @Arg('input', () => CreatePostInput) input: CreatePostInput, // 👈 explicit type here
  ): Promise<string> {
    const authorUserId = getUserIdFromJwt(ctx)
    const post = await ctx.postService.createForAuthor(input, authorUserId)
    return post.id
  }
}
