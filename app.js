const express = require("express");
const app = express();

const port = 3000;
const https = require("https");

require("dotenv").config();
const mailchimpApiKey = process.env.MAILCHIMP_API_KEY;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); //makes me able to access to  static file through relative url

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post("/", (req, res) => {
  // res.send("Posted successfully.");
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
  const url = "https://us4.api.mailchimp.com/3.0/lists/ce2129b249";
  const options = {
    method: "POST",
    auth: "rohan9:mailchimpApiKey",
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

// curl -X POST \
//   https://${dc}.api.mailchimp.com/3.0/lists \
//   --user "anystring:${apikey}"' \
//   -d '{"name":"","contact":{"company":"","address1":"","address2":"","city":"","state":"","zip":"","country":"","phone":""},"permission_reminder":"","use_archive_bar":false,"campaign_defaults":{"from_name":"","from_email":"","subject":"","language":""},"notify_on_subscribe":"","notify_on_unsubscribe":"","email_type_option":false,"double_optin":false,"marketing_permissions":false}'
// {"name":"","contact":{"company":"","address1":"","address2":"","city":"","state":"","zip":"","country":"","phone":""},"permission_reminder":"","use_archive_bar":false,"campaign_defaults":{"from_name":"","from_email":"","subject":"","language":""},"notify_on_subscribe":"","notify_on_unsubscribe":"","email_type_option":false,"double_optin":false,"marketing_permissions":false}
