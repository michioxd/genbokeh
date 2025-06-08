import { bokeh } from './particles';
import type { ShapeType } from './types';

interface WorkerSettings {
    width: number;
    height: number;
    shape: number;
    vertices: number;
    maxradius: number;
    randomrot: boolean;
    blur: number;
    enableStroke: boolean;
    rotation: number;
    number: number;
    randomhue: number;
    randomhue_range_start: number;
    randomhue_range_end: number;
    hue: number;
    saturation: number;
    lightness: number;
    alpha: number;
}

const bokehWithOffscreen = (
    ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D,
    x: number, y: number,
    r: number, t: typeof ShapeType[keyof typeof ShapeType], s: number, rr: number, ro: number,
    hrh: number, hh: number, hs: number, hl: number, ha: number,
    min: number,
    height: number,
    enableStroke: boolean,
    blur: number,
    randomRange: [number, number]
) => {
    return bokeh(ctx as CanvasRenderingContext2D, x, y, r, t, s, rr, ro, hrh, hh, hs, hl, ha, min, height, enableStroke, blur, randomRange);
};

self.onmessage = (e: MessageEvent) => {
    const settings: WorkerSettings = e.data;
    const canvas = new OffscreenCanvas(settings.width, settings.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'lighter';
    ctx.lineWidth = 3;
    ctx.shadowOffsetY = -settings.height - settings.maxradius;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const max = settings.maxradius,
        min = max / 2;

    for (let i = 0; i < settings.number; i++) {
        const x = Math.floor(settings.width * Math.random()),
            r = max - min * Math.random(),
            y = Math.floor(settings.height * Math.random()) + max;

        bokehWithOffscreen(
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

    // Transfer the image data back to the main thread
    const imageData = ctx.getImageData(0, 0, settings.width, settings.height);
    self.postMessage({ imageData }, { transfer: [imageData.data.buffer] });
}; 