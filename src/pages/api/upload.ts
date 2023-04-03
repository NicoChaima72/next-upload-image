import formidable, { File } from "formidable";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import * as Upload from "upload-js-full";
import fetch from "node-fetch";

const form = formidable({ multiples: true });

const isFile = (file: File | File[]): file is File =>
  !Array.isArray(file) && file.filepath !== undefined;

type Data = { message?: string } | any[];

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const fileContent: Buffer = await new Promise((resolve, reject) => {
    form.parse(req, (err, _fields, files) => {
      if (isFile(files.file)) {
        const fileContentBuffer = fs.readFileSync(files.file.filepath);
        // const fileContentBuffer = fs.createReadStream(files.file.filepath);
        resolve(fileContentBuffer);
      }
      reject(err);
    });
  });

  // 12a1y5h

  const uploadManager = new Upload.UploadManager(
    new Upload.Configuration({
      fetchApi: fetch as Upload.FetchAPI,
      apiKey: "", // e.g. "secret_xxxxx"
    })
  );

  uploadManager
    .upload({
      // ---------
      // Required:
      // ---------

      accountId: "", // This is your account ID.

      // Supported types for 'data' field:
      // - String
      // - Blob
      // - Buffer
      // - ReadableStream (Node.js), e.g. fs.createReadStream("file.txt")
      data: fileContent,

      // Required when: 'data' is a stream.
      // size: 5098,

      // ---------
      // Optional:
      // ---------

      // Required when: 'data' is a stream, buffer, or string.
      mime: "image/png",

      // Required when: 'data' is a stream, buffer, or string.
      originalFileName: "file.png",

      // Supported when: 'data' is not a stream.
      maxConcurrentUploadParts: 4,

      metadata: {
        // Up to 2KB of arbitrary JSON.
        productId: 60891,
      },

      tags: [
        // Up to 25 tags per file.
        "example_tag",
      ],

      path: {
        // See path variables: https://upload.io/docs/path-variables
        folderPath: "/uploads/{UTC_YEAR}/{UTC_MONTH}/{UTC_DAY}",
        fileName: "{UNIQUE_DIGITS_8}{ORIGINAL_FILE_EXT}",
      },

      cancellationToken: {
        // Set to 'true' after invoking 'upload' to cancel the upload.
        isCancelled: false,
      },
    })
    .then(
      ({ fileUrl, filePath }) => {
        // --------------------------------------------
        // File successfully uploaded!
        // --------------------------------------------
        // The 'filePath' uniquely identifies the file,
        // and is what you should save to your DB.
        // --------------------------------------------
        console.log(`File uploaded to: ${fileUrl}`);
      },
      (error) => console.error(`Upload failed: ${error.message}`, error)
    );

  res.status(200).send({ message: "OK" });
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
