// require('dotenv').config({path:'./env'})

import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import os from "os";
import path from "path";
import express from "express";
import net from "net";

dotenv.config({ path: ".env" });

const _dirname = path.dirname("");
const frontendBP = path.join(_dirname, "../Frontend/dist");
app.use(express.static(frontendBP));

// Function to get the local IP address
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

function getAvailablePort(startPort) {
  return new Promise((resolve, reject) => {
    const tryPort = (port) => {
      const server = net.createServer();
      server.unref();
      server.once("error", (error) => {
        if (error.code === "EADDRINUSE") {
          tryPort(port + 1);
          return;
        }
        reject(error);
      });
      server.listen(port, "0.0.0.0", () => {
        const address = server.address();
        server.close(() => resolve(address.port));
      });
    };

    tryPort(startPort);
  });
}

connectDB()
  .then(async () => {
    const configuredPort = Number(process.env.PORT || 8000);
    const port = await getAvailablePort(configuredPort);

    app.listen(port, () => {
      console.log(`Server is running at port : ${port}`);
      const ip = getLocalIpAddress();
      console.log(`Server running at http://${ip}:${port}/`);
    });
  })
  .catch((err) => {
    console.log("MONGODB connection failed !!!", err);
  });
