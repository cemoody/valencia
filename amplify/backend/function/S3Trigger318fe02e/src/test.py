import boto3
import base64
import json

blob = {
    "bucket": "valenciauserstorage163901-prod",
    "key": "private/us-east-2:03e6c35f-0e7a-4cc3-91db-acf79ce94f28/Screen Shot 2019-12-22 at 9.23.50 AM.png",
}
payload = json.dumps(blob)
context = base64.b64encode(json.dumps({}).encode("utf-8")).decode("utf-8")

params = {
    "FunctionName": "valencia-prod-indexer",
    "ClientContext": context,
    "InvocationType": "RequestResponse",
    "LogType": "None",
    "Payload": payload,
}
print(params)

lam = boto3.client("lambda")

ret = lam.invoke(**params)
print(ret)
print(ret["Payload"].read())
