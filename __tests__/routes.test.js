const request = require("supertest");
const app = require("../app");

const db = require("../db/connection");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET: /api", () => {
	test("200: successfully responds with JSON of all available endpoints along with their related information", () => {
		return request(app)
			.get("/api")
			.expect(200)
			.expect("Content-Type", /json/)
			.then(({ body }) => {
				const { endpoints } = body;

				Object.keys(endpoints).forEach((key) => {
					expect(endpoints[key]).toMatchObject({
						description: expect.any(String),
						queries: expect.any(Array),
						format: expect.any(Object),
						exampleResponse: expect.any(Object),
					});
				});
			});
	});
});

describe("GET: /api/topics", () => {
	test("200: successfully responds with an array of topic objects", () => {
		return request(app)
			.get("/api/topics")
			.expect(200)
			.expect("Content-Type", /json/)
			.then(({ body: { topics } }) => {
				expect(topics.length).toBe(3);

				topics.forEach((topic) => {
					expect(topic).toMatchObject({
						description: topic.description,
						slug: topic.slug,
					});

					expect(typeof topic.description).toBe("string");
					expect(typeof topic.slug).toBe("string");
				});
			});
	});
});

describe("404: Handle routes that don't exist", () => {
	test("GET requests", () => {
		return request(app)
			.get("/api/topicsss")
			.expect(404)
			.then(({ body }) => {
				expect(body.error).toBe("GET /api/topicsss route not found");
			});
	});

	test("POST requests", () => {
		return request(app)
			.post("/api/gandalf")
			.expect(404)
			.then(({ body }) => {
				expect(body.error).toBe("POST /api/gandalf route not found");
			});
	});

	test("PATCH requests", () => {
		return request(app)
			.patch("/lotr/frodo")
			.expect(404)
			.then(({ body }) => {
				expect(body.error).toBe("PATCH /lotr/frodo route not found");
			});
	});

	test("DELETE requests", () => {
		return request(app)
			.delete("/orcs")
			.expect(404)
			.then(({ body }) => {
				expect(body.error).toBe("DELETE /orcs route not found");
			});
	});
});
