const { getFileFromS3, addFileContent } = require("../src/s3-client/index.js");

it("should return runs", async () => {
  let response = await getFileFromS3();
  expect(response.pop()).toEqual([]);
});

it.only("should upload new run", async () => {
  const run = "25th May";
  await addFileContent(run);
  let response = await getFileFromS3();
  expect(response.pop().run).toEqual(run);
});
