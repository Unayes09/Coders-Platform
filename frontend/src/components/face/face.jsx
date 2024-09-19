import React, { useContext, useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { UserContext } from "../../providers/UserProvider";
import { isPremiumUser } from "../../utils/dateCalculation";

const FacialExpressionRecognition = () => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [isSad, setIsSad] = useState(false);
  const [isHappy, setIsHappy] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const { user } = useContext(UserContext);
  const isPremium = isPremiumUser(user?.premiumPackBuyDate, 90);
  useEffect(() => {
    startVideo();
    loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((currentStream) => {
        videoRef.current.srcObject = currentStream;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadModels = () => {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models')
    ]).then(() => {
      faceMyDetect();
    });
  };

  const showExpressionToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false); // Hide the toast after 3 seconds
    }, 3000);
  };

  const faceMyDetect = () => {
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      // Clear previous canvas
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);

      faceapi.matchDimensions(canvas, {
        width: 940,
        height: 650
      });
      const resized = faceapi.resizeResults(detections, {
        width: 940,
        height: 650
      });

      faceapi.draw.drawDetections(canvas, resized);
      faceapi.draw.drawFaceLandmarks(canvas, resized);
      faceapi.draw.drawFaceExpressions(canvas, resized);

      if (detections.length > 0) {
        const expressions = detections[0].expressions;

        // Check if the expression is sad
        if (expressions.sad > 0.5) {
          if (!isSad) {
            setIsSad(true);
            showExpressionToast('😢 You look sad, depressed. Please take rest and back to coding!');
          }
        } else {
          setIsSad(false); // Reset when the expression is no longer sad
        }

        if (expressions.happy > 0.9) {
          if (!isHappy) {
            setIsHappy(true);
            showExpressionToast('😊 You look happy!! Happy Coding!');
          }
        } else {
          setIsHappy(false); // Reset when the expression is no longer happy
        }
      }
    }, 1000);
  };

  if(user && isPremium){
    return (
        <>
          <div>
            <div>
              <video crossOrigin="anonymous" ref={videoRef} autoPlay style={{display:'none'}}></video>
            </div>
            <canvas ref={canvasRef} width="940" height="650" style={{display:'none'}}/>
            {/* Toast message */}
            {showToast && (
              <div
                id="toast-simple"
                className="fixed top-4 right-4 flex items-center w-full max-w-xs p-10 space-x-4 text-gray-500 bg-white divide-x divide-gray-200 rounded-lg shadow dark:text-gray-400 dark:divide-gray-700 dark:bg-gray-800"
                role="alert"
              >
                <svg
                  className="w-5 h-5 text-blue-600 dark:text-blue-500 rotate-45"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m9 17 8 2L9 1 1 19l8-2Zm0 0V9"
                  />
                </svg>
                <div className="ps-4 text-sm font-normal">{toastMessage}</div>
              </div>
            )}
          </div>
        </>
      );
  }
  else{
    return(<></>)
  }
};

export default FacialExpressionRecognition;
