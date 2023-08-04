const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const PORT = process.env.PORT || 3001;
const axios = require("axios");

const indexPath = path.resolve(__dirname, "..", "build", "index.html");
// static resources should just be served as they are
app.use(
  express.static(path.resolve(__dirname, "..", "build"), { maxAge: "30d" })
);

app.get("/job/:jobId", (req, res, next) => {
  fs.readFile(indexPath, "utf8", async (err, htmlData) => {
    if (err) {
      console.error("Error during file reading", err);
      return res.status(404).end();
    }

    const jobId = req?.params?.jobId;

    let title = "";
    let description = "";

    axios
      .get(`https://api.seikor.com/api/jobs/view/${jobId}`)
      .then((response) => {
        if (response?.status == 200 || response?.status == "SUCCESS") {
          title = response?.data?.data?.jobTitle;
          location = response?.data?.data?.locationName;
          companyName = response?.data?.data?.companyProfile?.companyName;
          description = response?.data?.data?.companyProfile?.companyDesc;

          htmlData = htmlData
            .replace(
              "<title>Seikor - Find your future</title>",
              `<title>${title}</title>`
            )
            .replace("Seikor", `${title} - ${location} - ${companyName}`)
            .replace("Seikor", `${title} - ${location} - ${companyName}`)
            .replace("Seikor - Find your future", description)
            .replace("Seikor - Find your future", description)
            .replace("Seikor - Find your future", description)
            .replace(
              "__META_OG_IMAGE__",
              `https://api.seikor.com/api/core/download/PROFILE/11957_1680252960157.png`
            )
            .replace(
              "__META_OG_IMAGE__",
              `https://api.seikor.com/api/core/download/PROFILE/11957_1680252960157.png`
            );
          return res.send(htmlData);
        }
      })
      .catch((err) => {
        console.log("Error: ", err.message);
      });
  });
});

app.get("/*", (req, res, next) => {
  // console.log("res in *", req);
  fs.readFile(indexPath, "utf8", async (err, htmlData) => {
    if (err) {
      console.error("Error during file reading", err);
      return res.status(404).end();
    }

    return res.send(htmlData);
  });
});

app.listen(PORT, (error) => {
  if (error) {
    return console.log("Error during app startup", error);
  }
  console.log("listening on " + PORT + "...");
});
