Wacken ticket center automation (https://github.com/deividgp/wacken-automation) implementation to deploy on AWS Lambda (coming soon).
It uses the following libraries:
- puppeteer-core: puppeteer without Chromium.
- https://github.com/Sparticuz/chromium : Chromium for serverless platforms. It is a dev dependency because on the production environment I use a custom layer instead due to the 50 MB restriction for zip files. The alternative would be uploading it to a S3 bucket, so might set up a workflow in the future.