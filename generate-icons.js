const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Create icons directory if it doesn't exist
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Generate icons from the existing next.svg file or create a simple colored square
const generateIcons = async () => {
  try {
    // Create a simple colored square as icon
    const createIcon = async (size) => {
      await sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: { r: 22, g: 119, b: 255, alpha: 1 } // #1677ff
        }
      })
      .png()
      .toFile(path.join(publicDir, `android-chrome-${size}x${size}.png`));
      
      console.log(`Generated android-chrome-${size}x${size}.png`);
    };

    // Create apple touch icon
    await sharp({
      create: {
        width: 180,
        height: 180,
        channels: 4,
        background: { r: 22, g: 119, b: 255, alpha: 1 } // #1677ff
      }
    })
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
    
    console.log('Generated apple-touch-icon.png');

    // Generate required icons
    await createIcon(192);
    await createIcon(512);
    
    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
};

generateIcons();