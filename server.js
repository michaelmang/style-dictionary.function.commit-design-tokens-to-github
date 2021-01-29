const { Octokit } = require("@octokit/core");

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

const octokit = new Octokit({ auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN });

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post("/commit-tokens", async (req, res) => {
  let file;  

  try {
    file = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
      owner: "michaelmang",
      repo: "style-dictionary",
      path: "input/design-tokens.json",
    });
  }
  catch (ex) {
    // swallow 404
  }
  
  await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
    owner: "michaelmang",
    repo: "style-dictionary",
    path: "input/design-tokens.json",
    message: "Update design tokens",
    content: "derp",
    sha: file && file.data && file.data.sha ? file.data.sha : null
  });

  res.sendStatus(200);
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
