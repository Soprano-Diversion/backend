import { objectType } from "nexus";

export const Image = objectType({
  name: 'Image',
  description: 'Images used in generation of UI',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.string('name')
    t.nonNull.string('url')
    t.nonNull.date('createdAt')
    t.nonNull.date('updatedAt')
    t.nonNull.date('deletedAt')
  },
})