// Function to parse tweet and return string value
let tweetParser = async function (tweetDom) {
  // Get the content from the tweet
  tweetText = "";

  let contentSpans = tweetDom.querySelectorAll(
    "div[data-testid='tweetText'] > span"
  );

  // concat multiple blocks of string into single string
  for (let cont of contentSpans) {
    tweetText += cont.innerText + " ";
  }

  return tweetText;
};

// Function to get Tweets from DOM and return tweet object
async function getTweets() {
  // Function to get New Tweet Bodies
  let divs = document.querySelectorAll("article");

  tweets = [];

  // Get Tweets which have data-testid set as tweet
  for (let div of divs) {
    let dataTestId = div.getAttribute("data-testid");

    if (dataTestId == "tweet") {
      tweets.push(div);
    }
  }

  let parsedTweets = {};

  // Get Tweet id's and its content
  for (let tweet of tweets) {
    let aTags = tweet.getElementsByTagName("a");

    for (let aTag of aTags) {
      let href = aTag.getAttribute("href");

      if (href.includes("/status/")) {
        let tweetId = href.split("/");
        tweetId = tweetId[3];

        if (!(tweetId in parsedTweets)) {
          parsedTweets[tweetId] = await tweetParser(tweet);
        }
      }
    }
  }

  return parsedTweets;
}

// Function to get sentiment from Sentiment Endpoint
async function getSentiment(tweets) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(tweets),
    redirect: "follow",
  };

  return fetch(
    "https://sentanalysistweeter.wl.r.appspot.com/api/sentiment-score",
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      return result;
    })
    .catch((error) => console.log("error", error));
}

// Function to get Language of tweet form Language Detection Endpoint
async function getLanguage(tweets) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(tweets),
    redirect: "follow",
  };

  return fetch(
    "https://sentanalysistweeter.wl.r.appspot.com/api/language-detection",
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      return result;
    })
    .catch((error) => console.log("error", error));
}

// Function to add the sentiment to the DOM on twitter
async function decorateDOM(parsedTweets, sentiment) {
  let mood = {
    POSITIVE: "😊",
    NEUTRAL: "😐",
    NEGATIVE: "☹️",
  };

  console.log(parsedTweets.length == sentiment.length);

  let index = 0;
  let flag = false;
  let tweetDOM = document.querySelectorAll('article[data-testid="tweet"');

  for (tweetId of Object.keys(parsedTweets)) {
    for (tweet of tweetDOM) {
      let aTags = tweet.querySelectorAll("a[href");
      for (let aTag of aTags) {
        href = aTag.getAttribute("href");
        href = href.split("/")[3];

        userNamesDiv = tweet.querySelector('div[data-testid="User-Names"]');

        if (userNamesDiv.getAttribute("Mood-Set")) {
          break;
        }

        if (href == tweetId) {
          flag = true;

          userNamesDiv.setAttribute("Mood-set", true);
          nameDom = userNamesDiv.children[1];
          nameDom = nameDom.children[0];

          console.log(nameDom);
          moodDiv = document.createElement("div");
          moodDiv.classList.add("css-1dbjc4n", "r-1wbh5a2", "r-dnmrzs");

          moodText = document.createElement("p");
          moodText.classList.add(
            "css-901oao",
            "css-1hf3ou5",
            "r-1bwzh9t",
            "r-18u37iz",
            "r-37j5jr",
            "r-a023e6",
            "r-16dba41",
            "r-rjixqe",
            "r-bcqeeo",
            "r-qvutc0"
          );

          moodText.innerText =
            "Detected Mood: " + mood[sentiment[index]["detected_mood"]];
          index += 1;

          moodDiv.appendChild(moodText);

          divSeperator = document.createElement("div");
          spanSeperator = document.createElement("span");

          spanSeperator.classList.add(
            "css-901oao",
            "css-16my406",
            "r-poiln3",
            "r-bcqeeo",
            "r-qvutc0"
          );
          spanSeperator.innerText = "·";

          divSeperator.classList.add(
            "css-901oao",
            "r-1bwzh9t",
            "r-1q142lx",
            "r-37j5jr",
            "r-a023e6",
            "r-16dba41",
            "r-rjixqe",
            "r-bcqeeo",
            "r-s1qlax",
            "r-qvutc0"
          );
          divSeperator.appendChild(spanSeperator);

          nameDom.appendChild(divSeperator);
          nameDom.appendChild(moodDiv);
          break;
        }
      }

      if (flag) {
        flag = false;
        break;
      }
    }
  }
}
// ------------------------------- Helper Functions End ------------------------------------

// Main Function
let main = async function () {
  let parsedTweetsGlobal = {};
  let res = [];

  // console.log(res);
  let prevLen = 0;
  window.addEventListener("scroll", async function () {
    let newParsedTweets = await getTweets();

    for (tweetId in newParsedTweets) {
      if (!(tweetId in parsedTweetsGlobal)) {
        res.push({
          tweet_text: newParsedTweets[tweetId],
        });
        parsedTweetsGlobal[tweetId] = newParsedTweets[tweetId];
      }
    }

    if (prevLen < res.length) {
      prevLen = res.length;

      // Call Language detection API Endpoint
      let langDetect = await getLanguage(res);

      // Get sentiments of English tweets
      let english_tweets = [];
      let selected_tweets = {};
      for (let tweet of langDetect) {
        if (tweet["is_english"]) {
          english_tweets.push({
            tweet_text: tweet["tweet_text"],
          });
        }
      }

      let sentiment = await getSentiment(english_tweets);
      decorateDOM(parsedTweetsGlobal, sentiment);
    }
  });
};
main();
