import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/800.css'
import '@fontsource/inter/900.css'
import './style.scss';
import * as dat from 'dat.gui';
import { bokeh } from './particles'
import type { ShapeType } from './types';
import bokehWorker from './worker?worker&inline';

const initialSettings = {
    width: 1280,
    height: 720,
    shape: 0,
    vertices: 4,
    maxradius: 96,
    randomrot: true,
    blur: 1,
    enableStroke: false,
    rotation: 90,
    number: 100,
    randomhue: 0,
    randomhue_range_start: 0,
    randomhue_range_end: 360,
    hue: 0,
    saturation: 100,
    lightness: 50,
    alpha: 0.8,
    imagetype: 'image/png',

    autoupdate: true,
};

const main = function () {
    let settings = initialSettings, img = document.getElementById("main_img") as HTMLImageElement, cv = document.createElement("canvas") as HTMLCanvasElement;

    const gh = {
        github: () => {
            window.open("https://github.com/michioxd/genbokeh", "_blank");
        },
        me: () => {
            window.open("https://github.com/michioxd", "_blank");
        },
        saveImg: () => {
            const a = document.createElement("a");
            a.href = img.src;
            a.download = `bokeh-${Date.now()}.${settings.imagetype.split("/")[1]}`;
            a.click();
            a.remove();
        },
        generate: () => {
            genBokeh();
        },
        reset: () => {
            localStorage.removeItem("settings");
            settings = initialSettings;
            genBokeh();
        }
    };

    try {
        const savedSettings = localStorage.getItem("settings");
        if (savedSettings) {
            settings = JSON.parse(savedSettings);
        }
    } catch (e) {
        console.error("Error loading settings", e);
    }

    const gui = new dat.GUI({
        autoPlace: true,
        name: "Bokeh Generator",
        width: 380
    });
    gui.add(gh, "me").name("🎉genbokeh by michioxd");
    gui.add(gh, "github").name("⭐Fork me on GitHub");

    const sizeProperties = gui.addFolder("📷Image");
    const bokehProperties = gui.addFolder("✨Bokeh");
    const particleProperties = bokehProperties.addFolder("🌟Particle");
    const colorProperties = bokehProperties.addFolder("🎨Color");

    const controllers = [
        sizeProperties.add(settings, "width", 0).step(1).name("Width"),
        sizeProperties.add(settings, "height", 0).step(1).name("Height"),
        sizeProperties.add(settings, "imagetype", {
            "PNG": "image/png",
            "JPEG": "image/jpeg",
            "WEBP": "image/webp"
        }).name("Image Type"),

        particleProperties.add(settings, "shape", {
            "Circle": 0,
            "Polygon": 1,
            "Star": 2,
            "Hearts": 3
        }).name("Shape"),
        particleProperties.add(settings, "vertices", 3, 10).step(1).name("Vertices"),
        particleProperties.add(settings, "maxradius", 10, 200).step(1).name("Max Size"),
        particleProperties.add(settings, "blur", 1, 15).step(0.1).name("Blur"),
        particleProperties.add(settings, "enableStroke").name("Stroke"),
        particleProperties.add(settings, "randomrot").name("Random Rotation"),
        particleProperties.add(settings, "rotation", 0, 360).step(1).name("Rotation"),
        particleProperties.add(settings, "number", 0, 1000).step(1).name("Particles count"),

        colorProperties.add(settings, "randomhue", {
            "None": 0,
            "Rainbow": 1,
            "Random in range": 2
        }).name("Random Hue"),
        colorProperties.add(settings, "randomhue_range_start", 0, 360).step(1).name("Range Start"),
        colorProperties.add(settings, "randomhue_range_end", 0, 360).step(1).name("Range End"),
        colorProperties.add(settings, "hue", 0, 360).step(1).name("Hue"),
        colorProperties.add(settings, "saturation", 0, 100).step(1).name("Saturation"),
        colorProperties.add(settings, "lightness", 0, 100).step(1).name("Lightness"),
        colorProperties.add(settings, "alpha", 0, 1).step(0.01).name("Alpha")
    ];

    controllers.forEach(controller => {
        controller.onChange((v) => {
            if (controller.property === "hue" || controller.property === "bg_hue") {
                const sliderElement = controller.domElement.querySelector(".slider .slider-fg") as HTMLElement;
                if (sliderElement) {
                    sliderElement.style.backgroundColor = `hsl(${v}, 100%, 50%)`;
                }
            }
            if (settings.autoupdate) {
                genBokeh();
            }
            return v;
        });
    });

    gui.add(settings, "autoupdate").name("🔄Auto Update");
    gui.add(gh, "generate").name("⚙️Generate");
    gui.add(gh, "saveImg").name("💾Save Image");
    gui.add(gh, "reset").name("🔄Reset Settings");

    let worker: Worker | null = null;
    let isWorkerSupported = typeof Worker !== 'undefined' && typeof OffscreenCanvas !== 'undefined';
    let isLoading = false;

    function showLoading() {
        isLoading = true;
        const loadingDiv = document.getElementById('loading');
        if (loadingDiv) {
            loadingDiv.style.display = 'flex';
        }
    }

    function hideLoading() {
        isLoading = false;
        const loadingDiv = document.getElementById('loading');
        if (loadingDiv) {
            loadingDiv.style.display = 'none';
        }
    }

    function initWorker() {
        if (isWorkerSupported && !worker) {
            try {
                worker = new bokehWorker();
                worker.onmessage = (e) => {
                    const { imageData } = e.data;
                    if (cv) cv.remove();
                    cv = document.createElement("canvas") as HTMLCanvasElement;
                    cv.width = settings.width;
                    cv.height = settings.height;
                    const ctx = cv.getContext("2d");
                    if (!ctx) return;
                    ctx.putImageData(imageData, 0, 0);
                    img.src = cv.toDataURL.apply(cv, [settings.imagetype, 1]);
                    hideLoading();
                };
            } catch (e) {
                console.warn('Web Worker initialization failed, falling back to main thread', e);
                isWorkerSupported = false;
            }
        }
    }

    function genBokeh() {
        if (isLoading) return;
        localStorage.setItem("settings", JSON.stringify(settings));
        if (settings.randomhue_range_start > settings.randomhue_range_end) {
            console.error("Random hue range start is greater than random hue range end");
            return;
        }

        if (isWorkerSupported) {
            if (!worker) {
                initWorker();
            }
            if (worker) {
                console.log("Worker supported, posting message");
                showLoading();
                worker.postMessage(settings);
                return;
            }
        }

        if (cv) cv.remove();
        cv = document.createElement("canvas") as HTMLCanvasElement;
        cv.width = settings.width;
        cv.height = 3 * settings.height;
        const ctx = cv.getContext("2d");
        if (!ctx) return;
        ctx.globalCompositeOperation = 'lighter';
        ctx.lineWidth = 3;
        ctx.shadowOffsetY = -settings.height - settings.maxradius;
        ctx.clearRect(0, 0, cv.width, cv.height);

        const max = settings.maxradius,
            min = max / 2;
        for (var i = 0; i < settings.number; i++) {
            var x = Math.floor(settings.width * Math.random()),
                r = max - min * Math.random(),
                y = Math.floor(settings.height * Math.random()) + max;
            bokeh(
                ctx,
                x, y, r,
                settings.shape as typeof ShapeType[keyof typeof ShapeType],
                settings.vertices,
                settings.randomrot ? 1 : 0,
                Math.PI * settings.rotation / 180,
                settings.randomhue,
                settings.hue,
                settings.saturation,
                settings.lightness,
                settings.alpha,
                min,
                settings.height,
                settings.enableStroke,
                settings.blur,
                [settings.randomhue_range_start, settings.randomhue_range_end]
            );
        }

        var imgData = ctx.getImageData(0, 0, settings.width, settings.height);
        cv.height = settings.height;
        ctx.putImageData(imgData, 0, 0);
        img.src = cv.toDataURL.apply(cv, [settings.imagetype, 1]);
        hideLoading();
    }

    genBokeh();
};

window.addEventListener('load', main);
