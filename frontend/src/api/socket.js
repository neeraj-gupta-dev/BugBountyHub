import { io } from "socket.io-client";

export const socket = io("https://bugbountyhub.onrender.com", {
  withCredentials: true
});
