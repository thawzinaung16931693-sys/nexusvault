import { useRef, useEffect } from "react";

const VERTEX_SHADER = `
attribute vec2 position;
varying vec2 v_uv;
void main() {
  v_uv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;
uniform float u_time;
uniform vec2 u_res;
uniform vec2 u_mouse;
uniform float u_intensity;
uniform float u_scrollSpeed;
varying vec2 v_uv;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  vec2 shift = vec2(100.0);
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < 5; i++) {
    v += a * vnoise(p);
    p = rot * p * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}

vec2 displace(vec2 uv, float t, float amt) {
  vec2 movement = vec2(
    fbm(uv * 1.5 + t * 0.2),
    fbm(uv * 1.5 + t * 0.2 + 5.0)
  );
  return uv + movement * amt;
}

vec4 auroraLayers(vec2 uv, float t) {
  vec3 col = vec3(0.0);
  float brightness = 0.0;
  float displacementSpeed = 0.15 + u_scrollSpeed * 0.3;
  float baseIntensity = 0.4 + u_intensity * 0.6;

  float layer1 = fbm(displace(uv + vec2(t * 0.05, t * 0.08), t * displacementSpeed, 0.4));
  vec3 color1 = mix(vec3(0.05, 0.008, 0.129), vec3(0.235, 0.173, 0.749), smoothstep(0.2, 0.6, layer1));
  float mask1 = smoothstep(0.3, 0.7, layer1) * 0.6 * baseIntensity;

  float layer2 = fbm(displace(uv + vec2(-t * 0.03, t * 0.06), t * displacementSpeed * 1.2 + 10.0, 0.5));
  vec3 color2 = mix(vec3(0.063, 0.02, 0.165), vec3(0.482, 0.302, 0.929), smoothstep(0.3, 0.7, layer2));
  float mask2 = smoothstep(0.2, 0.6, layer2) * 0.5 * baseIntensity;

  float layer3 = fbm(displace(uv + vec2(t * 0.02, -t * 0.04), t * displacementSpeed * 0.8 + 20.0, 0.6));
  vec3 color3 = mix(vec3(0.616, 0.306, 0.929), vec3(0.616, 0.306, 0.929), smoothstep(0.4, 0.8, layer3));
  float mask3 = smoothstep(0.3, 0.7, layer3) * 0.4 * baseIntensity;

  col += color1 * mask1;
  col += color2 * mask2;
  col += color3 * mask3;
  brightness += mask1 + mask2 + mask3;

  return vec4(col, clamp(brightness, 0.0, 1.0));
}

float bokeh(vec2 uv, float t) {
  float b = 0.0;
  for (int i = 0; i < 8; i++) {
    float fi = float(i);
    float speed = 0.05 + fi * 0.01;
    float angle = fi * 0.9 + t * speed;
    float dist = 0.15 + 0.1 * sin(t * 0.07 + fi * 2.0);
    vec2 pos = vec2(cos(angle) * dist, sin(angle + fi * 0.5) * dist * 0.6);
    float phase = t * (0.2 + fi * 0.05) + fi * 3.0;
    float pulse = 0.5 + 0.5 * sin(phase);
    float size = (0.02 + 0.01 * fi) * (0.7 + 0.3 * pulse);
    float d = length(uv - pos);
    b += smoothstep(size, size * 0.1, d) * (0.15 + 0.1 * pulse);
  }
  return b;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - u_res * 0.5) / min(u_res.x, u_res.y);
  float t = u_time * 0.3;

  uv += vec2(sin(t * 0.1) * 0.04, cos(t * 0.13) * 0.03);

  if (u_mouse.x > 0.0) {
    vec2 mUV = (u_mouse - u_res * 0.5) / min(u_res.x, u_res.y);
    uv += mUV * 0.2;
  }

  vec2 coreUV = uv * 1.5 + vec2(t * 0.1, t * 0.15);
  vec4 core = auroraLayers(coreUV, t);

  vec3 color = vec3(0.02, 0.008, 0.04) * (1.0 - length(uv) * 0.5);
  color += core.rgb * core.a * (1.0 + u_intensity) * 1.5;
  color += vec3(1.0, 0.8, 0.9) * bokeh(uv, t) * 0.3;
  color *= 1.0 - smoothstep(0.5, 1.5, length(uv)) * 0.4;
  color = color / (1.0 + color * 0.2);

  gl_FragColor = vec4(pow(color, vec3(0.95, 0.98, 1.0)), 1.0);
}
`;

interface AuroraBackgroundProps {
  className?: string;
}

export default function AuroraBackground({ className = "" }: AuroraBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1, y: -1 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
    if (!gl) return;

    function compileShader(src: string, type: number) {
      const shader = gl!.createShader(type)!;
      gl!.shaderSource(shader, src);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.error("Shader error:", gl!.getShaderInfoLog(shader));
        gl!.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = compileShader(VERTEX_SHADER, gl.VERTEX_SHADER);
    const fs = compileShader(FRAGMENT_SHADER, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const posLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes = gl.getUniformLocation(program, "u_res");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uIntensity = gl.getUniformLocation(program, "u_intensity");
    const uScrollSpeed = gl.getUniformLocation(program, "u_scrollSpeed");

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
      gl!.uniform2f(uRes, canvas!.width, canvas!.height);
    }

    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      mouseRef.current.x = e.clientX * dpr;
      mouseRef.current.y = e.clientY * dpr;
    };
    window.addEventListener("mousemove", onMouseMove);

    let scrollSpeed = 0;
    const onScroll = () => {
      scrollSpeed = Math.min(Math.abs(window.scrollY * 0.001), 2.0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const startTime = performance.now();

    function render() {
      const elapsed = (performance.now() - startTime) * 0.001;
      gl!.uniform1f(uTime, elapsed);
      gl!.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);
      gl!.uniform1f(uIntensity, 0.3 + scrollSpeed * 0.2);
      gl!.uniform1f(uScrollSpeed, scrollSpeed * 0.3);
      scrollSpeed *= 0.95;

      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(render);
    }

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full ${className}`}
      style={{ zIndex: 0 }}
    />
  );
}
