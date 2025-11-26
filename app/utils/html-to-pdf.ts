const puppeteer = require("puppeteer")
var path = require('path');


const sleep = (waitTimeInMs: number | undefined) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));


const quotesReportHtmlToPdf = async (html: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.time()
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox']
            });
            console.log('puppeteer browser version', await browser.version())
            const page = await browser.newPage();
            await page.setDefaultNavigationTimeout(0);
            await page.setContent(String(html.value))
            // console.log('html.key', html.key);
            await sleep(1000)

            await page.pdf({
                path: path.resolve(html.key),
                // format: "A4",
                printBackground: true,
                // landscape: html.landscape,
                displayHeaderFooter: true,
                headerTemplate: "<div/>",
                //  headerTemplate: '<div id="header-template" style="font-size:10px !important; color:#808080; padding-left:10px"><span class="date"></span><span class="title"></span><span class="url"></span><span class="pageNumber"></span><span class="totalPages"></span></div>',
                footerTemplate: '<div id="footer-template" style=\"text-align: right;font-size:6px !important; color:#808080; padding-left:550px;\">Page <span class=\"pageNumber\"></span> of <span class=\"totalPages\"></span></div>',
                // margin: {
                // top: '100px',
                // bottom: '27px',
                //right: '30px',
                //left: '30px',
                // },
            });
            await browser.close();
            console.timeEnd()
            resolve('true')

        } catch (err) {
            console.log(err, 'err')
            reject(err)
        }
    })

}

export {
    quotesReportHtmlToPdf
}