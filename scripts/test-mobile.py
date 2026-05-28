import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        # Emulate iPhone 14 Pro
        iphone = p.devices['iPhone 14 Pro']
        browser = await p.chromium.launch(headless=True)
        
        # Create context with iPhone 14 Pro specs
        context = await browser.new_context(**iphone)
        page = await context.new_page()
        
        # Load local dev server
        url = "http://localhost:3000"
        print(f"Navigating to {url} on emulated iPhone 14 Pro...")
        await page.goto(url)
        
        # Wait for dynamic elements to settle
        await page.wait_for_timeout(3000)
        
        # Capture viewport screenshot
        screenshot_path = "/Volumes/deep-1t/Users/k3ss/.gemini/antigravity-ide/brain/6bd7c563-b977-4801-a02f-52d20869a6ef/iphone14_screenshot.png"
        await page.screenshot(path=screenshot_path)
        print(f"Viewport screenshot successfully saved to: {screenshot_path}")
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
