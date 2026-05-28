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
        
        video_class = await page.eval_on_selector("video", "el => el.className")
        video_src = await page.eval_on_selector("video", "el => el.src")
        video_poster = await page.eval_on_selector("video", "el => el.poster")
        window_width = await page.evaluate("window.innerWidth")
        
        print(f"Window Inner Width: {window_width}")
        print(f"Video class: {video_class}")
        print(f"Video src: {video_src}")
        print(f"Video poster: {video_poster}")
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
