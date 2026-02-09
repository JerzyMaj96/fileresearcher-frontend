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

  const sendFileSet = async (fileSetId, recipientEmail, onSuccess) => {
    setIsProcessing(true);
    setProgress(0);
    setStatusMessage("Initializing...");
    setIsError(false);

    try {
      const taskId = await fileSetService.initiateSend(fileSetId, recipientEmail);
      console.log("Task ID:", taskId);

      const socket = new SockJS(`${baseUrl}/ws`);
      const stompClient = Stomp.over(socket);
      stompClientRef.current = stompClient;

      stompClient.connect({}, () => {
          stompClient.subscribe(`/topic/progress/${taskId}`, (message) => {
            const body = JSON.parse(message.body);
            setProgress(body.percent);
            setStatusMessage(body.status);

            if (body.percent === -1) {
              setIsError(true);
              disconnect();
              setTimeout(() => setIsProcessing(false), 3000);
            } 

            else if (body.percent >= 100) {
              disconnect();
              setTimeout(() => {
                setIsProcessing(false);
                if (onSuccess) onSuccess();
              }, 1000);
            }
          });
        },
        (error) => {
          console.error("Socket error", error);
          setIsError(true);
          setStatusMessage("Connection failed.");
          disconnect();
          setIsProcessing(false);
        }
      );
    } catch (error) {
      setIsError(true);
      setStatusMessage(error.message);
      setIsProcessing(false);
    }
  };

  return { 
    progress, 
    statusMessage, 
    isProcessing, 
    isError, 
    sendFileSet 
  };
};