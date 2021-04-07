const app = require("express")();
const cheerio = require("cheerio");
const cors = require("cors");
const rs = require("request");
const port = 5000;
app.use(cors());
const baseURL = "https://gaadiwaadi.com/";
// Homepage
app.get("/api/", (req, res) => {
  let data = {
    info: "GaadiWaddi.com Unofficial API",
    news: "/api/news/:page",
    details: "/api/get/:id",
    search: "/api/search/:word/:page",
  };
  res.json({data});
});
// News Page
app.get("/api/news/:page", (req, res) => {
  let results = [];
  let page = req.params.page;
  if (isNaN(page)) {
    return res.status(404).json({ results });
  }
  url = `${baseURL}page/${req.params.page}`;
  rs(url, (error, response, html) => {
    if (!error) {
      try {
        var $ = cheerio.load(html);
        $(".td-module-thumb").each(function (index, element) {
          let title = $(this).children("a").attr().title;
          let id1 = $(this).children("a").attr().href;
          let id2 = id1.replace("https://gaadiwaadi.com/", "");
          let id = id2.replace("/", "");
          let image = $(this).children("a").children("img").attr('data-src');
          results[index] = { title, id, image };
        });
        res.status(200).json({ results });
      } catch (e) {
        res.status(404).json({ e: "404" });
      }
    }
  });
});
// Full News
app.get("/api/get/:id", (req, res) => {
  let results = [];
  let id = req.params.id;
  url = `${baseURL}${id}`;
  console.log(url)
  rs(url, (error, response, html) => {
    if (!error) {
      try {
        var $ = cheerio.load(html);
        var title = $(".td-ss-main-content")
          .children("article")
          .children(".td-post-header")
          .children("header")
          .children("h1")
          .text();
        var subtitle = $(".td-ss-main-content")
          .children("article")
          .children(".td-post-content")
          .children("h2")
          .text();
        var desc = $(".td-ss-main-content")
          .children("article")
          .children(".td-post-content")
          .children("p")
          .text();
        var image = $(".td-ss-main-content")
          .children("article")
          .children(".td-post-content")
          .children("div")
          .children("img")
          .attr('data-src');
        results = { title, image, subtitle, desc };
        res.status(200).json({ results });
      } catch (e) {
        res.status(404).json({ e: "404" });
      }
    }
  });
});
// Search
app.get("/api/search/:word/:page", (req, res) => {
  let results = [];
  var word = req.params.word;
  let page = req.params.page;
  if (isNaN(page)) {
    return res.status(404).json({ results });
  }

  url = `${baseURL}page/${req.params.page}/?s=${word}`;
  rs(url, (err, resp, html) => {
    if (!err) {
      try {
        var $ = cheerio.load(html);
        $(".td-module-thumb").each(function (index, element) {
          let title = $(this).children("a").attr().title;
          let id1 = $(this).children("a").attr().href;
          let id2 = id1.replace("https://gaadiwaadi.com/", "");
          let id = id2.replace("/", "");
          let image = $(this).children("a").children("img").attr('data-src');
          results[index] = { title, id, image };
        });
        res.status(200).json({ results });
      } catch (e) {
        res.status(404).json({ e: "404" });
      }
    }
  });
});

app.listen(port, () => console.log("running on 5000"));

module.exports = app;
