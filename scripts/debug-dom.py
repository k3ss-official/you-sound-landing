import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        iphone = p.devices['iPhone 14 Pro']
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(**iphone)
        page = await context.new_page()
        
        # Attach console and request listeners
        page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))
        page.on("pageerror", lambda err: print(f"PAGE ERROR: {err.message}"))
        
        def handle_response(response):
            if response.status >= 400:
                print(f"NET ERROR: {response.status} {response.url}")
        page.on("response", handle_response)
        
        await page.goto("http://localhost:3000")
        await page.wait_for_timeout(3000)
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
