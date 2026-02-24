import { test, expect, request } from '@playwright/test';

test("การสั่งซื้อสินค้า โดยที่มีการจัดส่งแบบ Thai Post และชำระเงินด้วยบัตรเครดิต Visa สำเร็จ", async ( { request } ) => {

	test.step("ดำเนินการเข้าสู่ระบบด้วย Username และ Password", async () => {
		const responseLogin = await request.post("http://139.59.225.96/api/v1/login", {
			data: {
				"username" : "user_4",
				"password" : "P@ssw0rd"
			}
		});
		expect(responseLogin.ok()).toBeTruthy();
		expect((await responseLogin.json()).access_token).toBeTruthy();
	});

});