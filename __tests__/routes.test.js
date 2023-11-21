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
						description: expect.any(String),
						slug: expect.any(String),
					});
				});
			});
	});
});

describe("GET: /api/articles/:article_id", () => {
	test("200: successfully responds with a JSON of a single article with the same article_id as the route parameter", () => {
		return request(app)
			.get("/api/articles/3")
			.expect(200)
			.expect("Content-Type", /json/)
			.then(({ body: { article } }) => {
				expect(article).toMatchObject({
					article_id: 3,
					title: "Eight pug gifs that remind me of mitch",
					topic: "mitch",
					author: "icellusedkars",
					body: "some gifs",
					created_at: "2020-11-03T09:12:00.000Z",
					votes: 0,
					article_img_url:
						"https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
				});
			});
	});

	test("404: responds with 404 article not found if there is no article with the requested article_id", () => {
		return request(app)
			.get("/api/articles/5000")
			.expect(404)
			.then(({ body }) => {
				expect(body.status).toBe(404);
				expect(body.msg).toBe("No article found with the id: 5000");
			});
	});

	test("400: responds with bad request if the requested article_id is not the same datatype as database article_id (integer)", () => {
		return request(app)
			.get("/api/articles/robots")
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad Request!");
			});
	});
});

describe("GET: /api/articles/:article_id/comments", () => {
	test("200: succesfully responds with an array of all comments that reference specified article (:article_id) ordered by most recent comments first", () => {
		return request(app)
			.get("/api/articles/5/comments")
			.expect(200)
			.expect("Content-Type", /json/)
			.then(({ body: { comments } }) => {
				expect(comments.length).toBe(2);

				comments.forEach((comment) => {
					expect(comment).toMatchObject({
						comment_id: expect.any(Number),
						author: expect.any(String),
						created_at: expect.any(String),
						body: expect.any(String),
						votes: expect.any(Number),
						article_id: expect.any(Number),
					});
				});

				expect(comments).toBeSortedBy("created_at", { descending: true });
			});
	});

	test("200: succesfully responds with an empty array if there are no comments but article exists", () => {
		return request(app)
			.get("/api/articles/7/comments")
			.expect(200)
			.expect("Content-Type", /json/)
			.then(({ body: { comments } }) => {
				expect(comments).toEqual([]);
			});
	});

	test("404: responds with a custom error 404 not found if there is no article with the requested article_id", () => {
		return request(app)
			.get("/api/articles/1000/comments")
			.expect(404)
			.then(({ body }) => {
				expect(body.status).toBe(404);
				expect(body.msg).toBe("No article found with the id: 1000");
			});
	});

	test("400: responds with bad request if the requested article_id is not of datatype integer", () => {
		return request(app)
			.get("/api/articles/agents/comments")
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad Request!");
			});
	});
});

describe("GET: /api/articles", () => {
	test("200: successfully responds with an array of article objects without the body property and ordered by created_at date", () => {
		return request(app)
			.get("/api/articles")
			.expect(200)
			.expect("Content-Type", /json/)
			.then(({ body: { articles } }) => {
				expect(articles.length).toBe(13);

				articles.forEach((article) => {
					expect(article).toMatchObject({
						article_id: expect.any(Number),
						title: expect.any(String),
						author: expect.any(String),
						topic: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
						article_img_url: expect.any(String),
						comment_count: expect.any(Number),
					});

					expect(article.body).toBe(undefined);
				});

				expect(articles).toBeSortedBy("created_at", { descending: true });
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
