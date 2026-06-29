// require('dotenv').config({path:'./env'})

import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import connectDB from "./db/index.js";
import { app } from "./app.js";
import express from "express";
import os from "os";
import path from "path";

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


connectDB()
  .then(() => {
    const port = Number(process.env.PORT || 8000);

    const server = app.listen(port, () => {
      console.log(`Server is running at port : ${port}`);
      const ip = getLocalIpAddress();
      console.log(`Server running at http://${ip}:${port}/`);
    });

    server.on("error", (error) => {
      console.error("Server error:", error);
    });
  })
  .catch((err) => {
    console.log("MONGODB connection failed !!!", err);
  });

