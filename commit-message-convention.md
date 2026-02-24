# Commit Message Convention for Software Tester Test Automation (Playwright)

> **Version:** 1.0  
> **Last Updated:** 2026-02-23  
> **Applies to:** Software Tester Team Develop Test Source Code with Playwright

---

## 1. Purpose

เอกสารนี้กำหนดข้อตกลงการเขียน Commit Message สำหรับทีม Software Tester ที่พัฒนา Test Source Code ด้วย Playwright เพื่อให้ทีมสามารถ:

- เข้าใจ History ของ Test Source Code ได้อย่างรวดเร็ว
- แยกแยะสาเหตุของการเปลี่ยนแปลง (test bug vs. application change vs. improvement)
- ใช้ข้อมูลจาก Commit History ในการ Report Metrics ให้ลูกค้าได้

---

## 2. Commit Message Format

```
[Tag]: <สรุปสิ่งที่ทำ + ไฟล์ที่เกี่ยวข้อง + รายละเอียด>
```

### กฎทั่วไป

- เขียนเป็น **บรรทัดเดียว** ขึ้นต้นด้วย `[Tag]` เสมอ
- ระบุ **ชื่อไฟล์ + path** ไว้ใน message
- ระบุ **รายละเอียด** ว่าแก้ไขอะไรและทำไม
- เขียน commit message เป็นภาษาไทยหรืออังกฤษก็ได้ แต่ **technical terms ให้ใช้ภาษาอังกฤษ**

---

## 3. Tags Reference

| Tag | ใช้เมื่อ | Root Cause |
|-----|---------|------------|
| `[Created]` | สร้าง test file ใหม่ | — |
| `[Added]` | เพิ่ม test function, helper function, utility เข้าไฟล์ที่มีอยู่แล้ว | — |
| `[Edited]` | Refactor หรือ improve code quality โดย test behavior ไม่เปลี่ยน | Test Code |
| `[Fixed]` | แก้ test ที่ fail เพราะ bug ใน test code เอง | Test Code |
| `[Updated]` | ปรับ test เพราะ application เปลี่ยน (UI, flow, API) | Application |
| `[Deleted]` | ลบไฟล์ออก พร้อมระบุเหตุผล | — |
| `[Config]` | แก้ไข configuration, environment, test data, fixtures | — |

### การแยกความแตกต่างระหว่าง `[Edited]`, `[Fixed]`, และ `[Updated]`

ทั้งสาม tags นี้เกี่ยวกับการแก้ไข code ที่มีอยู่แล้ว แต่ **สาเหตุต่างกัน**:

- **`[Edited]`** — Refactor / improve code quality โดย behavior ไม่เปลี่ยน เช่น rename variable, extract function, improve readability
- **`[Fixed]`** — Test code มี bug ต้องแก้ให้ถูก เช่น flaky test, wrong assertion, stale locator ที่เกิดจาก test เขียนผิด
- **`[Updated]`** — Application Under Test (AUT) เปลี่ยน ทำให้ test ต้องปรับตาม เช่น UI change, flow change, API contract change

> **สำคัญ:** การแยก `[Fixed]` กับ `[Updated]` ทำให้ track ได้ว่า commit เกิดจาก test quality issue หรือ application change ซึ่งมีประโยชน์ในการ report metrics เช่น test maintenance effort ที่เกิดจาก application change vs. test code defect

---

## 4. Examples

### `[Created]` — สร้าง test file ใหม่

```
[Created]: สร้าง E2E test สำหรับ Login flow ใน tests/auth/login.spec.ts ครอบคลุม valid login, invalid password, locked account
```

### `[Added]` — เพิ่ม function เข้าไฟล์เดิม

```
[Added]: เพิ่ม loginAs(role) helper function ใน tests/helpers/auth.helper.ts รองรับ admin, user, viewer
```

```
[Added]: เพิ่ม test case กรณี special characters และ empty result ใน tests/search/product-search.spec.ts
```

### `[Edited]` — Refactor โดย behavior ไม่เปลี่ยน

```
[Edited]: Refactor login test ใช้ Page Object Model แยก locator และ action ไปไว้ใน pages/login.page.ts เพื่อลด duplication
```

### `[Fixed]` — แก้ bug ใน test code

```
[Fixed]: แก้ flaky test ใน tests/dashboard/overview.spec.ts

เปลี่ยนจาก waitForTimeout(3000) เป็น waitForSelector('.dashboard-loaded')
```

```
[Fixed]: แก้ assertion ผิดใน tests/orders/order-summary.spec.ts เดิมเทียบ total ก่อน VAT แต่ expected value เป็นราคารวม VAT แล้ว
```

### `[Updated]` — ปรับตาม application change

```
[Updated]: ปรับ locator ปุ่ม Submit ใน tests/orders/create-order.spec.ts จาก header >> button.submit เป็น footer >> button.submit ตาม UI change
```

```
[Updated]: ปรับ tests/api/user-api.spec.ts ตาม API v2 migration เปลี่ยน endpoint จาก /api/v1/users เป็น /api/v2/users และปรับ response schema assertion
```

### `[Deleted]` — ลบไฟล์

```
[Deleted]: ลบไฟล์ 'tests/legacy/old-checkout.spec.ts' เนื่องจาก legacy checkout flow ถูก decommission แล้ว ย้าย test ที่ยังใช้ได้ไป tests/checkout/checkout.spec.ts เรียบร้อย
```

### `[Config]` — แก้ไข configuration

```
[Config]: เพิ่ม BASE_URL และ API_KEY สำหรับ staging environment ใน .env.staging และ playwright.config.ts
```

```
[Config]: อัปเดต test data ใน tests/data/products.json เพิ่ม product data ใหม่ 5 รายการตาม requirement ของ Sprint 12
```

---

## 5. Commit Guidelines

> **หลักการ:** หนึ่ง commit ควรมี tag เดียวเท่านั้น หากต้องใช้หลาย tag ให้แยกเป็นหลาย commits เช่น ถ้าทั้ง fix test และ เพิ่ม test ใหม่ ให้แยกเป็น `[Fixed]` commit หนึ่ง และ `[Added]` อีก commit หนึ่ง

---

## 6. Quick Reference Card

```
[Created]: สร้างไฟล์ใหม่สำหรับ... ใน <path>
[Added]:   เพิ่ม function/test ใน <path> ...
[Edited]:  Refactor/improve code ใน <path> ... (behavior ไม่เปลี่ยน)
[Fixed]:   แก้ bug ใน <path> ... (root cause = test)
[Updated]: ปรับ test ใน <path> ตาม app change... (root cause = AUT)
[Deleted]: ลบไฟล์ '<path>' เนื่องจาก...
[Config]:  แก้ไข config/env/test data ใน <path> ...
```

**ทุก commit ต้องระบุ:** ไฟล์ที่เกี่ยวข้อง + รายละเอียดว่าแก้อะไรและทำไม
