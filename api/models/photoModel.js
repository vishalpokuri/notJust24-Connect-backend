const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

const setupPhotoStorage = async () => {
    const connection = mongoose.connection;
    const photoBucket = new GridFSBucket(connection.db, {
        bucketName: 'photos'
    });
    return photoBucket;
};

module.exports = setupPhotoStorage;
