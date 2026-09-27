// Central UI Layout definitions and core canvas drawing engine loop
const uiComponents = [
    {
        id: "top-bar",
        type: "panel",
        x: 0, y: 0, w: 950, h: 55,
        bg: "#00105c", border: "#0050ef"
    },
    {
        id: "brand-text",
        type: "text",
        x: 25, y: 34,
        color: "#ff0055", fontProp: "title", fontSize: "20px", fontWeight: "bold",
        value: () => _un(titleStr)
    },
    {
        id: "search-input-box",
        type: "input-field",
        x: 180, y: 12, w: 630, h: 30,
        bg: "#00082c", border: "#0050ef",
        textX: 195, textY: 31, fontProp: "body", fontSize: "12px",
        placeholder: "Text goes here"
    },
    {
        id: "search-btn",
        type: "button",
        x: 830, y: 12, w: 100, h: 30,
        bg: "#ff0055", color: "#efefef", fontProp: "title", fontSize: "13px", fontWeight: "bold",
        value: () => _un(uiHome),
        action: 1
    },
    {
        id: "brand-footer-btn",
        type: "button",
        x: 730, y: 660, w: 200, h: 30,
        bg: "#00105c", border: "#0050ef", color: "#66fcf1", fontProp: "title", fontSize: "14px", fontStyle: "italic",
        value: () => _un(uiMask),
        action: 2
    }
];

function drawEngineFrame(ctx, canvas, state) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let clickRegistry = [];
    let contentStartY = 110;

    if (state.sMode === 1) {
        state.tRender.style.display = "none";
        state.siteEntries.forEach((entry, idx) => {
            let yPos = contentStartY + (idx * 95) + state.scrollOffset;
            if (yPos < 65 || yPos > canvas.height + 20) return;

            ctx.fillStyle = "#66fcf1";
            ctx.font = "bold 22px " + _un(f1);
            ctx.fillText(entry.text, 50, yPos);

            ctx.fillStyle = "#efefef";
            ctx.font = "14px " + _un(f2);
            ctx.fillText(_un(uiDesc), 50, yPos + 24);

            clickRegistry.push({
                x: 50, y: yPos - 20,
                w: ctx.measureText(entry.text).width, h: 24,
                action: 3, index: idx
            });
        });
        state.maxScroll = Math.max(0, (state.siteEntries.length * 95) - (canvas.height - 160));
    } else if (state.sMode === 2) {
        state.tRender.style.display = "block";
    } else if (state.sMode === 0) {
        state.tRender.style.display = "none";
        ctx.fillStyle = "#ff0055";
        ctx.font = "bold 44px " + _un(f1);
        ctx.fillText(_un(titleStr), canvas.width / 2 - 80, 250);
        
        ctx.fillStyle = "#efefef";
        ctx.font = "14px " + _un(f2);
        ctx.fillText(_un(uiPrompt), canvas.width / 2 - 200, 320);
    }

    if (state.sMode !== 2 && state.maxScroll > 0) {
        let trackH = canvas.height - 110;
        let barH = Math.max(20, (trackH / (state.maxScroll + trackH)) * trackH);
        let barY = 85 + (-state.scrollOffset / state.maxScroll) * (trackH - barH);
        ctx.fillStyle = "#00105c";
        ctx.fillRect(canvas.width - 12, 85, 8, trackH);
        ctx.fillStyle = "#ff0055";
        ctx.fillRect(canvas.width - 12, barY, 8, barH);
    }

    uiComponents.forEach(comp => {
        let fontFace = comp.fontProp === "title" ? _un(f1) : _un(f2);
        let stylePrefix = comp.fontStyle ? comp.fontStyle + " " : "";
        let weightPrefix = comp.fontWeight ? comp.fontWeight + " " : "";
        ctx.font = stylePrefix + weightPrefix + (comp.fontSize || "14px") + " " + fontFace;

        if (comp.type === "panel") {
            ctx.fillStyle = comp.bg;
            ctx.fillRect(comp.x, comp.y, comp.w, comp.h);
            if (comp.border) {
                ctx.strokeStyle = comp.border;
                ctx.lineWidth = 1;
                ctx.strokeRect(comp.x, comp.y, comp.w, comp.h);
            }
        }
        else if (comp.type === "text") {
            ctx.fillStyle = comp.color;
            ctx.fillText(comp.value(), comp.x, comp.y);
        }
        else if (comp.type === "input-field") {
            ctx.fillStyle = comp.bg;
            ctx.fillRect(comp.x, comp.y, comp.w, comp.h);
            ctx.strokeStyle = comp.border;
            ctx.strokeRect(comp.x, comp.y, comp.w, comp.h);

            let pathSuffix = state.sMode === 2 ? pathDefault : pathResults;
            let displayPath = _un(repoStr) + _un(pathSuffix);

            if (state.queryStr === "") {
                ctx.fillStyle = "#efefef";
                ctx.fillText(displayPath, comp.textX, comp.textY);
                let baseW = ctx.measureText(displayPath).width;
                ctx.fillStyle = "rgba(239, 239, 239, 0.4)";
                ctx.fillText(comp.placeholder, comp.textX + baseW, comp.textY);
            } else {
                ctx.fillStyle = "#efefef";
                ctx.fillText(displayPath + state.queryStr, comp.textX, comp.textY);
            }
        }
        else if (comp.type === "button") {
            ctx.fillStyle = comp.bg;
            ctx.fillRect(comp.x, comp.y, comp.w, comp.h);
            if (comp.border) {
                ctx.strokeStyle = comp.border;
                ctx.strokeRect(comp.x, comp.y, comp.w, comp.h);
            }

            ctx.fillStyle = comp.color;
            let strVal = comp.value();
            let textW = ctx.measureText(strVal).width;
            let cX = comp.x + ((comp.w - textW) / 2);
            let cY = comp.y + (comp.h / 2) + 5;
            ctx.fillText(strVal, cX, cY);

            clickRegistry.push({
                x: comp.x, y: comp.y, w: comp.w, h: comp.h,
                action: comp.action
            });
        }
    });

    return { clickRegistry, calculatedMaxScroll: state.maxScroll };
}

// Intercept window event signaling rules
window.addEventListener('requestFrameworkDraw', (e) => {
    const { ctx, canvas, state } = e.detail;
    const engineResults = drawEngineFrame(ctx, canvas, state);
    
    // Broadcast computed hitboxes and layout limits straight back to index.html execution scope
    window.dispatchEvent(new CustomEvent('frameworkDrawComplete', { detail: engineResults }));
});
