import puppeteer from "puppeteer";

export default class Puppeteer {

  static async generateTrialPdf(html2: any, fileNameTwoTrial: string) {

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });

    const secondPage = await browser.newPage();
    await secondPage.setContent(html2);
    await secondPage.pdf({
      path: fileNameTwoTrial,
      format: "a3",
      printBackground: true,
      displayHeaderFooter: true,
      pageRanges: "1",
      headerTemplate: ``,
      footerTemplate: ``,
      // this is needed to prevent content from being placed over the footer
      margin: { bottom: '70px' },
    });

    browser.close();

  }

}