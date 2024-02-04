import { intArg, list, queryField } from "nexus";
import { checkPermissions } from "../../helpers/auth/checkPermissions";

export const image = queryField('image', {
  type: list('Image'),
  description: 'Retrieves an image by its ID',
  args: {
    id: intArg(),
  },
  resolve: async (_, { id }, ctx) => {
    if (!id && await checkPermissions(ctx, ['ADMIN'])) {
      return ctx.prisma.image.findMany();
    } else if (!id) {
      throw new Error('You must be an admin to retrieve all images');
    } 

    return ctx.prisma.image.findMany({
      where: { id },
    });
  },
});