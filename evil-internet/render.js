let cursorVisibility = false;

const uiComponents = [
    {
        id: "top-navbar-strip",
        type: "panel",
        x: 0, y: 0, w: 950, h: 55,
        bg: "#152550", border: "#3b5a9f"
    },
    {
        id: "brand-header-text",
        type: "text",
        x: 25, y: 34,
        color: "#efefef", fontSize: "18px", fontWeight: "600",
        value: () => "SiteMask"
    },
    {
        id: "search-input-field",
        type: "input-field",
        x: 140, y: 12, w: 680, h: 32,
        bg: "#152040", border: "#202550",
        textX: 155, textY: 32, fontSize: "14px",
        placeholder: "Text goes here..."
    },
    {
        id: "search-action-btn",
        type: "button",
        x: 835, y: 12, w: 90, h: 32,
        bg: "#3b5a9f", color: "#efefef", fontSize: "13px", fontWeight: "600",
        value: () => "Search",
        action: 1
    },
    
    // COMPACT SPOOF TRIGGER PANEL
    {
        id: "spoof-panel-bg",
        type: "panel",
        x: 25, y: 615, w: 900, h: 60,
        bg: "#000c60", border: "#3036a3"
    },
    {
        id: "spoof-status-text",
        type: "text",
        x: 45, y: 650,
        color: "#efefef", fontSize: "13px", fontWeight: "normal",
        value: () => window.stateSpoofLabel || "Spoof: None Set"
    },
    {
        id: "spoof-action-trigger-btn",
        type: "button",
        x: 775, y: 628, w: 130, h: 32,
        bg: "#da3637", color: "#efefef", fontSize: "13px", fontWeight: "600",
        value: () => "Spoof",
        action: 2
    }
];

function drawEngineFrame(ctx, canvas, state) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let clickRegistry = [];
    let contentStartY = 110;
    cursorVisibility = !cursorVisibility;
    
    window.stateSpoofLabel = state.spoofUrl ? `Current Spoof URL -> /${state.spoofUrl}` : "Curent Spoof URL: None Set";

    if (state.sMode === 1) {
        state.tRender.style.display = "none";
        state.siteEntries.forEach((entry, idx) => {
            let yPos = contentStartY + (idx * 90) + state.scrollOffset;
            if (yPos < 65 || yPos > canvas.height - 110) return;

            ctx.fillStyle = "#58a6ff";
            ctx.font = "600 18px sans-serif";
            ctx.fillText(entry.text, 25, yPos);

            ctx.fillStyle = "#8b949e";
            ctx.font = "14px sans-serif";
            ctx.fillText("Image URL", 25, yPos + 22);

            clickRegistry.push({
                x: 25, y: yPos - 18, w: ctx.measureText(entry.text).width, h: 22,
                type: "interactive-node", action: 3, index: idx
            });
        });
        state.maxScroll = Math.max(0, (state.siteEntries.length * 90) - 450);
    } else if (state.sMode === 2) {
        state.tRender.style.display = "block";
    } else if (state.sMode === 0) {
        state.tRender.style.display = "none";
        ctx.fillStyle = "#c9d1d9";
        ctx.font = "600 32px sans-serif";
        ctx.fillText("SiteMask", 25, 200);
        
        ctx.fillStyle = "#8b949e";
        ctx.font = "14px sans-serif";
        ctx.fillText("Press the red button to finish spoofing.", 25, 240);
    }

    uiComponents.forEach(comp => {
        ctx.font = (comp.fontWeight ? comp.fontWeight + " " : "") + (comp.fontSize || "14px") + " sans-serif";

        if (comp.type === "panel") {
            ctx.fillStyle = comp.bg;
            ctx.fillRect(comp.x, comp.y, comp.w, comp.h);
            ctx.strokeStyle = comp.border;
            ctx.lineWidth = 1;
            ctx.strokeRect(comp.x, comp.y, comp.w, comp.h);
        }
        else if (comp.type === "text") {
            ctx.fillStyle = comp.color;
            ctx.fillText(comp.value(), comp.x, comp.y);
        }
        else if (comp.type === "input-field") {
            let hasFocus = state.isFocused;

            ctx.fillStyle = comp.bg;
            ctx.fillRect(comp.x, comp.y, comp.w, comp.h);
            ctx.strokeStyle = hasFocus ? "#58a6ff" : comp.border;
            ctx.strokeRect(comp.x, comp.y, comp.w, comp.h);

            if (state.queryStr === "") {
                ctx.fillStyle = "rgba(139, 148, 158, 0.5)";
                ctx.fillText(comp.placeholder, comp.textX, comp.textY);
                if (hasFocus && cursorVisibility) {
                    ctx.fillStyle = "#58a6ff";
                    ctx.fillRect(comp.textX, comp.textY - 13, 2, 16);
                }
            } else {
                ctx.fillStyle = "#c9d1d9";
                ctx.fillText(state.queryStr, comp.textX, comp.textY);
                if (hasFocus && cursorVisibility) {
                    let typedW = ctx.measureText(state.queryStr).width;
                    ctx.fillStyle = "#58a6ff";
                    ctx.fillRect(comp.textX + typedW + 2, comp.textY - 13, 2, 16);
                }
            }

            clickRegistry.push({ x: comp.x, y: comp.y, w: comp.w, h: comp.h, type: "input-field" });
        }
        else if (comp.type === "button") {
            ctx.fillStyle = comp.bg;
            ctx.fillRect(comp.x, comp.y, comp.w, comp.h);
            ctx.fillStyle = comp.color;
            let label = comp.value();
            let txtW = ctx.measureText(label).width;
            ctx.fillText(label, comp.x + ((comp.w - txtW) / 2), comp.y + 20);

            clickRegistry.push({ x: comp.x, y: comp.y, w: comp.w, h: comp.h, type: "button", action: comp.action });
        }
    });

    return { clickRegistry, calculatedMaxScroll: state.maxScroll };
}

window.addEventListener('requestFrameworkDraw', (e) => {
    const { ctx, canvas, state } = e.detail;
    const engineResults = drawEngineFrame(ctx, canvas, state);
    window.dispatchEvent(new CustomEvent('frameworkDrawComplete', { detail: engineResults }));
});
