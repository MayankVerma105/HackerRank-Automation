const puppeteer = require("puppeteer");
const credObj = require("./cred");
const fs = require("fs");

async function AutomationFunction() {
    const browserRepresentativeObj = await puppeteer.launch({
        headless: false,
        executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        defaultViewport: null,
        args: ["--start-maximized", "--start-in-incognito"],
        slowMo: 20
    });
    const tab = await browserRepresentativeObj.newPage();
    await tab.goto("https://www.hackerrank.com/auth/login");
    await tab.type("input[type='text']", credObj.email, { delay: 20 });
    await tab.type("input[type='password']", credObj.password, { delay: 20 });
    await tab.keyboard.press("Enter");
    await waitAndClickTopic("Java", tab);
    await waitAndClickQuestion("Java Stdin and Stdout I", tab)
    let code = await fs.promises.readFile("code.java", "utf-8");
    await copyPasteQuestion(code, tab);
    await submitCode(tab);

}
AutomationFunction();

async function waitAndClickTopic(name, tab) {
    await tab.waitForSelector(".topics-list", { visible: true });
    await tab.evaluate(findAndClick, name);
    function findAndClick(name) {
        let alltopics = document.querySelectorAll(".topics-list .topic-card a");
        let idx;
        for (idx = 0; idx < alltopics.length; idx++) {
            let cTopic = alltopics[idx].textContent.trim();
            console.log(cTopic);
            if (cTopic == name) {
                break;
            }
        }
        alltopics[idx].click();
    }
}

async function waitAndClickQuestion(name, tab) {
    await tab.waitForSelector(".challenges-list", { visible: true });
    let questions = await tab.evaluate(findAndClick, name);
    console.log(questions);

    function findAndClick(name) {
        let allQuestions = document.querySelectorAll(".challenges-list .challengecard-title");
        let idx;
        let textContent = []
        for (idx = 0; idx < allQuestions.length; idx++) {
            let cTopic = allQuestions[idx].textContent.trim();
            textContent.push(cTopic);

            if (cTopic.includes(name.trim())) {
                break;
            }
        }
        allQuestions[idx].click();
    }
}

async function copyPasteQuestion(code, tab) {
    await tab.waitForSelector('input[type="checkbox"]', { visible: true });
    await tab.click('input[type="checkbox"]');
    await tab.waitForSelector("textarea[id='input-1']", { visible: true });
    await tab.type("textarea[id='input-1']", code);
    await tab.keyboard.down('ControlLeft')
    await tab.keyboard.press('KeyA')
    await tab.keyboard.press('KeyX');
    await tab.keyboard.up('ControlLeft');
    await tab.waitForSelector(".monaco-editor");
    await tab.click(".monaco-editor");
    await tab.keyboard.down('ControlLeft')
    await tab.keyboard.press('KeyA')
    await tab.keyboard.press('KeyV');
    await tab.keyboard.up('ControlLeft');
}

async function submitCode(tab) {
    await tab.waitForSelector(".hr-monaco-submit");
    await tab.click(".hr-monaco-submit");
}
