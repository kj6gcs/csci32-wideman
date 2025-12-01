import { Arg, Ctx, Query, Resolver } from 'type-graphql'
import type { Context } from '@/utils/graphql'

import { Character } from '@/resolvers/types/Character'
import { ListCharactersInput, CharacterSortField, SortDirection } from '@/resolvers/types/ListCharactersInput'
import type { ListCharactersOptions } from '@/services/CharacterService'

@Resolver(() => Character)
export class CharacterResolver {
  // Find ONE character by ID
  @Query(() => Character, { nullable: true })
  async findCharacterById(@Ctx() ctx: Context, @Arg('id', () => String) id: string) {
    return ctx.characterService.findOneById(id)
  }

  // Find MANY characters with search + pagination + sorting
  @Query(() => [Character])
  async findManyCharacters(
    @Ctx() ctx: Context,
    @Arg('input', () => ListCharactersInput, { nullable: true }) input?: ListCharactersInput,
  ) {
    const options: ListCharactersOptions = {
      skip: input?.skip ?? 0,
      take: input?.take ?? 10,
      sortField: input?.sortField ?? CharacterSortField.CreatedAt,
      sortDirection: input?.sortDirection ?? SortDirection.Desc,
    }

    if (input?.search != null) {
      options.search = input.search
    }

    return ctx.characterService.findMany(options)
  }
}
