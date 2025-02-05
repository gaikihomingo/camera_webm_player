export default class WebGLRenderer {
    private gl: WebGLRenderingContext;
    private program: WebGLProgram;
    private positionBuffer: WebGLBuffer;
    private texCoordBuffer: WebGLBuffer;
    private topTexture: WebGLTexture;
    private bottomTexture: WebGLTexture;

    constructor(
        canvas: HTMLCanvasElement,
        vertexShaderSource: string,
        fragmentShaderSource: string,
    ) {
        this.gl = canvas.getContext("webgl")!;
        if (!this.gl) {
            throw new Error("WebGL not supported");
        }

        this.program = this.createProgram(
            vertexShaderSource,
            fragmentShaderSource
        );
        this.positionBuffer = this.createPositionBuffer();
        this.texCoordBuffer = this.createTexCoordBuffer();
        this.topTexture = this.gl.createTexture()!;
        this.bottomTexture = this.gl.createTexture()!;
    }

    private createShader(type: number, source: string): WebGLShader {
        const shader = this.gl.createShader(type)!;
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            throw new Error(
                `Shader compilation failed: ${this.gl.getShaderInfoLog(shader)}`
            );
        }

        return shader;
    }

    private createProgram(
        vertexShaderSource: string,
        fragmentShaderSource: string
    ): WebGLProgram {
        const vertexShader = this.createShader(
            this.gl.VERTEX_SHADER,
            vertexShaderSource
        );
        const fragmentShader = this.createShader(
            this.gl.FRAGMENT_SHADER,
            fragmentShaderSource
        );

        const program = this.gl.createProgram()!;
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);

        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            throw new Error(
                `Program linking failed: ${this.gl.getProgramInfoLog(program)}`
            );
        }

        return program;
    }

    private createPositionBuffer(): WebGLBuffer {
        const positionBuffer = this.gl.createBuffer()!;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        const positions = [-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0];
        this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            new Float32Array(positions),
            this.gl.STATIC_DRAW
        );
        return positionBuffer;
    }

    private createTexCoordBuffer(): WebGLBuffer {
        const texCoordBuffer = this.gl.createBuffer()!;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texCoordBuffer);
        const texCoords = [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0];
        this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            new Float32Array(texCoords),
            this.gl.STATIC_DRAW
        );
        return texCoordBuffer;
    }

    public setTexture(video: HTMLVideoElement | HTMLVideoElement): void {
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.topTexture);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.topTexture);
        this.gl.texImage2D(
            this.gl.TEXTURE_2D,
            0,
            this.gl.RGBA,
            this.gl.RGBA,
            this.gl.UNSIGNED_BYTE,
            video
        );
        this.gl.texParameteri(
            this.gl.TEXTURE_2D,
            this.gl.TEXTURE_WRAP_S,
            this.gl.CLAMP_TO_EDGE
        );
        this.gl.texParameteri(
            this.gl.TEXTURE_2D,
            this.gl.TEXTURE_WRAP_T,
            this.gl.CLAMP_TO_EDGE
        );
        this.gl.texParameteri(
            this.gl.TEXTURE_2D,
            this.gl.TEXTURE_MIN_FILTER,
            this.gl.LINEAR
        );

        this.gl.bindTexture(this.gl.TEXTURE_2D, this.bottomTexture);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.bottomTexture);
        this.gl.texImage2D(
            this.gl.TEXTURE_2D,
            0,
            this.gl.RGBA,
            this.gl.RGBA,
            this.gl.UNSIGNED_BYTE,
            video
        );
        this.gl.texParameteri(
            this.gl.TEXTURE_2D,
            this.gl.TEXTURE_WRAP_S,
            this.gl.CLAMP_TO_EDGE
        );
        this.gl.texParameteri(
            this.gl.TEXTURE_2D,
            this.gl.TEXTURE_WRAP_T,
            this.gl.CLAMP_TO_EDGE
        );
        this.gl.texParameteri(
            this.gl.TEXTURE_2D,
            this.gl.TEXTURE_MIN_FILTER,
            this.gl.LINEAR
        );
    }

    public render(width: number, height: number, isAlphaVideoHorizontal: boolean): void {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.gl.useProgram(this.program);

        const positionAttributeLocation = this.gl.getAttribLocation(
            this.program,
            "a_position"
        );
        this.gl.enableVertexAttribArray(positionAttributeLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.vertexAttribPointer(
            positionAttributeLocation,
            2,
            this.gl.FLOAT,
            false,
            0,
            0,
        );

        const texCoordAttributeLocation = this.gl.getAttribLocation(
            this.program,
            "v_texCoord"
        );
        this.gl.enableVertexAttribArray(texCoordAttributeLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
        this.gl.vertexAttribPointer(
            texCoordAttributeLocation,
            2,
            this.gl.FLOAT,
            false,
            0,
            0
        );

        this.gl.canvas.width = isAlphaVideoHorizontal ? width / 2 : width;
        this.gl.canvas.height = isAlphaVideoHorizontal ? height : height / 2;

        this.gl.viewport(0, 0, width, height);

        const imageLocation = this.gl.getUniformLocation(this.program, "u_image");
        const bottomImageLocation = this.gl.getUniformLocation(
            this.program,
            "u_bottomImage"
        );

        this.gl.uniform1i(imageLocation, 0);
        this.gl.uniform1i(bottomImageLocation, 1);

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.topTexture);
        this.gl.activeTexture(this.gl.TEXTURE1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.bottomTexture);

        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }

    public resize(width: number, height: number): void {
        this.gl.canvas.width = width;
        this.gl.canvas.height = height;
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    }
}
