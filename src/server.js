import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import googleCloudStorage from '@google-cloud/storage';
import ChrmRepository from './ chrm-repository.js';
import inert from '@hapi/inert';

const storage = new googleCloudStorage.Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const init = async () => {
  const server = Hapi.server({
    port: 80,
    host: 'localhost',
  });

  await server.register(inert);

  server.route({
    method: 'GET',
    path: '/',
    handler: async (request, h) => {
      return 'hello world';
    },
  });

  server.route({
    method: 'GET',
    path: '/files/{filename}',
    handler: async (request, h) => {
      console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS);
      const bucketName = 'chrms';

      // Downloads the file
      try {
        const file = await storage
          .bucket(bucketName)
          .file(request.params.filename);
        const exists = await file.exists();

        if (!exists[0]) {
          throw Boom.notFound();
        }

        return file.createReadStream();
      } catch (err) {
        console.log(err);
        throw Boom.badImplementation();
      }
    },
  });

  server.route({
    method: 'GET',
    path: '/chrms',
    handler: async (request, h) => {

      try {
        const chrms = await new ChrmRepository().fetchChrms();

        console.log('returning da chrms');
        console.log(chrms);
        return chrms;
      } catch (e) {
        console.log(e);
      }
    },
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
