import * as dotenv from 'dotenv';
import twilio from "twilio";
dotenv.config();

const twilioClient = twilio(process.env.TWILIO_ACCOUNTSID, process.env.TWILIO_AUTHTOKEN);
let firstPage = null;
let different = false;

async function main()
{
    await recursive();
}

async function recursive()
{
    fetch(process.env.ENDPOINT)
        .then(response => response.json())
        .then(data => {
            if(data == null){
                setTimeout(recursive, 5000);
                return;
            }

            const splitData = data.split("\n");
            splitData.splice(11,1);
            const newPage = splitData.join("\n");

            if(firstPage == null){
                firstPage = newPage;
            }else{
                if (newPage == firstPage){
                    console.log("SAME");
                } else if(firstPage != newPage && !different){
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
            }

            setTimeout(recursive, 5000);
        })
}

main();