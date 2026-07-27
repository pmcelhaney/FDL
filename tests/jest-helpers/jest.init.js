import 'regenerator-runtime/runtime';

process.on('unhandledRejection', error => {
    throw error;
});
