elements.rad_fluid = {
    behavior: behaviors.LIQUID,
    category: "liquids",
    density: 1500,
    state: "liquid",
}
elements.rad_fluid.color = elements.radiation.color;
elements.rad_fluid.reactions = elements.radiation.reactions;

elements.time_reverse = {
    color: "#ffffff",
    perTick: function() {
        pixelTicks -= 2;
    },
    rotatable: true,
    category: "special",
    canPlace: false,
}

elements.steam_train = {
    color: "#DFDFDF",
    behavior: [
        "XX|CR:smoke|XX",
        "BO AND M1|XX|CR:smoke",
        "XX|CR:smoke|XX"
    ],
    category: "gases",
    density: 99999,
    state: "gas",
}

elements.polish = {
    color: "#aba593",
    tool: function(pixel) {
        if (elements.polish.reactions[pixel.element] && Math.random()<0.25) {
            var r = elements.polish.reactions[pixel.element];
            var color2 = r.color2;
            if (color2 !== undefined) {
                if (Array.isArray(color2)) { color2 = color2[Math.floor(Math.random()*color2.length)]; }
                var rgb = hexToRGB(color2);
                pixel.color = "rgb("+rgb.r+","+rgb.g+","+rgb.b+")";
            }
        }
    },
    behavior: [
        "M2|M1|M2",
        "M1|DL%10|M1",
        "M2|M1|M2"
    ],
    reactions: {
        "wood": { color2:"#872b00" },
        "glass": { color2:"#526158" },
    },
    burn: 100,
    burnTime: 2,
    state: "gas",
    canPlace: true,
    category: "gases",
    stain: -0.5
}

window.addEventListener("load", function() {
    eLists.FOOD = [];
    for (var element in elements) {
        if (elements[element].isFood) {
            eLists.FOOD.push(element);
        }
    }
})

elements.food = {
    color: ["#359100","#74b332","#b9d461","#dede7a"],
    tick: function(pixel) { 
        // Choose randomly from eLists.SEEDS
        changePixel(pixel,eLists.FOOD[Math.floor(Math.random()*eLists.FOOD.length)]);
    },
    category: "food"
}

elements.liquid = {
    behavior: [
        "XX|XX|XX",
        "M2|XX|M2",
        "M1|M1|M1"
    ],
    category: "special"
}
elements.gas = {
    behavior: [
        "M1|M1|M1",
        "M1|XX|M1",
        "M1|M1|M1"
    ],
    state: "gas",
    category: "special"
}
elements.liquid_gas = {
    behavior: [
        "M1%25|M1%25|M1%25",
        "M2|XX|M2",
        "M1|M1|M1"
    ],
    state: "gas",
    category: "special"
}
elements.big_behavior = {
    behavior: [
        "CR:wood|CR:wood|CR:wood|CR:wood|CR:wood",
        "CR:wood|XX|XX|XX|CR:wood",
        "CR:wood|XX|XX|XX|CR:wood",
        "CR:wood|XX|XX|XX|CR:wood",
        "CR:wood|CR:wood|CR:wood|CR:wood|CR:wood",
    ],
    category: "special"
}
/*
elements.small_behavior = {
    behavior: [
        "CR:wood|CR:wood|CH:wood|CR:wood|CR:wood"
    ],
    category: "special"
}
elements.big_behavior_del = {
    behavior: [
        "CR:wood|CR:wood|CR:wood|CR:wood|CR:wood",
        "CR:wood|XX|XX|XX|CR:wood",
        "CR:wood|XX|DL|XX|CR:wood",
        "CR:wood|XX|XX|XX|CR:wood",
        "CR:wood|CR:wood|CR:wood|CR:wood|CR:wood",
    ],
    category: "special"
}
elements.odd_behavior = {
    behavior: [
        "CR:wood|CR:wood|CR:wood|CR:wood",
        "CR:wood|XX|XX|CR:wood",
        "CR:wood|XX|XX|CR:wood",
        "CR:wood|CR:wood|CR:wood|CR:wood",
    ],
    category: "special"
}
elements.big_sponge = {
    behavior: [
        "DL:water|DL:water|DL:water|DL:water|DL:water",
        "DL:water|DL:water|DL:water|DL:water|DL:water",
        "DL:water|DL:water|XX|DL:water|DL:water",
        "DL:water|DL:water|DL:water|DL:water|DL:water",
        "DL:water|DL:water|DL:water|DL:water|DL:water",
    ],
    category: "special"
}
*/

elements.flipbook = {
    tick: function(pixel) {
        if (pixel.frame === undefined) {
            pixel.frame = 0;
            pixel.color = "#ffffff"
        }
        pixel["frame"+pixel.frame] = pixel.color;
        pixel.frame = (pixel.frame+1)%(pixel.frames || 10);
        pixel.color = pixel["frame"+pixel.frame] || "#ffffff";
    },
    category: "special"
}

elements.clone_fluid = {
    color: ["#d9d943","#c3c33a"],
    tick: function(pixel) {
        behaviors.LIQUID(pixel);
        // loop through adjacentCoords
        for (var i=0; i < adjacentCoords.length; i++) {
            var coords = adjacentCoords[i];
            var x = pixel.x + coords[0];
            var y = pixel.y + coords[1];
            if (!isEmpty(x,y,true) && pixelMap[x][y].element !== "clone_fluid") {
                changePixel(pixel,pixelMap[x][y].element);
            }
        }
    },
    category: "machines",
    state: "liquid",
    density: 1000
}

// elements.tester = {
//     behavior: [
//         "SM%5 AND MX|SM%5 AND MX|SM%5 AND MX",
//         "SM%5 AND MX|XX|SM%5 AND MX",
//         "SM%5 AND MX|SM%5 AND MX|SM%5 AND MX",
//     ],
//     category: "special"
// }

addCanvasLayer("devtests");
addCanvasLayer("devtests2");
canvasLayersPre.unshift(canvasLayers["devtests"]);
devtestsCtx = canvasLayers["devtests"].getContext("2d");
devtestsCtx2 = canvasLayers["devtests2"].getContext("2d");
delete canvasLayers.devtests;
delete canvasLayers.devtests2;

viewInfo[9] = { // Blur
    name: "blur",
    pixel: viewInfo[1].pixel,
    post: function(ctx) {
        devtestsCtx.canvas.width = ctx.canvas.width;
        devtestsCtx.canvas.height = ctx.canvas.height;
        devtestsCtx.filter = "blur(80px)";
        // Draw the blurred content on the canvas
        devtestsCtx.drawImage(canvasLayers["pixels"], 0, 0);
        devtestsCtx.filter = "none";
    },
};

elements.fire.emit = true;
elements.lightning.emit = true;
elements.electric.emit = true;
elements.plasma.emit = true;
elements.uranium.emit = true;
elements.uranium.emitColor = "#00ff00";
elements.rainbow.emit = true;

viewInfo[8] = { // Blur Glow (Emissive pixels only)
    name: "blurglow",
    pixel: viewInfo[1].pixel,
    effects: true,
    colorEffects: true,
    pre: function(ctx) {
        devtestsCtx2.canvas.width = ctx.canvas.width;
        devtestsCtx2.canvas.height = ctx.canvas.height;
    },
    pixel: viewInfo[1].pixel,
    post: function(ctx) {
        devtestsCtx.canvas.width = ctx.canvas.width;
        devtestsCtx.canvas.height = ctx.canvas.height;
        devtestsCtx.filter = "blur(20px)";
        // Draw the blurred content on the canvas
        devtestsCtx.drawImage(devtestsCtx2.canvas, 0, 0);
        devtestsCtx.drawImage(devtestsCtx2.canvas, 0, 0);
        devtestsCtx.drawImage(devtestsCtx2.canvas, 0, 0);
        devtestsCtx.filter = "none";
    },
};

renderEachPixel(function(pixel,ctx) {
    if (view === 8) {
        if (elements[pixel.element].emit || pixel.emit) {
            var a = (settings.textures !== 0) ? pixel.alpha : undefined;
            drawSquare(devtestsCtx2,elements[pixel.element].emitColor||pixel.color,pixel.x,pixel.y,undefined,a);
            // viewInfo[1].pixel(pixel,devtestsCtx2);
        }
    }
})