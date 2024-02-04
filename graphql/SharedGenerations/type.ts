import { objectType } from "nexus";

export const SharedGeneration = objectType({
  name: 'SharedGeneration',
  description: 'Generations shared between users',
  definition(t) {
    t.nonNull.int('id')
    t.int('generationId')
    t.int('userId')
    t.nonNull.date('createdAt')
    t.nonNull.date('updatedAt')
    t.nonNull.date('deletedAt')

    t.field('generation', {
      type: 'Generation',
      description: 'Generation shared with the user',
      resolve: async (parent, _, ctx) => {
        if (!parent.generationId) {
          return null;
        }

        return ctx.prisma.generation.findFirst({
          where: { id: parent.generationId },
        });
      },
    })

    t.field('user', {
      type: 'User',
      description: 'User with whom the generation is shared',
      resolve: async (parent, _, ctx) => {
        if (!parent.userId) {
          return null;
        }

        return ctx.prisma.user.findFirst({
          where: { id: parent.userId },
        });
      },
    })
  },
})