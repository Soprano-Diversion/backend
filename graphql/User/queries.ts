import { intArg, objectType, queryField, stringArg } from "nexus";
import { AuthenticationError } from "../../helpers";
import { checkPermissions } from "../../helpers/auth/checkPermissions";

const PaginatedUserType = objectType({
  name: 'PaginatedUserType',
  description: 'Paginated response for user query',
  definition(t) {
    t.list.field('data', {
      type: 'User',
    });
    t.int('count');
  },
});

export const me = queryField('me', {
  type: 'User',
  description: 'Get the current logged in user',
  resolve: async (_, __, ctx) => {
    if (!ctx.auth?.id) {
      throw AuthenticationError;
    }

    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.auth.id },
    });

    return user;
  },
});

export const user = queryField('user', {
  type: PaginatedUserType,
  description: 'Retrieves a list of users depending on the query arguments',
  args: {
    id: intArg(),
    username: stringArg(),
    pagination: "paginationInputType",
  },
  authorize: (_parent, _args, ctx) => {
    if (!_args.id && !_args.username) {
      return checkPermissions(ctx, ['ADMIN']);
    }
    return true;
  },
  resolve: async (_, { id, username, pagination }, { prisma }) => {
    const prismaQuery = {
      id: id || undefined,
      username: username || undefined,
    };
    
    const [users, count] = await prisma.$transaction([
      prisma.user.findMany({
        skip: pagination?.skip,
        take: pagination?.take,
        where: prismaQuery,
      }),
      prisma.user.count({
        where: prismaQuery,
      }),
    ]);

    return {
      data: users,
      count,
    };
  }
});