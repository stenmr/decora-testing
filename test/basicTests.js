const { Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');

// Arrow functions are discouraged due to the way "this" gets passed

const driver = new Builder().forBrowser('chrome').build();

describe('search', function () {

    it('should go to decora.ee and assert the title', async function () {
        await driver.get('https://www.google.com');
        await driver.findElement(By.name('q')).sendKeys('decora.ee', Key.ENTER);
        await driver.wait(until.elementLocated(By.id('search')));
        await driver.findElement(By.partialLinkText('decora.ee')).click();
        const title = await driver.getTitle();

        expect(title).to.equal('Decora | Tavalisest parem ehituspood! | Ostle mugavalt e-poes decora.ee');
    });

});

describe('socialLinks', function () {

    it('should verify links to social media sites', async function () {
        const expectedLinks = [
            'https://www.facebook.com/decora24/',
            'https://www.instagram.com/decora_reklaamiosakond/',
            'https://www.youtube.com/channel/UCVxJu_qU76PJKBp9nbjzN8g',
        ];

        await driver.get('https://www.decora.ee/');
        const elems = await driver.findElements(By.css('.social-media-button > a'));

        for (const href of elems) {
            const link = await href.getAttribute('href');
            expect(link).to.be.oneOf(expectedLinks);
        }
    });


});

after(async () => driver.quit());