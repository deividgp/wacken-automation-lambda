import * as dotenv from "dotenv";
import fetch from "node-fetch";
import fs from "fs";
dotenv.config();

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

      fs.writeFileSync("noTicket.html", newPage);
    })
    .catch((error) => {
      console.error("Error:" + error);
    });
}

await main();
