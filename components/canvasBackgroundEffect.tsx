import { useRef, useEffect } from "react";

function Canvas() {
    const size = { width: 400, height: 250 };
    const canvasRef = useRef(null);

    const renderFrame = () => {
        // ...
    };

    const tick = () => {
        if (!canvasRef.current) return;
        renderFrame();
        requestAnimationFrame(tick);
    };

    useEffect(() => {
        requestAnimationFrame(tick);
    }, []);

    return <canvas {...size} ref={canvasRef} />;
}