import { test, expect, request } from "@playwright/test";
import { extractText, getDocumentProxy } from 'unpdf';

let TOKEN: string;
let ORDER_NUMBER: number;
// let BEGIN_STOCK: number;
// let BUY_QTY: number;

test("การสั่งซื้อสินค้า โดยที่มีการจัดส่งแบบ Thai Post และชำระเงินด้วยบัตรเครดิต Visa สำเร็จ", async ({ request }) => {
	await test.step("เข้าสู่ระบบด้วย Username และ Password", async () => {
		const responseLogin = await request.post("api/v1/login",{
			data: {
				"username": "user_4",
				"password": "P@ssw0rd",
			}
		});
		await expect(responseLogin).toBeOK();
		expect(responseLogin.status()).toBe(200);
		const responseBody = await responseLogin.json();
		TOKEN = responseBody.access_token;
	});

	await test.step("ค้นหาสินค้า Balance Trainning Bicycle", async () => {
		const responseSearchProduct = await request.get("api/v1/product?q=Bicycle&offset=0&limit=20",{
			headers: {
				"Authorization": `Bearer ${TOKEN}`,
        		"Content-Type": "application/json",
			}
		});
		await expect(responseSearchProduct).toBeOK();
		expect(responseSearchProduct.status()).toBe(200);
		const responseBody = await responseSearchProduct.json();
		expect((responseBody).products[0].product_name).toBe("Balance Training Bicycle");
		expect((responseBody).products[0].product_price_thb).toBe(4314.6);
	});

	await test.step("ตรวจสอบรายละเอียดของสินค้า", async () => {
		const responseProduct = await request.get("api/v1/product/1", {
			headers: {
				"Authorization": `Bearer ${TOKEN}`,
        		"Content-Type": "application/json",
			}
		});
		await expect(responseProduct).toBeOK();
		expect(responseProduct.status()).toBe(200);
		const responseBody = await responseProduct.json();
		expect(responseBody).toMatchObject({
      		"id": 1,
      		"product_name": "Balance Training Bicycle",
      		"product_price": 119.95,
      		"product_price_thb": 4314.6,
      		"product_price_full_thb": 4314.597182,
      		"product_image": "/Balance_Training_Bicycle.png"
		});
	});

	await test.step("ตรวจสอบตะกร้าสินค้าก่อนสั่งซื้อสินค้า", async () => {
		const responseCart = await request.get("api/v1/cart", {
				headers: {
				"Authorization": `Bearer ${TOKEN}`,
        		"Content-Type": "application/json",
			}
		});
		await expect(responseCart).toBeOK();
		expect(responseCart.status()).toBe(200);
		const responseBody = await responseCart.json();
		expect(responseBody).toMatchObject({
			"carts": [],
    		"summary": {
        	"total_price": 0,
        	"total_price_thb": 0,
        	"total_price_full_thb": 0,
        	"receive_point": 0
		 }
		});
	});
	
	await test.step("สั่งซื้อสินค้าที่ต้องการใส่ในตะกร้า", async () => {
		const responseAddToCart = await request.put("api/v1/addCart", {
				headers: {
					"Authorization": `Bearer ${TOKEN}`,
        			"Content-Type": "application/json",
				},
				data: {
   					"product_id": 1,
   					"quantity": 1
				},
			}
		);
		await expect(responseAddToCart).toBeOK();
		expect(responseAddToCart.status()).toBe(200);
	});

	await test.step("ตรวจสอบสินค้าในตะกร้า", async () => {
		const responseAddedCart = await request.get("api/v1/cart", {
				headers: {
				"Authorization": `Bearer ${TOKEN}`,
        		"Content-Type": "application/json",
			}
		});
		await expect(responseAddedCart).toBeOK();
		const responseBody = await responseAddedCart.json();
		// BEGIN_STOCK = responseBody.carts.stock;
		expect(responseBody).toMatchObject({
    		"carts": [
        		{
            		"product_id": 1,
            		"quantity": 1,
            		"product_name": "Balance Training Bicycle",
            		"product_price": 119.95,
            		"product_price_thb": 4314.6,
            		"product_price_full_thb": 4314.597182,
            		"product_image": "/Balance_Training_Bicycle.png",
            		// "stock": BEGIN_STOCK,
            		"product_brand": "SportsFun"
        		}
    		],
    		"summary": {
        			"total_price": 119.95,
        			"total_price_thb": 4314.6,
        			"total_price_full_thb": 4314.597182,
        			"receive_point": 43
    			}
			});
	});

	await test.step("ส่งคำสั่งซื้อสินค้า และส่งข้อมูลที่อยู่จัดส่ง", async () => {
		const responseSentOrder = await request.post("api/v1/order",{
				headers: {
					"Authorization": `Bearer ${TOKEN}`,
        			"Content-Type": "application/json",
				},
				data: {
					"cart": [
    			{
      				"product_id": 1,
      				"quantity": 1
    			}
  				],
  				"burn_point": 0,
  				"sub_total_price": 4314.6,
  				"discount_price": 0,
  				"total_price": 4364.6,
  				"shipping_method_id": 1,
  				"shipping_address": "189/413 หมู่ 2",
  				"shipping_sub_district": "แพรกษาใหม่",
  				"shipping_district": "เมืองสมุทรปราการ",
  				"shipping_province": "สมุทรปราการ",
  				"shipping_zip_code": "10280",
  				"recipient_first_name": "พงศกร",
  				"recipient_last_name": "รุ่งเรืองทรัพย์",
  				"recipient_phone_number": "090912799",
  				"payment_method_id": 1,
  				"payment_information": {
    				"card_name": "พงศกร รุ่งเรืองทรัพย์",
    				"card_number": "4719 7005 9159 0995",
    				"expire_date": "02/26",
    			"cvv": "75"
  }
				}
		});
		await expect(responseSentOrder).toBeOK();
		expect(responseSentOrder.status()).toBe(200);
		const responseBody = await responseSentOrder.json();
		ORDER_NUMBER = responseBody.order_number;
		// BUY_QTY = responseBody.cart.quantity;
	});

	await test.step("ยืนยันคำสั่งซื้อสินค้า", async () => {
		const responseConfirmOrder = await request.post("api/v1/confirmPayment",{
					headers: {
					"Authorization": `Bearer ${TOKEN}`,
        			"Content-Type": "application/json",
				},
				data: {
  					"order_number": ORDER_NUMBER,
  					"otp": 124532,
  					"ref_otp": "AXYZ"
				}
		});
		await expect(responseConfirmOrder).toBeOK();
		expect(responseConfirmOrder.status()).toBe(200);
		const responseBody = await responseConfirmOrder.json();
		expect(responseBody).toMatchObject({
			"order_number": ORDER_NUMBER,
			"shipping_method_id": 1,
		});
	});

	await test.step("ตรวจสอบ Order Summary Detail", async () => {
		const responseSummaryDetail = await request.post(`api/v1/order/${ORDER_NUMBER}/summary`, {
			headers: {
				"Authorization": `Bearer ${TOKEN}`,
				"Accept": "application/json",
		}
		});
		await expect(responseSummaryDetail).toBeOK();
		expect(responseSummaryDetail.status()).toBe(200);
		const responseBody = await responseSummaryDetail.json();
		expect(responseBody.order_number).toBe(ORDER_NUMBER);
	});

	await test.step("ตรวจสอบข้อมูลคำสั่งซื้อใน PDF File", async () => {
		const responsePDF = await request.post(`api/v1/order/${ORDER_NUMBER}/summary`, {
			headers: {
					"Authorization": `Bearer ${TOKEN}`,
        			"Content-Type": "application/json",
					"Accept": "application/pdf",
				},
		});
		await expect (responsePDF).toBeOK();
		expect(responsePDF.status()).toBe(200);
		const pdfBuffer = await responsePDF.body();
		const pdf = await getDocumentProxy(new Uint8Array(pdfBuffer));
		const { text } = await extractText(pdf, { mergePages: true });
		console.log(text);
		expect(text).toContain(`${ORDER_NUMBER}`);
	});
});

// test.afterAll("ลบสินค้าออกจากตะกร้า", async ({ request }) => {
// 	const responseDelete = await request.put("api/v1/updateCart",{
// 			headers: {
// 				"Authorization": `Bearer ${TOKEN}`,
//         		"Content-Type": "application/json",
// 			},
// 			data: {
//    				"product_id": 1,
//    				"quantity": 0
// 			},
// 	});
// 	await expect(responseDelete).toBeOK();
// 	expect(responseDelete.status()).toBe(200);
// 	});