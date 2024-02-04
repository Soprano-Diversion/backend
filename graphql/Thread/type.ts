// model Thread {
//   id            Int          @id @default(autoincrement())
//   name          String       @default("Untitled")
//   imageId       Int          @unique
//   image         Image        @relation(fields: [imageId], references: [id])
//   generationIds Int[]
//   generations   Generation[] @relation("generations")
//   createdAt     DateTime     @default(now())
//   updatedAt     DateTime     @updatedAt
//   deletedAt     DateTime?
// }

import { objectType } from "nexus";

export const Thread = objectType({
  name: 'Thread',
  description: 'Thread of generations based on the same image but same prompt',
  definition(t) {
    t.nonNull.int('id'),
    t.string('name'),
    t.nonNull.int('imageId'),
    t.field('image', {
      type: 'Image',
      resolve: async (parent, _, ctx) => {
        return ctx.prisma.image.findFirst({
          where: { id: parent.imageId },
        });
      },
    }),
    t.list.nonNull.int('generationIds'),
    t.list.nonNull.field('generations', {
      type: 'Generation',
      resolve: async (parent, _, ctx) => {
        if(!parent.generationIds) return [];

        return ctx.prisma.generation.findMany({
          where: { id: { in: parent.generationIds } },
        });
      },
    }),
    t.nonNull.date('createdAt')
    t.nonNull.date('updatedAt')
    t.nonNull.date('deletedAt')
  },
})