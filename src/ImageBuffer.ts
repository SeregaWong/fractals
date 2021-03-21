
export class ImageBuffer {

    public get buffer() { return this._buffer; }

    private _buffer: Uint8ClampedArray;

    constructor(
        private width: number,
        private height: number,
    ) {
        this._buffer = new Uint8ClampedArray(width * height * 4);
    }

    fill(handler: (x: number, y: number) => [R: number, G: number, B: number, A: number]) {
        const {_buffer, height, width} = this;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const rgbaPixel = handler(x, y);
                const pos = (y * width + x) * 4;
                _buffer[pos] = rgbaPixel[0];
                _buffer[pos + 1] = rgbaPixel[1];
                _buffer[pos + 2] = rgbaPixel[2];
                _buffer[pos + 3] = rgbaPixel[3];
            }
        }
    }
}
