import type { Request, Response } from "express";

export const healthCheckHandler = async (_: Request, response: Response) => {
  const body = {
    status: "OK",
    timeStamp: Date.now(),
    uptime: process.uptime(),
  };
  response.status(200).json(body);
};
