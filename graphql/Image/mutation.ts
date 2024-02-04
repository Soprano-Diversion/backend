import { inputObjectType, mutationField } from "nexus";

export const ImageCreateInputType = inputObjectType({
  name: 'ImageCreateInputType',
  description: 'Input arguments for createImage event',
  definition(t) {
    t.field('file', { type: 'Upload' })
  },
})

export const uploadImage = mutationField('uploadImage', {
  type: 'Image',
  description: 'Upload an image',
  args: { 
    input: 'ImageCreateInputType'
  },
})