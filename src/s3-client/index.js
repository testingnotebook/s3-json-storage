const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const Stream = require("stream");

const BUCKET = "{SET_YOUR_OWN_UNIQUE_BUCKET_NAME_HERE}";
const KEY = "process.json";

const getFileFromS3 = async (req, res) => {
  const client = new S3Client({ region: "eu-west-1" });
  const params = {
    Bucket: BUCKET,
    Key: KEY,
  };

  const command = new GetObjectCommand(params);

  const streamToString = (stream) =>
    new Promise((resolve, reject) => {
      const chunks = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("error", reject);
      stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    });

  let returnValue = "";

  try {
    let data = await client.send(command);
    const { Body } = data;
    returnValue = await streamToString(Body);
  } catch (error) {
    return error;
  }
  return JSON.parse(returnValue).runs;
};

const addFileContent = async (run) => {
  let runs = await getFileFromS3();
  runs.push({ run: run });
  try {
    const parallelUploads3 = new Upload({
      client: new S3Client({}),
      leavePartsOnError: false,
      params: {
        Bucket: BUCKET,
        Key: KEY,
        Body: JSON.stringify({ runs: runs }),
      },
    });

    let result = "";
    parallelUploads3.on("httpUploadProgress", (progress) => {
      result = progress;
    });

    await parallelUploads3.done();
    return result;
  } catch (e) {
    return e;
  }
};

module.exports = { getFileFromS3, addFileContent };
