import { GraphQLError } from "graphql";
import * as FileType from "file-type";
import { objectType, scalarType } from "nexus";

interface File {
  createReadStream: () => NodeJS.ReadStream;
  mimetype: string;
  encoding: string;
  filename: string;
}

export const Upload = scalarType({
  name: "Upload",
  asNexusMethod: "upload", // We set this to be used as a method later as `t.upload()` if needed
  description: "desc",
  serialize: () => {
    throw new GraphQLError("Upload serialization unsupported.");
  },
  parseValue: async (value) => {
    const upload = await value as File;
    console.log(upload);
    const stream = upload.createReadStream();
    const fileType = await FileType.fromStream(stream);
    if (fileType?.mime !== upload.mimetype)
      throw new GraphQLError("Mime type does not match file content.");
    return upload;
  },
  parseLiteral: (ast) => {
    throw new GraphQLError("Upload literal unsupported.", ast)
  },
});

export const File = objectType({
  name: "File",
  definition(t) {
    t.id("id");
    t.string("path");
    t.string("filename");
    t.string("mimetype");
    t.string("encoding");
  },
});