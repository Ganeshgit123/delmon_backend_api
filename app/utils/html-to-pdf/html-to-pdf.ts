declare var require: any
var puppeteer = require('puppeteer');
var path = require('path');
// import { config } from "dotenv";
// const dotenv = config();

class htmlToPdfController {

    static htmlToPdf = async (html: any) => {

        try {
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox']
            });

            console.log('puppeteer browser version', await browser.version())
            const page = await browser.newPage();

            // Configure the navigation timeout
            await page.setDefaultNavigationTimeout(0);

            await page.setContent(String(html.value))

            let result = await page.pdf({
                path: path.resolve(html.key),
                format: "a4",
                printBackground: true,
                displayHeaderFooter: true,          
                headerTemplate: ``,
                footerTemplate: `
                <div style="font-family: Arial, Helvetica, sans-serif;font-size: 10px;padding: 10px 50px 0; position:relative; color: #ddd; border-top: 1px solid #dddddd; width:100%; margin-top:-5px">
                    <div style="position: absolute; left: 50px; top: 7px;"><span>ClearVUE Systems Limited is a wholly owned subsidiary of Global Procurement Group Limited</span></div>
                    <div style="position: absolute; right: 50px; top: 7px; font-weight: bold;"><span class="pageNumber"></span></div>
                </div>
              `,
                // this is needed to prevent content from being placed over the footer
                margin: { bottom: '70px' },
            });
            console.log(result);
            

            await browser.close();
            return ('success')
        } catch (err) {
            console.log(err,  'puppeteer error')
            return ('failure')
        }
    }
}
export default htmlToPdfController;
