import { test, expect, request } from '@playwright/test';

test("ค้นหาและซื้อสินค้า เลือกวิธีจัดส่งเป็น Thai Post และชำระเงินด้วยบัตรเครดิต Visa สำเร็จ", async ({ request }) => {
	
	await test.step("ดำเนินการเข้าสู่ระบบด้วย Username และ Password", async () => {
		const reponseLogin = await request.post('http://139.59.225.96/api/v1/login', {
			data : {
				"username" : "user_4",
				"password" : "P@ssw0rd"
			}
		})
		expect(reponseLogin.ok()).toBeTruthy();
		expect((await reponseLogin.json()).access_token).toBeTruthy();
	});

	await test.step("ค้นหาสินค้า Bicycle", async () => {

	});

});
