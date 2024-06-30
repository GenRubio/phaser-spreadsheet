const CreateSpreadsheetTask = require('./CreateSpreadsheetTask');
const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');
const baseDir = path.join(__dirname, 'sprites');
const colors = [];

// Función para obtener el primer archivo PNG en una carpeta
const getFirstPngFile = (dirPath) => {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        if (path.extname(file).toLowerCase() === '.png') {
            return path.join(dirPath, file);
        }
    }
    return null;
};

// Función principal para procesar las carpetas dentro de sprites
const processFolders = async () => {
    const folders = fs.readdirSync(baseDir);
    for (const folder of folders) {
        const folderPath = path.join(baseDir, folder);
        if (fs.statSync(folderPath).isDirectory()) {
            const firstPng = getFirstPngFile(folderPath);
            if (firstPng) {
                const dimensions = sizeOf(firstPng);
                console.log(`Carpeta: ${folder}`);
                console.log(`Archivo: ${path.basename(firstPng)}`);
                console.log(`Dimensiones: ${dimensions.width}x${dimensions.height}`);
                console.log(`Frames: ${fs.readdirSync(folderPath).length}`);
                await CreateSpreadsheetTask.run(folder, colors, dimensions.width, dimensions.height);
                console.log('---------------------');
            }
        }
    }
};

processFolders();