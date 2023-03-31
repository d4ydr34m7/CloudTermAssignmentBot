import json
import boto3

def lambda_handler(event, context):
    sqs = boto3.client('sqs')
    # TODO implement
    print(event)
    body = event
    type = body['type']
    
    if type == 'CONNECT':
        queueUrl = 'https://sqs.us-east-1.amazonaws.com/475580900086/Connect'
    elif type == 'SUBSCRIBE':
        queueUrl = 'https://sqs.us-east-1.amazonaws.com/475580900086/Subscribe'
    elif type == 'PUBLISH':
        queueUrl = 'https://sqs.us-east-1.amazonaws.com/475580900086/Publish'
        
    #https://boto3.amazonaws.com/v1/documentation/api/latest/guide/sqs-example-sending-receiving-msgs.html    
    response = sqs.receive_message(QueueUrl=queue_url, MaxNumberOfMessages=1)
    messages = response.get('Messages', [])
    #https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/examples-sqs-messages.html
    if len(messages) > 0:
        message = messages[0]
        receivedResp = message['ReceiptHandle']
        body = json.loads(message['Body'])
        sqs.delete_message(QueueUrl=queueUrl, ReceiptHandle=receivedResp)

        if type == 'CONNECT':
            username = body['username']
            password = body['password']
            responseBody = {"type": "CONNACK", "returnCode": 0, "username": username, "password": password}
        elif type == 'SUBSCRIBE':
            responseBody = {"type": "SUBACK", "returnCode": 0}
        elif type == 'PUBLISH':
            payload = body['payload']
            responseBody = {"type": "PUBACK", "returnCode": 0, "payload": payload}

        
        return responseBody

    return {
        'body': json.dumps({'message': f'No messages found in queue  {type} '})
    }
    