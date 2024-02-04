import { intArg, list, queryField, stringArg } from "nexus";

export const generation = queryField('generation', {
  type: list('Generation'),
  description: 'Get the generation by various means',
  args: {
    id: intArg(),
    userId: intArg(),
    name: stringArg(),
    threadId: intArg(),
  },
  resolve: async (_, args, ctx) => {
    if (args.id) {
      return ctx.prisma.generation.findMany({
        where: { id: args.id },
      });
    }

    if (args.userId || args.name || args.threadId) {
      return ctx.prisma.generation.findMany({
        where: {
          userId: args.userId || undefined,
          name: args.name || undefined,
          threadId: args.threadId || undefined,
        },
      });
    }

    return ctx.prisma.generation.findMany();
  },
})