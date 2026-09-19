const canvas = document.getElementById('nes-canvas');
const ctx = canvas.getContext('2d');
const imageData = ctx.createImageData(256, 240);

const nes = new jsnes.NES({
    onFrame: function(frameData) {
        for (let i = 0; i < frameData.length; i++) {
            imageData.data[i * 4] = (frameData[i] & 0xFF0000) >> 16;
            imageData.data[i * 4 + 1] = (frameData[i] & 0x00FF00) >> 8;
            imageData.data[i * 4 + 2] = frameData[i] & 0x0000FF;
            imageData.data[i * 4 + 3] = 0xFF;
        }
        ctx.putImageData(imageData, 0, 0);
    },
    onAudioSample: function(left, right) {
        // Audio implementation goes here
    }
);

// Load ROM file
fetch('roms/game.nes')
    .then(response => response.arrayBuffer())
    .then(buffer => {
        const romData = String.fromCharCode.apply(null, new Uint8Array(buffer));
        nes.loadROM(romData);
        requestAnimationFrame(runEmulation);
    });

function runEmulation() {
    nes.frame();
    requestAnimationFrame(runEmulation);
}
