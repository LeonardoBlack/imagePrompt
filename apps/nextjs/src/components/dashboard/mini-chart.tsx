"use client";

import { useEffect, useRef } from "react";

interface ChartProps {
  data: Array<{ name: string; value: number }>;
  color?: string;
  height?: number;
}

export function MiniChart({ data, color = "#3b82f6", height = 60 }: ChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = height * 2;
    ctx.scale(2, 2);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.offsetWidth, height);

    // Find max value for scaling
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue || 1;

    // Draw line chart
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const stepX = canvas.offsetWidth / (data.length - 1);
    
    ctx.beginPath();
    data.forEach((point, index) => {
      const x = index * stepX;
      const y = height - ((point.value - minValue) / range) * (height - 10) - 5;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw area under line
    ctx.fillStyle = color + "20";
    ctx.lineTo(canvas.offsetWidth, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();

  }, [data, color, height]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ height: `${height}px` }}
    />
  );
}