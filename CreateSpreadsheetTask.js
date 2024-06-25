const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

const CreateSpreadsheetTask = {
    async run(animationPath, colors, width, height, flipDirection = null) {
        try {
            const originalAnimationPath = animationPath;
            animationPath = './sprites/' + originalAnimationPath;
            const files = await fs.promises.readdir(animationPath);

            // Filtrar y ordenar los archivos SVG numéricamente
            const svgFiles = files.filter(file => file.endsWith('.svg')).sort((a, b) => {
                const numA = parseInt(path.basename(a, '.svg'), 10);
                const numB = parseInt(path.basename(b, '.svg'), 10);
                return numA - numB;
            });

            const promises = svgFiles.map(async file => {
                const inputPath = path.join(animationPath, file);
                const data = await fs.promises.readFile(inputPath, 'utf-8');
                const modifiedSvg = await this.modifySvgColors(data, colors);
                // Convertir SVG a PNG directamente con el tamaño deseado
                let buffer = await sharp(Buffer.from(modifiedSvg))
                    .resize(width, height, { fit: 'contain' })
                    .png()
                    .toBuffer();
                // Voltear la imagen si se especifica
                if (flipDirection) {
                    if (flipDirection === 'horizontal') {
                        buffer = await sharp(buffer).flop().toBuffer();
                    } else if (flipDirection === 'vertical') {
                        buffer = await sharp(buffer).flip().toBuffer();
                    }
                }
                return { file, buffer };
            });

            const results = await Promise.all(promises);
            const orderedBuffers = results.map(result => result.buffer);
            const collageBuffer = await this.createCollage(orderedBuffers, width, height);

            // Guardar la imagen PNG en un archivo
            const outputPath = `./output/${originalAnimationPath}/${originalAnimationPath}.png`;
            console.log('Guardando imagen PNG en:', `./output/${originalAnimationPath}`);
            if (!fs.existsSync(`./output/${originalAnimationPath}`)) {
                fs.mkdirSync(`./output/${originalAnimationPath}`, { recursive: true });
            }
            await fs.promises.writeFile(outputPath, collageBuffer);
            console.log('Imagen PNG guardada en:', outputPath);

            // Convertir el buffer a base64
            const base64Image = collageBuffer.toString('base64');

            return `data:image/png;base64,${base64Image}`;

        } catch (error) {
            console.error('Error al convertir SVG a PNG:', error);
            throw error;
        }
    },
    modifySvgColors(data, colors) {
        return new Promise((resolve, reject) => {
            xml2js.parseString(data, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }

                const svgString = JSON.stringify(result);
                let modifiedSvgString = svgString;

                // Reemplazar colores
                colors.forEach(color => {
                    const regex = new RegExp(color.color, 'g');
                    modifiedSvgString = modifiedSvgString.replace(regex, color.replace);
                });

                const modifiedSvgObject = JSON.parse(modifiedSvgString);

                const builder = new xml2js.Builder();
                const modifiedSvg = builder.buildObject(modifiedSvgObject);

                resolve(modifiedSvg);
            });
        });
    },
    createCollage(buffers, width, height) {
        const numImages = buffers.length;
        return sharp({
            create: {
                width: width * numImages, // total width is the width of one image times the number of images
                height: height, // height is just the height of one image
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 } // fully transparent background
            }
        })
            .composite(buffers.map((buffer, index) => ({
                input: buffer,
                top: 0, // all images are aligned at the top of the canvas
                left: index * width // each image is placed to the right of the previous one
            })))
            .png()
            .toBuffer()
            .then(buffer => {
                return buffer;
            })
            .catch(err => {
                throw err;
            });
    }
};

module.exports = CreateSpreadsheetTask;
