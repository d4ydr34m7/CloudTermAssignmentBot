import boto3
import urllib.parse
import requests
import json


def lambda_handler(event, context):

    kendra_client = boto3.client('kendra')
    kendra_index_id = os.environ['KENDRA_INDEX_ID']

    if 'inputTranscript' in event:
        user_query = event['inputTranscript']
    elif 'body' in event:
        body = json.loads(event['body'])
        if 'inputText' in body:
            user_query = body['inputText']
        else:
            return {
                'statusCode': 400,
                'body': 'Missing inputText'
            }
    
    else:
        return {
            'statusCode': 400,
            'body': 'Missing inputTranscript'
        }
    
    #https://docs.aws.amazon.com/kendra/latest/dg/searching-example.html
    response = kendra_client.query(
        IndexId=kendra_index_id,
        QueryText=user_query,
       
    )

    #https://docs.aws.amazon.com/kendra/latest/dg/response-types.html
    try:
        answer = response['ResultItems'][0]['DocumentExcerpt']['Text']
        
    except IndexError:
        #https://stackoverflow.com/questions/6386308/http-requests-and-json-parsing-in-python
        google_search_api_key = 'AIzaSyAvMr51lTlwH0lEtgb3qeAA4fSmSmvsID4'
        google_search_engine_id = 'c71fd930f8bd24114'
        google_search_url = f"https://www.googleapis.com/customsearch/v1?key={google_search_api_key}&cx={google_search_engine_id}&q={urllib.parse.quote(user_query)}"
        
        search_response = requests.get(google_search_url)
        search_data = search_response.json()
        
        try:
            relevant_url = search_data['items'][0]['link']
            relevant_url = relevant_url.split('{{')[0]
            answer = f"Sorry, I don't have a specific response to your question. Please check this link for more information: {relevant_url}"
        except (KeyError, IndexError):
            answer = "Sorry, I couldn't find a relevant link for your query."
        
    #https://docs.aws.amazon.com/lex/latest/dg/lambda-input-response-format.html
    return {
        'dialogAction': {
            'type': 'Close',
            'fulfillmentState': 'Fulfilled',
            'message': {
                'contentType': 'PlainText',
                'content': answer
            }
        }
    }
    