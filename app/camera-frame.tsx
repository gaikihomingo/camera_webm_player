"use client";

import React, { useRef, useEffect } from 'react';

export default function CameraFrame() {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' } // Use back camera
                });
                
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Error accessing camera:', error);
            }
        };

        startCamera();

        // Cleanup function
        return () => {
            if (videoRef.current?.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div className="relative w-full h-full">
            <video 
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
            />
        </div>
    )
}