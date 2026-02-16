import { useState, useRef, useEffect } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { baseUrl } from "../api/api_helper";
import { fileSetService } from "../api/services";

export const useZipSender = () => {
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isError, setIsError] = useState(false);
  const stompClientRef = useRef(null);

  const disconnect = () => {
    if (stompClientRef.current) {
      stompClientRef.current.disconnect();
      stompClientRef.current = null;
    }
  };

  useEffect(() => {
    return () => disconnect();
  }, []);

  const sendFileSet = async (fileSetId, recipientEmail, files, onSuccess) => {
    setIsProcessing(true);
    setProgress(0);
    setStatusMessage("Connecting to progress server...");
    setIsError(false);

    const socket = new SockJS(`${baseUrl}/ws`);
    const stompClient = Stomp.over(socket);
    stompClient.debug = () => {};
    stompClientRef.current = stompClient;

    stompClient.connect(
      {},
      async () => {
        setStatusMessage("Initializing...");

        try {
          const taskId = await fileSetService.initiateSend(
            fileSetId,
            recipientEmail,
            files,
          );

          console.log("Task ID received:", taskId);

          stompClient.subscribe(`/topic/progress/${taskId}`, (message) => {
            const body = JSON.parse(message.body);
            setProgress(body.percent);
            setStatusMessage(body.status);

            if (body.percent === -1) {
              setIsError(true);
              disconnect();
              setTimeout(() => setIsProcessing(false), 3000);
            } else if (body.percent >= 100) {
              finishSuccess(onSuccess);
            }
          });

          setTimeout(() => {
            finishSuccess(onSuccess);
          }, 500);
        } catch (error) {
          console.error("Initiate send error:", error);
          setIsError(true);
          setStatusMessage(error.message || "Failed to start sending.");
          setIsProcessing(false);
          disconnect();
        }
      },
      (error) => {
        console.error("Socket connection error:", error);
        setIsError(true);
        setStatusMessage("Could not connect to progress service.");
        disconnect();
        setIsProcessing(false);
      },
    );
  };

  const finishSuccess = (onSuccessCallback) => {
    setProgress(100);
    setStatusMessage("Completed successfully!");
    disconnect();
    setTimeout(() => {
      setIsProcessing(false);
      if (onSuccessCallback) onSuccessCallback();
    }, 1500);
  };

  return {
    progress,
    statusMessage,
    isProcessing,
    isError,
    sendFileSet,
  };
};
