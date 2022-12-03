import styles from '../styles/backgroundCanvas.module.css'
import { useRef, useEffect } from "react";
import { useWindowSize } from '../hooks/windowSize.hook';


type Ball = {x: number, y: number, vx: number, vy: number, radius: number}
type Size = { width: number, height: number};
  

function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestIdRef = useRef<number | null>(null);
  const ballRef = useRef({ x: 50, y: 50, vx: 3.9, vy: 3.3, radius: 20 });
  const size = useWindowSize();
//   const size = { width: 400, height: 250 };


  const updateBall = () => {
    const ball = ballRef.current;
    ball.x += ball.vx;
    ball.y += ball.vy;
    if (ball.x + ball.radius >= size.width) {
      ball.vx = -ball.vx;
      ball.x = size.width - ball.radius;
    }
    if (ball.x - ball.radius <= 0) {
      ball.vx = -ball.vx;
      ball.x = ball.radius;
    }
    if (ball.y + ball.radius >= size.height) {
      ball.vy = -ball.vy;
      ball.y = size.height - ball.radius;
    }
    if (ball.y - ball.radius <= 0) {
      ball.vy = -ball.vy;
      ball.y = ball.radius;
    }
  };


  const frameRenderer = (ctx: any, size: Size, ball: Ball) => {
    ctx.clearRect(0, 0, size.width, size.height);
  
    const drawCircle = (x: number, y: number, radius: number, color: string, alpha = 1.0) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    };
  
    drawCircle(ball.x, ball.y, ball.radius, "#444");
  }

  const renderFrame = () => {
    const ctx = canvasRef.current?.getContext("2d");
    updateBall();
    frameRenderer(ctx, size, ballRef.current);
  };

  const tick = () => {
    if (!canvasRef.current) return;
    renderFrame();
    requestIdRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    requestIdRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(requestIdRef.current!);
    };
  }, [size]);

  return <canvas {...size} ref={canvasRef} className={styles.backgroundCanvas}/>;
}

export default Canvas;
