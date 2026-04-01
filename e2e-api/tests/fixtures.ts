import { test as base, APIRequestContext } from '@playwright/test';

type MyFixtures = {
	authedRequest: APIRequestContext;
	authedToken: string;
};

export const test = base.extend<MyFixtures>({

	authedToken: async ({ request }, use) => {
		const tokenResponse = await request.post("http://139.59.225.96/api/v1/login", {
			data: {
				"username": "user_4",
				"password": "P@ssw0rd",
			}
		});
		const responseBody = await tokenResponse.json();
		const { token } = responseBody.access_token;
		await use(token);
	},

	authedRequest: async ({ playwright, authedToken }, use) => {
    const context = await playwright.request.newContext({
      baseURL: "http://139.59.225.96/",
      extraHTTPHeaders: {
        'Authorization': `Bearer ${authedToken}`,
        'Accept': 'application/json',
      },
    });
	await use(context);
	// await context.dispose();
},
});

export { expect } from '@playwright/test';