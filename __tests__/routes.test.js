const request = require("supertest");
const app = require("../app");

const db = require("../db/connection");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET: /api/topics", () => {
	test("200: sucessfully responds with an array of topic objects", () => {
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
