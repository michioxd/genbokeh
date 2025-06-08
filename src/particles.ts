import { ShapeType } from "./types";

export function bokeh(
    ctx: CanvasRenderingContext2D,
    x: number, y: number,
    r: number, t: typeof ShapeType[keyof typeof ShapeType], s: number, rr: number, ro: number,
    hrh: number, hh: number, hs: number, hl: number, ha: number,
    min: number,
    height: number,
    enableStroke: boolean,
    blur: number,
    randomRange: [number, number],
) {
    ctx.shadowBlur = r / min * (Math.random() * 15 + 1) * blur;

    ctx.strokeStyle = enableStroke ? "rgba(0, 0, 0, 0.5)" : "transparent";
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    if (hrh > 0) {
        if (hrh > 1) {
            hh = Math.round(Math.random() * (randomRange[1] - randomRange[0]) + randomRange[0]);
        } else {
            hh = Math.round(Math.random() * 360);
        }
    }
    ctx.shadowColor = "hsla(" + hh + ", " + hs + "%, " + hl + "%, " + ha + ")";

    ctx.save();
    ctx.translate(x, y + height);
    ctx.beginPath();
    // @ts-ignore
    switch (parseInt(t)) {
        case 1:
            polygon(ctx, r, s, rr, ro);
            break;
        case 2:
            nstar(ctx, r, s, rr, ro);
            break;
        case 3:
            heart(ctx, r, rr, ro);
            break;
        default:
            ctx.arc(0, 0, r, 0, 2 * Math.PI);
            break;
    }
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}

function polygon(
    ctx: CanvasRenderingContext2D,
    r: number, s: number, rr: number, ro: number
) {
    let a = 2 * Math.PI / s;

    ctx.rotate(rr * (1 - 2 * Math.random()) * Math.PI + a / 2 + ro);

    ctx.moveTo(0, r);
    for (var i = 0; i < s; i++) {
        ctx.rotate(a);
        ctx.lineTo(0, r);
    }
}

function nstar(
    ctx: CanvasRenderingContext2D,
    r: number, s: number, rr: number, ro: number
) {
    let a = 2 * Math.PI / s;

    ctx.rotate(rr * (1 - 2 * Math.random()) * Math.PI + a / 2 + ro);

    ctx.moveTo(0, r);
    for (var i = 0; i < 2 * s; i++) {
        ctx.rotate(a / 2);
        ctx.lineTo(0, r - (i % 2 == 0 ? 1 : 0) * 2 * r / 3);
    }
}

function heart(
    ctx: CanvasRenderingContext2D,
    r: number, rr: number, ro: number
) {
    ctx.rotate(rr * (1 - 2 * Math.random()) * Math.PI + ro);

    ctx.moveTo(0, 3 * r / 2);
    ctx.arc(-r / 2, 0, r / 2, 3 * Math.PI / 4, 0);
    ctx.arc(r / 2, 0, r / 2, Math.PI, Math.PI / 4);
    ctx.lineTo(0, 3 * r / 2);
}
