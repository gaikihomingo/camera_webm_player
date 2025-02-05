"use client";

import WebGLRenderer from "@/utils/webgl";
import { useCallback, useEffect, useRef } from "react";

var tf = true;

const vertexShaderSource = `
  attribute vec2 a_position;
  varying vec2 v_texCoord;
  void main() {
    gl_Position = vec4(a_position, 0, 1);
    v_texCoord = a_position * 0.5 + 0.5;
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  uniform sampler2D u_bottomImage;
  varying vec2 v_texCoord;
  void main() {
    vec2 cord = v_texCoord;
    cord.y = 0.5-v_texCoord.y;
    vec2 alpha_cord = cord;
    alpha_cord.y = cord.y+0.5;
    vec4 color = texture2D(u_bottomImage, cord);
    vec4 alpha = texture2D(u_bottomImage, alpha_cord);
    gl_FragColor = vec4(color.rgb,alpha.r);
  }
`;

const fragmentShaderHorizontalSource = `
  precision mediump float;
  uniform sampler2D u_bottomImage;
  varying vec2 v_texCoord;
  void main() {
    vec2 cord = v_texCoord;
    cord.x = v_texCoord.x;
    cord.y = 1.0-cord.y;
    vec2 alpha_cord = cord;
    alpha_cord.x = cord.x+0.5;
    vec4 color = texture2D(u_bottomImage, cord);
    vec4 alpha = texture2D(u_bottomImage, alpha_cord);
    gl_FragColor = vec4(color.rgb,alpha.r);
  }
`;

interface WebGLCanvasState {
    animationFrameId?: number;
    webGLCanvas?: WebGLRenderer;
}

export default function CardPreview() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasTopRef = useRef<HTMLCanvasElement>(null);
    const canvasBottomRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const webGLStateRef = useRef<WebGLCanvasState>({});

    // WebGL initialization and rendering logic
    const initWebGL = useCallback(
        (fragment: string): WebGLRenderer | undefined => {
            const canvasTop = canvasTopRef.current;
            const canvasBottom = canvasBottomRef.current;
            const video = videoRef.current;

            if (!canvasTop || !canvasBottom || !video) return;

            const webGLCanvas = new WebGLRenderer(
                canvasTop,
                vertexShaderSource,
                fragment
            );
            return webGLCanvas;
        },
        []
    );

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !video.src.endsWith(".mp4")) return;

        const wbglCanvasHori = initWebGL(fragmentShaderHorizontalSource);
        const wbglCanvasVerti = initWebGL(fragmentShaderSource);

        if (!wbglCanvasHori || !wbglCanvasVerti) return;

        let animationFrameId: number;
        const frameRate = 18;
        let lastTime = 0;
        tf = true;

        const draw = (time: number) => {
            if (video.paused || video.ended) return;

            const elapsed = time - lastTime;
            const interval = 1000 / frameRate;

            if (elapsed > interval) {
                lastTime = time;
                if (tf) {
                    wbglCanvasHori.setTexture(video);
                    wbglCanvasHori.render(
                        video.videoWidth,
                        video.videoHeight,
                        tf
                    );
                } else {
                    wbglCanvasVerti.setTexture(video);
                    wbglCanvasVerti.render(
                        video.videoWidth,
                        video.videoHeight,
                        tf
                    );
                }
            }
            webGLStateRef.current.animationFrameId =
                requestAnimationFrame(draw);
        };

        const handlePlay = () => {
            webGLStateRef.current.animationFrameId =
                requestAnimationFrame(draw);
        };

        const handlePause = () => {
            if (webGLStateRef.current.animationFrameId) {
                cancelAnimationFrame(webGLStateRef.current.animationFrameId);
            }
        };

        video.addEventListener("play", handlePlay);
        video.addEventListener("pause", handlePause);

        return () => {
            video.removeEventListener("play", () => {
                animationFrameId = requestAnimationFrame(draw);
            });
            video.removeEventListener("pause", () => {
                cancelAnimationFrame(animationFrameId);
            });
            cancelAnimationFrame(animationFrameId);
        };
    }, [
        videoRef.current,
        canvasTopRef.current,
    ]);

    return (
        <div className="relative w-fit">
            <video
                autoPlay 
                muted 
                loop 
                playsInline 
                crossOrigin="anonymous" 
                ref={videoRef} 
                src="https://zingcam.cdn.flamapp.com/compressed/videos/679d0b7c88d1a4597a401dfe_108509206.mp4"
                className="relative z-0"
            />
            <canvas ref={canvasTopRef} className="relative z-10" />
            <canvas ref={canvasBottomRef} className="relative z-10" />
        </div>
    )
}
