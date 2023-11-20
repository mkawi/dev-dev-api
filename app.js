const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topic.controller");

app.get("/api/topics", getTopics);

module.exports = app;
