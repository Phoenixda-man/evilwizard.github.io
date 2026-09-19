var N64WASMSETTINGS = {
    CLOUDSAVEURL: "",
    SHOWADVANCED: false, 
    SHOWOPTIONS: true,
    
    // --- KEEP AUDIO BUT MAXIMIZE SPEED ---
    AUDIO: true,             // RE-ENABLED FOR THE BOWSER VOICE
    MUTE: false,
    QUALITY: "low",          // Drops graphic texture rendering to save CPU for audio
    FRAMESKIP: 5,            // Higher frameskip keeps the speed up even with audio overhead
    
    // --- ADVANCED AUDIO CACHE TUNING ---
    BUFFER_SIZE: 16384,      // HUGE buffer size gives the Chromebook massive breathing room
    SYNCTOAUDIO: false       // CRUCIAL: Bypasses the audio lock so the graphics don't stall
};

// Direct WebAssembly context hooks
if (typeof window !== 'undefined') {
    window.EmuSettings = N64WASMSETTINGS;
    
    if (!window.Module) window.Module = {};
    // Pushes deep arguments directly into the minified n64wasm.js binary on startup
    window.Module.arguments = [
        "--frameskip", "5", 
        "--low-res", 
        "--audio-buffer", "16384",
        "--no-sync"
    ];
}
