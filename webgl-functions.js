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

import WebGLRenderer from "./webgl";

const initWebGL = (fragment) => {
  const canvasTop = document.getElementById("canvasTopRef");
  const canvasBottom = document.getElementById("canvasBottomRef");
  const video = document.getElementById("webmVideo");

  if (!canvasTop || !canvasBottom || !video) return;

  const webGLCanvas = new WebGLRenderer(
    canvasTop,
    vertexShaderSource,
    fragment
  );
  return webGLCanvas;
};

var tf = true; //TODO

const drawOnCanvas = () => {
  console.log("Tets");
  const video = document.getElementById("webmVideo");

  if (!video || !video.src.endsWith(".mp4")) return;

  const wbglCanvasHori = initWebGL(fragmentShaderHorizontalSource);
  const wbglCanvasVerti = initWebGL(fragmentShaderSource);

  if (!wbglCanvasHori || !wbglCanvasVerti) return;

  let animationFrameId;
  const frameRate = 30;
  let lastTime = 0;

  const draw = (time) => {
    if (video.paused || video.ended) return;


    const elapsed = time - lastTime;
    const interval = 1000 / frameRate;

    if (elapsed > interval) {
      lastTime = time;
      if (tf) {
        wbglCanvasHori.setTexture(video);
        wbglCanvasHori.render(video.videoWidth, video.videoHeight, tf);
      } else {
        wbglCanvasVerti.setTexture(video);
        wbglCanvasVerti.render(video.videoWidth, video.videoHeight, tf);
      }
    }
    requestAnimationFrame(draw);
  };

  const handlePlay = () => {
    requestAnimationFrame(draw);
  };

  const handlePause = () => {
    // if (webGLStateRef.current.animationFrameId) {
    //   cancelAnimationFrame(webGLStateRef.current.animationFrameId);
    // }
  };

  video.addEventListener("play", handlePlay);
  video.addEventListener("pause", handlePause);
};

drawOnCanvas();
