const puppeteer = require("puppeteer");
const fs = require("fs");

const concurency = 1; // total user yg request isi dengan id atau total, karena id sama dengan total
const userList = JSON.parse(fs.readFileSync("./concurency/users.json", "utf8"));
const algo = "KECCAK"; // SHA1 or KECCAK
const users = userList[concurency - 1];
const signinPage = `http://localhost:3000/signin?algo=${algo}&testName=Test ${concurency} user&concurencyId=${concurency}`;
async function main(username, password) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1500, height: 1500 });

    // START LOGIN
    await page.goto(signinPage, {
        waitUntil: "networkidle0",
    }); // wait until page load
    await page.type("#login_username", username);
    await page.type("#login_password", password);
    // click and wait for navigation
    await Promise.all([
        page.click("#buttonLogin"),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
    ]);
    // END LOGIN

    // START MOVE PAGE TEST
    await Promise.all([page.click("#sidebar_test")]);
    // END MOVE PAGE TEST

    // START TEST
    await page.waitForSelector("#buttonRunTest");
    await Promise.all([page.click("#buttonRunTest")]);
    // END TEST

    // SAVE TEST
    // await page.waitForSelector("#buttonSaveTest");
    // await Promise.all([page.click("#buttonSaveTest")]);
    // END SAVE TEST
}

for (let i = 0; i < users.length; i++) {
    const username = users[i].username;
    const password = users[i].password;

    main(username, password);
}
//tesdeeee
