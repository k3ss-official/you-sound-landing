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
        
        # Get bounding boxes of elements
        elements = {
            "body": "body",
            "main": "main",
            "video": "video",
            "coming-soon": "div.absolute.top-0",
            "form-container": "div.relative.mt-auto",
            "input": "input[type='email']",
            "button": "button[type='submit']"
        }
        
        for name, selector in elements.items():
            elem = await page.query_selector(selector)
            if elem:
                box = await elem.bounding_box()
                is_visible = await elem.is_visible()
                print(f"ELEMENT {name} ({selector}): visible={is_visible}, box={box}")
            else:
                print(f"ELEMENT {name} ({selector}): NOT FOUND")
                
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
