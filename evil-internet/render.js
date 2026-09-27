let blinkState = false;

const uiComponents = [
    {
        id: "top-navbar-strip",
        type: "panel",
        x: 0, y: 0, w: 950, h: 55,
        bg: "#21262d", border: "#30363d"
    },
    {
        id: "brand-header-text",
        type: "text",
        x: 25, y: 34,
        color: "#58a6ff", fontProp: "body", fontSize: "22px", fontWeight: "bold",
        value: () => "SiteMask"
    },
    {
        id: "search-input-field",
        type: "input-field",
        x: 180, y: 12, w: 550, h: 30,
        bg: "#0d1117", border: "#30363d",
        textX: 195, textY: 31, fontProp: "body", fontSize: "13px"
    },
    {
        id: "search-action-btn",
        type: "button",
        x: 745, y: 12, w: 85, h: 30,
        bg: "#da3637", color: "#ffffff", fontProp: "body", fontSize: "13px", fontWeight: "bold",
        value: () => "SEARCH",
        action: 1
    },
    {
        id: "spoof-trigger-btn",
        type: "button",
        x: 840, y: 12, w: 90, h: 30,
        bg: "#238636", color: "#ffffff", fontProp: "body", fontSize: "12px", fontWeight: "bold",
        value: () => "SPOOF TAB",
        action: 2
    },
    // Cloaking Configuration Profiles Setup Area
    { id: "p1", type: "profile-node", x: 50, y: 640, w: 100, h: 25, bg: "#21262d", txt: "Google Profile", t: "Google", i: "https://google.com" },
    { id: "p2", type: "profile-node", x: 160, y: 640, w: 100, h: 25, bg: "#21262d", txt: "Canvas Profile", t: "Instructure Canvas", i: "https://instructure.com" }
];

function drawEngineFrame(ctx, canvas, state) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let clickRegistry = [];
    let contentStartY = 110;
    blinkState = !blinkState;

    if (state.sMode === 1) {
        state.tRender.style.display = "none";
        state.siteEntries.forEach((entry, idx) => {
            let yPos = contentStartY + (idx * 95) + state.scrollOffset;
            if (yPos < 65 || yPos > canvas.height + 20) return;

            ctx.fillStyle = "#58a6ff";
            ctx.font = "bold 20px sans-serif";
            ctx.fillText(entry.text, 50, yPos);

            ctx.fillStyle = "#8b949e";
            ctx.font = "14px sans-serif";
            ctx.fillText("System registry stream node entry detail profile description.", 50, yPos + 24);

            clickRegistry.push({
                x: 50, y: yPos - 20, w: ctx.measureText(entry.text).width, h: 24,
                type: "interactive-node", action: 3, index: idx
            });
        });
        state.maxScroll = Math.max(0, (state.siteEntries.length * 95) - (canvas.height - 160));
    } else if (state.sMode === 2) {
        state.tRender.style.display = "block";
    } else if (state.sMode === 0) {
        state.tRender.style.display = "none";
        ctx.fillStyle = "#58a6ff";
        ctx.font = "bold 42px sans-serif";
        ctx.fillText("SiteMask Dashboard", 50, 220);
        
        ctx.fillStyle = "#8b949e";
        ctx.font = "16px sans-serif";
        ctx.fillText("Type a target location query path above and click SEARCH.", 50, 270);
    }

    // Process Declarative Config Components Stream
    uiComponents.forEach(comp => {
        ctx.font = (comp.fontWeight ? comp.fontWeight + " " : "") + (comp.fontSize || "14px") + " sans-serif";

        if (comp.type === "panel") {
            ctx.fillStyle = comp.bg;
            ctx.fillRect(comp.x, comp.y, comp.w, comp.h);
            ctx.strokeStyle = comp.border;
            ctx.strokeRect(comp.x, comp.y, comp.w, comp.h);
        }
        else if (comp.type === "text") {
            ctx.fillStyle = comp.color;
            ctx.fillText(comp.value(), comp.x, comp.y);
        }
        else if (comp.type === "input-field") {
            ctx.fillStyle = comp.bg;
            ctx.fillRect(comp.x, comp.y, comp.w, comp.h);
            ctx.strokeStyle = state.isFocused ? "#58a6ff" : comp.border;
            ctx.strokeRect(comp.x, comp.y, comp.w, comp.h);

            let pathPrefix = "https://github.com";
            ctx.fillStyle = "#8b949e";
            ctx.fillText(pathPrefix, comp.textX, comp.textY);
            let prefixW = ctx.measureText(pathPrefix).width;

            if (state.queryStr === "") {
                ctx.fillStyle = "rgba(139, 148, 158, 0.4)";
                ctx.fillText("Text goes here", comp.textX + prefixW, comp.textY);
                if (state.isFocused && blinkState) {
                    ctx.fillStyle = "#58a6ff";
                    ctx.fillRect(comp.textX + prefixW, comp.textY - 12, 2, 14);
                }
            } else {
                ctx.fillStyle = "#c9d1d9";
                ctx.fillText(state.queryStr, comp.textX + prefixW, comp.textY);
                if (state.isFocused && blinkState) {
                    let typedW = ctx.measureText(state.queryStr).width;
                    ctx.fillStyle = "#58a6ff";
                    ctx.fillRect(comp.textX + prefixW + typedW + 2, comp.textY - 12, 2, 14);
                }
            }

            clickRegistry.push({ x: comp.x, y: comp.y, w: comp.w, h: comp.h, type: "input-field" });
        }
        else if (comp.type === "button") {
            ctx.fillStyle = comp.bg;
            ctx.fillRect(comp.x, comp.y, comp.w, comp.h);
            ctx.fillStyle = comp.color;
            let strVal = comp.value();
            let txtW = ctx.measureText(strVal).width;
            ctx.fillText(strVal, comp.x + ((comp.w - txtW) / 2), comp.y + 19);

            clickRegistry.push({ x: comp.x, y: comp.y, w: comp.w, h: comp.h, type: "button", action: comp.action });
        }
        else if (comp.type === "profile-node") {
            // Check if active selector profile is chosen
            let isSelected = (state.spoofTitle === comp.t);
            ctx.fillStyle = comp.bg;
            ctx.fillRect(comp.x, comp.y, comp.w, comp.h);
            ctx.strokeStyle = isSelected ? "#238636" : "#30363d";
            ctx.strokeRect(comp.x, comp.y, comp.w, comp.h);

            ctx.fillStyle = isSelected ? "#238636" : "#8b949e";
            ctx.font = "11px sans-serif";
            ctx.fillText(comp.txt, comp.x + 10, comp.y + 16);

            clickRegistry.push({
                x: comp.x, y: comp.y, w: comp.w, h: comp.h,
                type: "button", action: 4, profileTitle: comp.t, profileIcon: comp.i
            });
        }
    });

    return { clickRegistry, calculatedMaxScroll: state.maxScroll };
}

window.addEventListener('requestFrameworkDraw', (e) => {
    const { ctx, canvas, state } = e.detail;
    const engineResults = drawEngineFrame(ctx, canvas, state);
    window.dispatchEvent(new CustomEvent('frameworkDrawComplete', { detail: engineResults }));
});
