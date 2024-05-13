const functions = require('firebase-functions');
const admin = require('firebase-admin')
const {Storage} = require('@google-cloud/storage');
const path = require('path');
const os = require('os');
const fs = require('fs-extra');
const obj2gltf =  require('obj2gltf');
const JSZip = require('jszip');

admin.initializeApp();

const storage = new Storage();

exports.convertObjToGlb = functions.runWith({memory: '512MB'}).region('europe-central2').storage.bucket('thesis-app-3d-models').object().onFinalize(async (object) => {
    const fileBucket = object.bucket; // The Storage bucket that contains the file.
    const filePath = object.name; // File path in the bucket.
    // const contentType = object.contentType; // File content type.
    const userID = filePath.split("/")[1]
    console.log({ bucket: fileBucket, path: filePath})
    console.log(userID)

    // Exit if this is triggered on a file that is not a ZIP.
    if (!filePath) return
    if (!filePath.endsWith('.zip')) {
        console.error('This is not a zip file.');
        return null;
    }

    const bucket = storage.bucket(fileBucket);
    const tempFilePath = path.join(os.tmpdir(), path.basename(filePath));
    const tempExtractPath = path.join(os.tmpdir(), 'extracted');

    await fs.ensureDir(tempExtractPath);

    // Download file from bucket.
    await bucket.file(filePath).download({destination: tempFilePath});
    console.log('ZIP file downloaded locally to', tempFilePath);

    // Read and unzip the file.
    const data = await fs.readFile(tempFilePath);
    const zip = await JSZip.loadAsync(data);
    const objFile = Object.keys(zip.files).find((fileName) => fileName.endsWith('.obj'));
    const mtlFile = Object.keys(zip.files).find((fileName) => fileName.endsWith('.mtl'));
    const jpgFile = Object.keys(zip.files).find((fileName) => fileName.endsWith('.jpg'));

    if (!objFile || !mtlFile || !jpgFile) {
        console.log('Required files are not found in the zip.');
        return null;
    }

    // Unzip files to temp directory
    await Promise.all([
        zip.file(objFile).async('nodebuffer').then((content) => fs.writeFile(path.join(tempExtractPath, objFile), content)),
        zip.file(mtlFile).async('nodebuffer').then((content) => fs.writeFile(path.join(tempExtractPath, mtlFile), content)),
        zip.file(jpgFile).async('nodebuffer').then((content) => fs.writeFile(path.join(tempExtractPath, jpgFile), content))
    ]);

    // Convert OBJ to GLB
    const objPath = path.join(tempExtractPath, objFile);
    const outputGlbPath = objPath.replace('.obj', '.glb');

    await obj2gltf(objPath, {
        binary: true
    }).then(function (glb) {
        fs.writeFileSync(outputGlbPath, glb);
    })

    // Upload the GLB file to Firebase Storage
    const glbFileName = path.basename(outputGlbPath);
    const uploadPath = `glb/${userID}/${glbFileName}`;
    await bucket.upload(outputGlbPath, {
        destination: uploadPath,
    });

    console.log('GLB file uploaded to', uploadPath);

    // Clean up temp files
    fs.remove(tempFilePath);
    fs.remove(tempExtractPath);

    return null;
});
