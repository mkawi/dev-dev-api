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

describe("GET: /api/users", () => {
	test("200: successfully responds with an array of user objects", () => {
		return request(app)
			.get("/api/users")
			.expect(200)
			.expect("Content-Type", /json/)
			.then(({ body: { users } }) => {
				expect(users.length).toBe(4);

				users.forEach((user) => {
					expect(user).toMatchObject({
						username: expect.any(String),
						name: expect.any(String),
						avatar_url: expect.any(String),
					});
				});
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

	test("400: responds with bad request if the requested article_id is not the same data type as database article_id (integer)", () => {
		return request(app)
			.get("/api/articles/robots")
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad Request!");
			});
	});
});

describe("PATCH: /api/articles/:article_id", () => {
	test("200: successfully responds with the updated article if the article has been modified correctly", () => {
		return request(app)
			.patch("/api/articles/3")
			.expect(200)
			.expect("Content-Type", /json/)
			.send({
				inc_votes: 50,
			})
			.then(({ body: { article } }) => {
				expect(article).toMatchObject({
					article_id: 3,
					title: "Eight pug gifs that remind me of mitch",
					topic: "mitch",
					author: "icellusedkars",
					body: "some gifs",
					created_at: "2020-11-03T09:12:00.000Z",
					votes: 50,
					article_img_url:
						"https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
				});
			});
	});

	test("200: successfully decrements an article's votes with an already existing positive value", () => {
		return request(app)
			.patch("/api/articles/1")
			.expect(200)
			.expect("Content-Type", /json/)
			.send({
				inc_votes: -25,
			})
			.then(({ body: { article } }) => {
				expect(article).toMatchObject({
					article_id: 1,
					title: "Living in the shadow of a great man",
					topic: "mitch",
					author: "butter_bridge",
					body: "I find this existence challenging",
					created_at: "2020-07-09T20:11:00.000Z",
					votes: 75,
					article_img_url:
						"https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
				});
			});
	});

	test("200: successfully decrements an article's votes to a negative value", () => {
		return request(app)
			.patch("/api/articles/1")
			.expect(200)
			.expect("Content-Type", /json/)
			.send({
				inc_votes: -250,
			})
			.then(({ body: { article } }) => {
				expect(article).toMatchObject({
					article_id: 1,
					title: "Living in the shadow of a great man",
					topic: "mitch",
					author: "butter_bridge",
					body: "I find this existence challenging",
					created_at: "2020-07-09T20:11:00.000Z",
					votes: -150,
					article_img_url:
						"https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
				});
			});
	});

	test("400: responds with bad request if data type is invalid", () => {
		return request(app)
			.patch("/api/articles/1")
			.expect(400)
			.send({ inc_votes: "example" })
			.then(({ body }) => {
				expect(body.msg).toBe("Bad Request!");
			});
	});

	test("400: responds with bad request if inc_votes property is missing", () => {
		return request(app)
			.patch("/api/articles/1")
			.expect(400)
			.send({ title: "example title" })
			.then(({ body }) => {
				expect(body.msg).toBe(
					"Invalid Request: Missing required properties in request body"
				);
			});
	});

	test("400: responds with bad request if article_id is invalid data type", () => {
		return request(app)
			.patch("/api/articles/banana")
			.expect(400)
			.send({ inc_votes: -25 })
			.then(({ body }) => {
				expect(body.msg).toBe("Bad Request!");
			});
	});

	test("404: responds with 404 article not found if there is no article with the requested article_id", () => {
		return request(app)
			.patch("/api/articles/1000")
			.expect(404)
			.send({
				inc_votes: -25,
			})
			.then(({ body }) => {
				expect(body.status).toBe(404);
				expect(body.msg).toBe("No article found with the id: 1000");
			});
	});
});

describe("GET: /api/articles/:article_id/comments", () => {
	test("200: successfully responds with an array of all comments that reference article (:article_id) ordered by recent comments", () => {
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

	test("200: successfully responds with an empty array if there are no comments but article exists", () => {
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

	test("400: responds with bad request if the requested article_id is not of data type integer", () => {
		return request(app)
			.get("/api/articles/agents/comments")
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad Request!");
			});
	});
});

describe("POST: /api/articles/:article_id/comments", () => {
	test("201: successfully adds a new comment to the specified article and returns it along with its primary and foreign keys", () => {
		return request(app)
			.post("/api/articles/5/comments")
			.expect(201)
			.expect("Content-Type", /json/)
			.send({
				username: "lurker",
				body: "have you tried turning it off and on again? :)",
			})
			.then(({ body: { comment } }) => {
				expect(comment).toMatchObject({
					comment_id: 19,
					author: "lurker",
					created_at: expect.any(String),
					body: "have you tried turning it off and on again? :)",
					votes: 0,
					article_id: 5,
				});
			});
	});

	test("201: successfully adds a new comment even if there are additional irrelevant properties in the request body", () => {
		return request(app)
			.post("/api/articles/5/comments")
			.expect(201)
			.expect("Content-Type", /json/)
			.send({
				username: "lurker",
				body: "have you tried turning it off and on again? :)",
				age: 99,
				address: "1 Mount Doom, Mordor, Middle Earth",
			})
			.then(({ body: { comment } }) => {
				expect(comment).toMatchObject({
					comment_id: 19,
					author: "lurker",
					created_at: expect.any(String),
					body: "have you tried turning it off and on again? :)",
					votes: 0,
					article_id: 5,
				});

				expect(comment.age).toBe(undefined);
				expect(comment.address).toBe(undefined);
			});
	});

	test("400: returns an error if there are any missing required properties in the request body", () => {
		return request(app)
			.post("/api/articles/5/comments")
			.expect(400)
			.send({
				body: "have you tried turning it off and on again? :)",
			})
			.then(({ body }) => {
				expect(body.msg).toBe(
					"Invalid Request: Missing required properties in request body"
				);
			});
	});

	test("400: returns an error if no request body is sent", () => {
		return request(app)
			.post("/api/articles/5/comments")
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe(
					"Invalid Request: Missing required properties in request body"
				);
			});
	});

	test("400: returns a bad request error if a required property present but is of an invalid data type", () => {
		return request(app)
			.post("/api/articles/5/comments")
			.expect(400)
			.send({
				username: "lurker",
				body: true,
			})
			.then(({ body }) => {
				expect(body.msg).toBe(
					"Invalid Request: Properties contain incorrect data types"
				);
			});
	});

	test("404: returns username not found if username is not present in the database", () => {
		return request(app)
			.post("/api/articles/5/comments")
			.expect(404)
			.send({
				username: "gandalf_the_grey",
				body: "have you tried turning it off and on again? :)",
			})
			.then(({ body }) => {
				expect(body.msg).toBe(
					"No valid user with the username: gandalf_the_grey"
				);
			});
	});

	test("404: responds with 404 article not found if there is no article with the requested article_id", () => {
		return request(app)
			.post("/api/articles/9999/comments")
			.expect(404)
			.send({
				username: "lurker",
				body: "YOU SHALL NOT PASS!",
			})
			.then(({ body }) => {
				expect(body.status).toBe(404);
				expect(body.msg).toBe("No article found with the id: 9999");
			});
	});
});

// CORE: DELETE /api/comments/:comment_id
// Description
// Should:

// be available on /api/comments/:comment_id.
// delete the given comment by comment_id.
// Responds with:

// status 204 and no content.
// Consider what errors could occur with this endpoint, and make sure to test for them.

// Remember to add a description of this endpoint to your /api endpoint.

describe("DELETE: /api/comments/:comment_id", () => {
	test("204: successfully deletes a comment by its id", () => {
		return request(app).delete("/api/comments/5").expect(204);
	});

	test("404: returns a 404 comment not found if comment_id isn't present in the database", () => {
		return request(app)
			.delete("/api/comments/5000")
			.expect(404)
			.then(({ body }) => {
				expect(body.status).toBe(404);
				expect(body.msg).toBe("No comment found with the id: 5000");
			});
	});

	test("400: returns a bad request if the comment_id is not of a valid data type (integer)", () => {
		return request(app)
			.delete("/api/comments/elden_beast")
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad Request!");
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
