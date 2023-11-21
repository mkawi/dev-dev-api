const { readFile } = require("fs/promises");

exports.selectApi = () => {
	return readFile(`${__dirname}/../endpoints.json`).then((data) => {
		return JSON.parse(data.toString());
	});
};
