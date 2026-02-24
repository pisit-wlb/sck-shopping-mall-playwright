import { test, expect } from '@playwright/test';

test("การสั่งซื้อสินค้า โดยที่มีการจัดส่งแบบ Thai Post และชำระเงินด้วยบัตรเครดิต Visa สำเร็จ", async ({ page }) => {
	await test.step("เข้าหน้า Website", async () => {
		await page.goto("http://139.59.225.96/auth/login");
	});

	await test.step("ขั้นตอนการ Login", async () => {
		await page.locator("[id='login-username-input']").fill("user_4");
		await page.locator("[id='login-password-input']").fill("P@ssw0rd");
		await page.locator("[id='login-btn']").click();
	});

	await test.step("ทดสอบการค้นหาโดยการกรอก Bicycle", async () => {
		await page.locator("[id='search-product-input']").fill("Bicycle");
		await page.locator("[id='search-product-input']").press("Enter");
		await expect(page.locator("[id='product-card-name-1']")).toHaveText("Balance Training Bicycle");
		await expect(page.locator("[id='product-card-price-1']")).toHaveText("฿4,314.60");
		await page.locator("[id='product-card-name-1']").click();
	});

	await test.step("ตรวจสอบข้อมูลสินค้า", async () => {
		await expect(page.locator("[id='product-detail-product-name']")).toHaveText("Balance Training Bicycle");
		await expect(page.locator("[id='product-detail-price-thb']")).toHaveText("฿4,314.60");
		await expect(page.locator("[id='product-detail-point']")).toHaveText("43 Points");

	});
	await test.step("เลือกจำนวนสินค้า และกด Add to Cart", async () => {
		await page.locator("[id='product-detail-quantity-increment-btn']").click({ clickCount : 2});
		await page.locator("[id='product-detail-add-to-cart-btn']").click();
		await expect(page.locator("[id='header-menu-cart-badge']")).toHaveText("1");

	});

	await test.step("ตรวจสอบข้อมูลการสั่งซื้อในตะกร้าสินค้า", async () =>{
		await page.locator("[id='header-menu-cart-btn']").click();
		await expect(page.locator("[id='product-1-name']")).toHaveText("Balance Training Bicycle");
		await expect(page.locator("[id='product-1-price']")).toHaveText("฿12,943.80");
		await expect(page.locator("[id='product-1-point']")).toHaveText("129 Points");
		await expect(page.locator("[id='shopping-cart-subtotal-price']")).toHaveText("฿12,943.79");
	});

	await test.step("ตรวจสอบข้อมูลการของ Orders ในหน้า Summary", async () => {
		await page.locator("[id='shopping-cart-checkout-btn']").click();
		await expect(page.locator("[id='product-1-name']")).toHaveText("Balance Training Bicycle");
		await expect(page.locator("[id='product-1-price']")).toHaveText("฿12,943.80");
		await expect(page.locator("[id='product-1-point']")).toHaveText("129 Points");

	});

	await test.step("กรอกข้อมูลชื่อ-นามสกุล, ที่อยู่ และเลือกวิธีการจัดส่ง", async () => {
		await page.locator("[id='shipping-form-first-name-input']").fill("Pisit");
		await page.locator("[id='shipping-form-last-name-input']").fill("Wanakitrungrueng");
		await page.locator("[id='shipping-form-address-input']").fill("99/49 หมู่บ้าน ดลลชา ซอย สุขสวัสดิ์ 70");
		await page.locator("[id='shipping-form-province-select']").selectOption("กรุงเทพมหานคร");
		await page.locator("[id='shipping-form-district-select']").selectOption("เขตทุ่งครุ");
		await page.locator("[id='shipping-form-sub-district-select']").selectOption("ทุ่งครุ");
		await expect(page.locator("[id='shipping-form-zipcode-input']")).toHaveAttribute("value", "10140");
		await page.locator("label[for='shipping-method-2-input']").click();
		});

	await test.step("กรอกข้อมูลบัตรเครดิต และประเภทบัตรเครดิต", async () => {
		await page.locator("[id='payment-credit-form-fullname-input']").fill("Pisit Wanakitrungrueng");
		await page.locator("[id='payment-credit-form-card-number-input']").fill("12345678910111213");
		await page.locator("[id='payment-credit-form-expiry-input']").fill("0528");
		await page.locator("[id='payment-credit-form-cvv-input']").fill("589");
	});
	
	await test.step("ตรวจสอบข้อมูลของ Orders ในส่วนของ Summary", async () => {
		await expect(page.locator("[id='order-summary-subtotal-price']")).toHaveText("฿12,943.79");
		await expect(page.locator("[id='order-summary-receive-point-price']")).toHaveText("129 Points");
		await expect(page.locator("[id='order-summary-total-payment-price']")).toHaveText("฿12,993.79");
	});

	await test.step("กรอก OTP และกรอกข้อมูลเพื่อยืนยันออเดอร์", async () => {
		await page.locator("[id='payment-now-btn']").click();
		await page.locator("[id='otp-input']").fill("256789");
		await page.getByRole('button', { name: 'OK' }).click();
		await page.locator("[id='notification-form-email-input']").fill("pisit@welovebug.com");
		await page.locator("[id='notification-form-mobile-input']").fill("0626752828");
		await page.locator("[id='send-notification-btn']").click();
	});

});