import { inputObjectType, mutationField, nonNull } from "nexus";
import { generateCodeFromModel } from "../../helpers/model";

export const GenerationCreateInput = inputObjectType({
  name: 'GenerationCreateInput',
  description: 'Input for creating a generation',
  definition(t) {
    t.string('name')
    t.string('description')
    t.nonNull.string('prompt')
    t.int('userId')
    t.int('threadId')
    t.nonNull.boolean('isPublic')
    t.nonNull.int('imageId')
  }
})

export const GenerationUpdateInput = inputObjectType({
  name: 'GenerationUpdateInput',
  description: 'Input for updating a generation',
  definition(t) {
    t.string('name')
    t.string('description')
    t.string('prompt')
    t.int('threadId')
    t.boolean('isPublic')
  }
})

export const createGeneration = mutationField('createGeneration', {
  type: 'Generation',
  args: {
    input: nonNull('GenerationCreateInput')
  },
  resolve: async (_, { input }, ctx) => {
    if (!ctx?.auth?.id && !input?.userId) {
      throw new Error('Not authenticated')
    }

    let threadId = input?.threadId

    const image = await ctx.prisma.image.findUnique({
      where: {
        id: input?.imageId
      }
    })

    const { html, dsl, react } = await generateCodeFromModel({
      filename: image?.name || "Untitled Image",
      filepath: image?.url || "",
      prompt: input?.prompt || "",
    })

    if (!input?.threadId) {
      const thread = await ctx.prisma.thread.create({
        data: {
          name: input?.name || "Generation Thread",
          imageId: input?.imageId,
        }
      })

      threadId = thread.id
    }

    const [code, generation] = await ctx.prisma.$transaction([
      ctx.prisma.code.create({
        data: {
          html,
          dsl,
          react,
        }
      }),
      ctx.prisma.generation.create({
        data: {
          name: input?.name || "Untitled Generation",
          description: input?.description,
          prompt: input?.prompt,
          isPublic: input?.isPublic,
          userId: (input?.userId || ctx.auth?.id) as number,
          threadId,
        }
      })
    ])

    await ctx.prisma.generation.update({
      where: {
        id: generation.id
      },
      data: {
        codeId: code.id
      }
    })

    return ctx.prisma.generation.findFirst({
      where: {
        id: generation.id
      }
    })    
  }
})