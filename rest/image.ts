import { Request, Response } from "express";
import imageKit from "imagekit";
import { prisma } from "../config";
import multiparty from "multiparty";
import { ReadStream, readFileSync } from "fs";

const imagekit = new imageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export const createImage = async (req: Request, res: Response) => {
  const form = new multiparty.Form();

  try {
    const { files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, _, files) => {
        if (err) {
          reject(err);
        } else {
          resolve({ files });
        }
      });
    }) as { files: { file: ReadStream[]} };

    if (!files.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const uploadPromises = files.file.map(async (file) => {
      const result = await imagekit.upload({
        file: readFileSync(file.path),
        fileName: (file as unknown as { originalFilename: string})?.originalFilename || "image",
        folder: "/soprano",
        useUniqueFileName: true,
      });

      const image = await prisma.image.create({
        data: {
          url: result.url,
          name: result.name,
        },
      });

      return image;
    });

    const uploadedImages = await Promise.all(uploadPromises);

    return res
      .status(201)
      .json({ message: "Images uploaded successfully", data: uploadedImages });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Error uploading images", error });
  }
};
