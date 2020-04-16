const { Builder, By, Key, until } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');
const { expect, assert } = require('chai');

// Arrow functions are discouraged due to the way "this" gets passed

let driver = null;
let actions = null;

const website = 'https://www.decora.ee/';

describe('basic tests', async function () {
    beforeEach('Initiate new driver', async () => {
        driver = await new Builder()
            .forBrowser('chrome')
            // .setChromeOptions(new Options().headless())
            .build();
        actions = driver.actions();
        await driver.get(website);
    });
    
    afterEach('Kill driver', async () => {
        await driver.quit();
    });

    it('assert the title', async function () {
 
        const title = await driver.getTitle();

        expect(title).to.equal('Decora | Tavalisest parem ehituspood! | Ostle mugavalt e-poes decora.ee');
    });

    it('should verify links to social media sites', async function () {
        const expectedLinks = [
            'https://www.facebook.com/decora24/',
            'https://www.instagram.com/decora_reklaamiosakond/',
            'https://www.youtube.com/channel/UCVxJu_qU76PJKBp9nbjzN8g',
        ];

        const elems = await driver.findElements(By.css('.social-media-button > a'));

        for (const href of elems) {
            const link = await href.getAttribute('href');
            expect(link).to.be.oneOf(expectedLinks);
        }
    });

    it('should search for "tapeet", add first three results to cart and check if modal cart contains 3 elements, increase and decrease item count, ending with 2 items in card', async () => {
        
        await driver.findElement(By.id('search')).sendKeys('tapeet', Key.ENTER);
        await driver.wait(until.elementsLocated(By.className('product-item-link')));

        const addToCarts = await driver.findElements(By.css('form > .action.tocart.primary'));

        expect(addToCarts, 'Find more than 2 results').to.have.lengthOf.greaterThan(2);
            
        // We click 'add to cart' on the first three results
        for (let i = 0; i < 3; i++) {
            await actions.clear();
            await actions.click(addToCarts[i]).perform();
            await driver.sleep(8000);
        }
        

        // Wait 3 seconds because that site is slow
        // TODO: replace this with checking cart total
        await driver.sleep(8000);

        // Cart button is a class for some reason
        const showCart = await driver.findElements(By.css('.action.showcart'));

        await actions.click(showCart[0]).perform();
        
        const cartItems = await driver.findElements(By.css('.product-item-details > .product-item-name > a[data-bind]'));
        
        // Since we added three items, it should have three items
        expect(cartItems, 'There are exactly 3 items in the cart').to.have.lengthOf(3);

        async function getCartElements() {
            const plusButtons = await driver.findElements(By.css('.update-cart-item-plus'));
            const minusButtons = await driver.findElements(By.css('.update-cart-item-minus'));
            const quantityValues = await driver.findElements(By.css('.item-qty.cart-item-qty'));
            return [plusButtons, minusButtons, quantityValues];
        }

        let [plusButtons, minusButtons, quantityValues] = [...await getCartElements()];

        for (const value of [plusButtons, minusButtons, quantityValues]) {
            expect(value).to.have.lengthOf.greaterThan(2);
        }

        const originalQty = await quantityValues[0].getAttribute('data-item-qty');

        // for (let i = 0; i < 3; i++) {
        await actions.clear();
        await actions.click(plusButtons[0]).perform();
        await driver.sleep(8000);
        // }
        [plusButtons, minusButtons, quantityValues] = [...await getCartElements()];

        const newQty = await quantityValues[0].getAttribute('data-item-qty');

        expect(Number(originalQty) + 1, 'Second item quantity in cart is 3 more than before').to.equal(Number(newQty));

        await actions.clear();
        await actions.click(minusButtons[2]).perform();
        await driver.sleep(10000);

        const newQuantityValues = await driver.findElements(By.css('.item-qty.cart-item-qty'));
        assert.strictEqual(newQuantityValues.length, quantityValues.length - 1, 'Cart should now have 1 item fewer');
    });

    it('should search for "vaip", add first three results to cart and check if modal cart contains 3 elements, increase and decrease item count, ending with 2 items in card', async () => {
        await driver.findElement(By.id('search')).sendKeys('vaip', Key.ENTER);
        await driver.wait(until.elementsLocated(By.className('product-item-link')));

        const addToCarts = await driver.findElements(By.css('form > .action.tocart.primary'));

        expect(addToCarts, 'Find more than 2 results').to.have.lengthOf.greaterThan(2);
            
        // We click 'add to cart' on the first three results
        for (let i = 0; i < 3; i++) {
            await actions.clear();
            await actions.click(addToCarts[i]).perform();
            await driver.sleep(8000);
        }
        

        // Wait 3 seconds because that site is slow
        // TODO: replace this with checking cart total
        await driver.sleep(8000);

        // Cart button is a class for some reason
        const showCart = await driver.findElements(By.css('.action.showcart'));

        await actions.click(showCart[0]).perform();
        
        const cartItems = await driver.findElements(By.css('.product-item-details > .product-item-name > a[data-bind]'));
        
        // Since we added three items, it should have three items
        expect(cartItems, 'There are exactly 3 items in the cart').to.have.lengthOf(3);

        async function getCartElements() {
            const plusButtons = await driver.findElements(By.css('.update-cart-item-plus'));
            const minusButtons = await driver.findElements(By.css('.update-cart-item-minus'));
            const quantityValues = await driver.findElements(By.css('.item-qty.cart-item-qty'));
            return [plusButtons, minusButtons, quantityValues];
        }

        let [plusButtons, minusButtons, quantityValues] = [...await getCartElements()];

        for (const value of [plusButtons, minusButtons, quantityValues]) {
            expect(value).to.have.lengthOf.greaterThan(2);
        }

        const originalQty = await quantityValues[0].getAttribute('data-item-qty');

        // for (let i = 0; i < 3; i++) {
        await actions.clear();
        await actions.click(plusButtons[0]).perform();
        await driver.sleep(8000);
        // }
        [plusButtons, minusButtons, quantityValues] = [...await getCartElements()];

        const newQty = await quantityValues[0].getAttribute('data-item-qty');

        expect(Number(originalQty) + 1, 'Second item quantity in cart is 3 more than before').to.equal(Number(newQty));

        await actions.clear();
        await actions.click(minusButtons[2]).perform();
        await driver.sleep(10000);

        const newQuantityValues = await driver.findElements(By.css('.item-qty.cart-item-qty'));
        assert.strictEqual(newQuantityValues.length, quantityValues.length - 1, 'Cart should now have 1 item fewer');
    
    });
});