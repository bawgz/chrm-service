// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * This application demonstrates how to perform basic operations on files with
 * the Google Cloud Storage API.
 *
 * For more information, see the README.md under /storage and the documentation
 * at https://cloud.google.com/storage/docs.
 */
const path = require('path');
// const cwd = path.join(__dirname, '..');

function main(
  bucketName = 'chrms',
  srcFilename = 'hello-adele.mp3',
  destFilename = path.join(__dirname, 'downloaded.mp3')
) {
  // [START storage_download_file]
  /**
   * TODO(developer): Uncomment the following lines before running the sample.
   */
  // const bucketName = 'Name of a bucket, e.g. my-bucket';
  // const srcFilename = 'Remote file to download, e.g. file.txt';
  // const destFilename = 'Local destination for file, e.g. ./local/path/to/file.txt';

  // Imports the Google Cloud client library
  const {Storage} = require('@google-cloud/storage');

  // Creates a client
  const storage = new Storage({ keyFilename: '../../keys/ChrmrApp-54166dbfbfa6.json' });

  async function downloadFile() {
    const options = {
      // The path to which the file should be downloaded, e.g. "./file.txt"
      destination: destFilename,
    };

    // Downloads the file
    await storage.bucket(bucketName).file(srcFilename).download(options);
    const file = await storage.bucket(bucketName).file(srcFilename);

    console.log(file);

    console.log(
      `gs://${bucketName}/${srcFilename} downloaded to ${destFilename}.`
    );
  }

  downloadFile().catch(console.error);
  // [END storage_download_file]
}
main();
