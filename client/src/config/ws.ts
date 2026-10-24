import { io } from "socket.io-client";

export const socketConnection = (userId: string) => {
  return io("http://localhost:3000", {
    query: { userId },
  });
};
