const express = require("express");
const app = express();
const port = 3000;
const https = require("https");

require("dotenv").config();
const mailchimpApiKey = process.env.MAILCHIMP_API_KEY;
const listId = process.env.MAILCHIMP_LIST_ID;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // access static files via relative URLs

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post("/", (req, res) => {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;
  console.log(firstName, lastName, email);

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);
  const url = `https://us4.api.mailchimp.com/3.0/lists/${listId}`;
  const options = {
    method: "POST",
    auth: `rohan9:${mailchimpApiKey}`,
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(jsonData),
    },
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});
