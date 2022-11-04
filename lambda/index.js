const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");
const startUrl = "https://ticketcenter.wacken.com/tickets/market";

exports.handler = async (event, context, callback) => {
  let result = null;
  let browser = null;

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    let page = await browser.newPage();
    await page.goto(startUrl);

    await page.waitForSelector("#username", {
      timeout: 2000,
    });
    await page.type("#username", process.env.WACKEN_USERNAME);
    await page.type("#password", process.env.WACKEN_PASSWORD);
    page.click("button[type='submit']");
    await page.waitForNavigation();

    if (page.url() != startUrl) return callback(null, result);

    result = await page.content();
  } catch (error) {
    return callback(error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }

  return callback(null, result);
};
