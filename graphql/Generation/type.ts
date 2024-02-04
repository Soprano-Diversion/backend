import { objectType } from "nexus";

export const code = objectType({
  name: 'Code',
  description: 'Generated code from sketches',
  definition(t) {
    t.nonNull.int('id')
    t.string('html')
    t.string('dsl')
    t.string('react')
    t.nonNull.date('createdAt')
    t.nonNull.date('updatedAt')
    t.nonNull.date('deletedAt')
  },
})

export const Generation = objectType({
  name: 'Generation',
  description: 'Generateed UIs from sketches through users',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.string('name')
    t.string('description')
    t.nonNull.string('prompt')
    t.nonNull.int('userId')
    t.int('threadId')
    t.int('codeId')
    t.nonNull.boolean('isPublic')
    t.nonNull.date('createdAt')
    t.nonNull.date('updatedAt')
    t.nonNull.date('deletedAt')

    t.nonNull.field('user', {
      type: 'User',
      description: 'User who generated the UI',
      resolve: async (parent, _, ctx) => {
        const user = await ctx.prisma.user.findUnique({
          where: { id: parent.userId },
        });

        if (!user) {
          throw new Error('User not found');
        }

        return user;
      },
    })

    t.list.field('sharedWith', {
      type: 'SharedGeneration',
      description: 'Users with whom the UI is shared',
      resolve: async (parent, _, ctx) => {
        return ctx.prisma.sharedGenerations.findMany({
          where: { generationId: parent.id },
        });
      },
    })

    t.field('thread', {
      type: 'Thread',
      description: 'Thread of generations',
      resolve: async (parent, _, ctx) => {
        if (!parent.threadId) {
          return null;
        }

        return ctx.prisma.thread.findFirst({
          where: { id: parent.threadId },
        });
      },
    })

    t.field('code', {
      type: 'Code',
      description: 'Code of the generation',
      resolve: async (parent, _, ctx) => {
        if (!parent.codeId) {
          return null;
        }

        return ctx.prisma.code.findFirst({
          where: { id: parent.codeId },
        });
      },
    })
  },
})