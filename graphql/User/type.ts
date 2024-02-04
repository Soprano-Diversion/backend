import { objectType } from 'nexus';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.string('name');
    t.nonNull.string('email');
    t.nonNull.string('username');
    t.nonNull.gender('gender');
    t.nonNull.role('role');
    t.string('profile');
    t.date('createdAt');
    t.date('updatedAt');
    t.date('deletedAt');
    
    // t.list.field('generation', {
    //   type: 'Generation',
    //   resolve: async (parent, _, ctx) => {
    //     const generations = await ctx.prisma.generation.findMany({
    //       where: { sharedWith: { some: { id: parent.id } } },
    //     });
    //   },
    // });
  },
});

export const AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.string('token');
    t.nonNull.field('user', { type: 'User' });
  },
});
