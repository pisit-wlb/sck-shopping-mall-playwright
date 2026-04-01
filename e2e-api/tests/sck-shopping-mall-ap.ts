import { test, expect, request } from '@playwright/test';

let token: any;

test("การสั่งซื้อสินค้า โดยที่มีการจัดส่งแบบ Thai Post และชำระเงินด้วยบัตรเครดิต Visa สำเร็จ", async ( { request } ) => {

	const responseLogin = await request.post("http://139.59.225.96/api/v1/login", {
		data: {
			"username" : "user_4",
			"password" : "P@ssw0rd"
		}
	});
	expect(responseLogin.ok()).toBeTruthy();
	expect((await responseLogin.json()).access_token).toBeTruthy();
	const accessToken = (await responseLogin.json()).access_token;

	const responseSearchProduct = await request.get("http://139.59.225.96/api/v1/product?q=Bicycle&offset=0&limit=20", {
		headers: {
		"Authorization" : "Bearer " + accessToken,
		}
	});
	expect(responseSearchProduct.ok()).toBeTruthy();
	expect((await responseSearchProduct.json()).products[0].product_name).toBe("Balance Training Bicycle");
	expect((await responseSearchProduct.json()).products[0].product_price_thb).toBe(4314.6);

	const responseDetail = await request.get("http://139.59.225.96/api/v1/product/1", {
		headers: {
			"Authorization" : "Bearer " + accessToken,
		}
	});
	expect(responseDetail.ok()).toBeTruthy();
	expect((await responseDetail.json()).product_name).toBe("Balance Training Bicycle");
	expect((await responseDetail.json()).product_price_thb).toBe(4314.6);

	const responseAddtocart = await request.put("http://139.59.225.96/api/v1/addCart", {
		data: {
			"product_id" : 1,
			"quantity" : 3
		}
	});
	expect(responseAddtocart.ok()).toBeTruthy();
	const responseCartdetail = await request.get("http://139.59.225.96/api/v1/cart",{
		headers: {
			"Authorization" : "Bearer " + accessToken,
		}
	});
	expect(responseCartdetail.ok()).toBeTruthy();
	expect((await responseCartdetail.json()).carts.product_name).toBe("Balance Training Bicycle");
	expect((await responseCartdetail.json()).carts.product_price_thb).toBe(4314.6);
});