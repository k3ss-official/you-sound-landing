import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        iphone = p.devices['iPhone 14 Pro']
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(**iphone)
        page = await context.new_page()
        
        await page.goto("http://localhost:3000")
        await page.wait_for_timeout(3000)
        
        # Take normal screenshot
        await page.screenshot(path="/Volumes/deep-1t/Users/k3ss/.gemini/antigravity-ide/brain/6bd7c563-b977-4801-a02f-52d20869a6ef/.tempmediaStorage/normal_mobile.png")
        
        # Take full page screenshot
        await page.screenshot(path="/Volumes/deep-1t/Users/k3ss/.gemini/antigravity-ide/brain/6bd7c563-b977-4801-a02f-52d20869a6ef/.tempmediaStorage/full_mobile.png", full_page=True)
        
        # Take element screenshot
        elem = await page.query_selector("div.relative.mt-auto")
        if elem:
            await elem.screenshot(path="/Volumes/deep-1t/Users/k3ss/.gemini/antigravity-ide/brain/6bd7c563-b977-4801-a02f-52d20869a6ef/.tempmediaStorage/form_element.png")
            print("Successfully took element screenshot of form.")
        else:
            print("Form element NOT found for screenshot.")
            
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
