import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # Desktop viewport matching the user's viewport
        context = await browser.new_context(viewport={'width': 1920, 'height': 864})
        page = await context.new_page()
        
        await page.goto("http://localhost:3000")
        await page.wait_for_timeout(3000)
        
        # Take desktop screenshot
        await page.screenshot(path="/Volumes/deep-1t/Users/k3ss/.gemini/antigravity-ide/brain/6bd7c563-b977-4801-a02f-52d20869a6ef/.tempmediaStorage/desktop_view.png")
        print("Successfully took desktop screenshot.")
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
