# Twitter Sentiment Analysis - Chrome Extension

The Following repository contains the code for a Sentiment Analyzer for Twitter. Sentiment analysis is the use of natural language processing (NLP) , text analysis, computational linguistics, and biometrics to systematically identify, extract, quantify, and study affective states and subjective information.

## Web Server

The web server is hosted on the Google Cloud Platform (GCP) and contains two files.

**main.py - Defines 2 post endpoints that accept JSON data and return the detected language and it corresponding sentiment.**

1.  `https://sentanalysistweeter.wl.r.appspot.com/api/language-detection`

    Is a post request which accepts JSON Array of objects with the _"tweet_text"_ key containing the tweet content. It returns weather the detected language in the tweet is English or not.

**Sample Response:**

    [
    	{
    		"tweet_text": "Stats on Twitter World Cup",
    		"is_english": true
    	},

    	{
    		"tweet_text": "As the saying goes, be careful what you wish, as you might get it",
    		"is_english": true
    	},
    	{
    		"tweet_text": "️❤ !شب یلدا مبارک",
    		"is_english": false
    	}
    ]

2.  `https://sentanalysistweeter.wl.r.appspot.com/api/sentiment-score`

Is a post request which accepts JSON array of objects similar to the prior endpoint and returns the sentiment score for each tweet and the overall sentiment for the give tweet.

**Sample Response**

    [
        {
    	    "tweet_text": "Stats on Twitter World Cup",
    	    "sentiment_score": {
                "positive": 0.0,
                "neutral": 1.0,
                "negative": 0.0
    	     },
            "detected_mood": "NEUTRAL"
        },

    	{
    		"tweet_text": "As the saying goes, be careful what you wish, as you might get it",
    		"sentiment_score": {
    			"positive": 0.264,
    			"neutral": 0.736,
    			"negative": 0.0
    		},
    		detected_mood": "POSITIVE"
    	}
    ]

**language.py - Contains the functions required for language detection and sentiment analysis.**

The language detection function make an API call to the detectlang API which returns the language code (i.e. "en" ,"fr") for the detected language. We sort the returned results and return a Boolean denoting if the language is English.

The Sentiment Score function accepts tweets and uses the vader sentiment python library to detect the sentiment of the given tweet. VADER (Valence Aware Dictionary and sentiment Reasoner) is a lexicon and rule-based sentiment analysis tool that is specifically attuned to sentiments expressed in social media.

## Chrome Extension

The chrome extension is made using manifest 3 and JavaScript. The chrome extension performs web scraping by collecting the tweet content from the twitter DOM. Since twitter uses lazy loading the tweets need to be collected every time new data is loaded onto the DOM. This is handled by attaching a even listener on scroll. This ensures that only the tweets which have loaded into the DOM are sent to the API. It improves the overall performance and ensures the end user get results in near real-time.

Once the tweet sentiment is detected the extension sets the detected mood of the tweet denoted by a smiling, neutral or frowning emoji in the DOM itself. It ensures that the style and presentation of the new element matches the client UI.

Example Image:
![Detected Mood for a tweet by Tesla](https://github.com/vakharia-aarya/TwitterSentimentAnalyzer/blob/main/Images/tweet_mood_detected.png)
