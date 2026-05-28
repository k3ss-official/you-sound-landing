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
        
        opacity = await page.eval_on_selector("div.relative.mt-auto", "el => window.getComputedStyle(el).opacity")
        display = await page.eval_on_selector("div.relative.mt-auto", "el => window.getComputedStyle(el).display")
        visibility = await page.eval_on_selector("div.relative.mt-auto", "el => window.getComputedStyle(el).visibility")
        background = await page.eval_on_selector("div.relative.mt-auto", "el => window.getComputedStyle(el).backgroundColor")
        box = await page.eval_on_selector("div.relative.mt-auto", "el => JSON.stringify(el.getBoundingClientRect())")
        
        print(f"Form Container Opacity: {opacity}")
        print(f"Form Container Display: {display}")
        print(f"Form Container Visibility: {visibility}")
        print(f"Form Container Background: {background}")
        print(f"Form Bounding Box: {box}")
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
