'use strict';

const Hapi = require('@hapi/hapi');
const Boom = require('@hapi/boom');

const {Storage} = require('@google-cloud/storage');
const storage = new Storage({ keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS });

const init = async () => {

    const server = Hapi.server({
        port: 80,
        host: 'localhost',
    });

    await server.register(require('@hapi/inert'));

    server.route({
        method: 'GET',
        path: '/',
        handler: async (request, h) => {
            return 'hello world';
        }
    });

    server.route({
        method: 'GET',
        path: '/files/{filename}',
        handler: async (request, h) => {

            console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS)
            const bucketName = 'chrms';
        
            // Downloads the file
            try {
                const file = await storage.bucket(bucketName).file(request.params.filename);
                const exists = await file.exists();
            
                if (!exists[0]) {
                    throw Boom.notFound();
                }
    
                return file.createReadStream();
            } catch (err) {
                console.log(err)
                throw Boom.badImplementation()
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/chrms',
        handler: async (request, h) => {
            const chrms = [
                {
                    title: "Hello",
                    artist: "Adele",
                    keywords: ["hello", "adele"],
                    filename: "hello-adele.mp3"
                },
                {
                    title: "Ben Sound",
                    artist: "Sunny",
                    keywords: ["ben", "sound", "sunny"],
                    filename: "bensound-sunny.mp3"
                }
            ]

            console.log("returning da chrms");
            return chrms;
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();