import * as dotenv from 'dotenv';
import twilio from "twilio";
dotenv.config();

const twilioClient = twilio(process.env.TWILIO_ACCOUNTSID, process.env.TWILIO_AUTHTOKEN);
const timeout = 5000;
let firstPage = null;
let different = false;

async function main() {
    fetch(process.env.ENDPOINT)
        .then(response => response.json())
        .then(data => {
            if (data == null) {
                setTimeout(main, timeout);
                return;
            }

            const splitData = data.split("\n");
            splitData.splice(11, 1);
            const newPage = splitData.join("\n");

            if (firstPage == null) {
                firstPage = newPage;
                setTimeout(main, timeout);
                return;
            }

            if (newPage == firstPage) {
                console.log("SAME");
            } else if (firstPage != newPage && !different) {
                console.log("DIFFERENT");
                twilioClient.messages
                    .create({
                        body: "TICKET AVAILABLE",
                        messagingServiceSid: process.env.TWILIO_MESSAGINGSID,
                        to: process.env.TWILIO_TO
                    })
                    .done();
                different = true;
            }

            setTimeout(main, timeout);
        })
}

main();