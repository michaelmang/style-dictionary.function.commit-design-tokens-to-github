const { Octokit } = require("@octokit/core");
const express = require("express");

const app = express();

const octokit = new Octokit({ auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN });

app.get("/test", res => {
  res.sendStatus(200);
});

app.post("/commit-tokens", async (req, res) => {
  await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
    owner: "michaelmang",
    repo: "style-dictionary",
    path: `input/design-tokens.json`,
    message: "Update design tokens",
    content: JSON.parse(req.body.tokens)
  });

  res.sendStatus(200);
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
