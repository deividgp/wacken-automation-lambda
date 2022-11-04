import * as dotenv from "dotenv";
import twilio from "twilio";
import fetch from "node-fetch";
import fs from "fs";
dotenv.config();

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNTSID,
  process.env.TWILIO_AUTHTOKEN
);
const interval = 7500;
const noTicketPage = fs.readFileSync("./noTicket.html");
let different = false;

async function main() {
  fetch(process.env.ENDPOINT)
    .then((response) => response.json())
    .then((data) => {
      if (data == null || typeof data != "string") {
        return;
      }

      const splitData = data.split("\n");
      splitData.splice(11, 1);
      const newPage = splitData.join("\n");

      if (newPage == noTicketPage) {
        different = false;
      } else if (noTicketPage != newPage && !different) {
        const now = new Date();
        console.log("DIFFERENT " + now.toString());
        twilioClient.messages
          .create({
            body: "TICKET AVAILABLE",
            messagingServiceSid: process.env.TWILIO_MESSAGINGSID,
            to: process.env.TWILIO_TO,
          })
          .done();
        different = true;
      }
    })
    .catch((error) => {
      console.error("Error:" + error);
    });
}

setInterval(main, interval);
