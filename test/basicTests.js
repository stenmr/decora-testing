const { Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');

// Arrow functions are discouraged due to the way "this" gets passed

const driver = new Builder().forBrowser('chrome').build();
const actions = driver.actions();

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

describe('social links', function () {

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

describe('shopping cart', function () {
    it('should search for "tapeet", take first result and add it to cart and check if cart contains one element', async () => {
        await driver.get('https://www.decora.ee/');
        await driver.findElement(By.id('search')).sendKeys('tapeet', Key.ENTER);
        await driver.wait(until.elementsLocated(By.className('product-item-link')));
        const addToCarts = await driver.findElements(By.css('form > .action.tocart.primary'));

        // We click on first result from search
        await actions.click(addToCarts[0]).perform();

        // Wait 8 seconds because that site is slow
        // TODO: replace this with checking cart total
        await driver.sleep(8000);

        // Cart button is a class for some reason
        const showCart = await driver.findElements(By.css('.action.showcart'));

        await actions.click(showCart[0]).perform();

        const cartItems = await driver.findElements(By.css('.product-item-details > .product-item-name > a[data-bind]'));

        // Since we added one item, it should have just one item
        expect(cartItems).to.have.lengthOf(1);
    });
});

after(async () => driver.quit());