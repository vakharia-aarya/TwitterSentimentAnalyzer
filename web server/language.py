from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import detectlanguage
from constants import API_KEY


def detect_language(text):
    
    text = text.strip()
    detectlanguage.configuration.api_key = API_KEY

    if text:
        detected_lang = detectlanguage.simple_detect(text)
        if detected_lang == 'en':
            return True
    

    return False


def get_sentiment(text):
    analyzer = SentimentIntensityAnalyzer()
    vs = analyzer.polarity_scores(text)

    mood = ""

    if vs['compound'] >= 0.05:
        mood = 'POSITIVE'
    elif (vs['compound'] > -0.05) and (vs['compound'] < 0.05):
        mood = 'NEUTRAL'
    else:
        mood = 'NEGATIVE'
    

    prediction = {
        'sentiment_score':{
            "positive": vs['pos'],
            "neutral": vs['neu'],
            "negative": vs['neg']
        },

        'detected_mood':mood
    }  
    return prediction

