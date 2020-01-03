import json
from datasette.app import Datasette
from mangum import Mangum
import hnswlib


files = ["df_small.json.db", "chinook.db"]
ds = Datasette(files)
func = Mangum(ds.app(), enable_lifespan=False)


def handler(event, context):
    original_path = event["requestContext"]["path"]
    proxy = event["pathParameters"]["proxy"]
    prefix, suffix = original_path.split(proxy)
    print(event)
    print(context)
    response = func(event, context)
    reformed = rewrite_html(response, prefix, proxy)
    print(reformed)
    return reformed


def rewrite_html(response, prefix, proxy):
    body = response["body"]
    if "html" in response["headers"]["content-type"]:
        # on input time, origina_path was renamed to proxy
        # now reverse this
        target = f"/{prefix}/{proxy}".replace("//", "/")
        body = body.replace(f"/{proxy}", target)
    response["body"] = body
    return response


test_event = {
    "resource": "/{proxy+}",
    "path": "/chinook",
    "httpMethod": "GET",
    "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-US,en;q=0.9",
        "cookie": "pN=12; s_pers=%20s_vnum%3D1580606767677%2526vn%253D4%7C1580606767677%3B%20s_invisit%3Dtrue%7C1578074800277%3B%20s_nr%3D1578073000282-Repeat%7C1585849000282%3B; s_sess=%20s_cc%3Dtrue%3B%20s_sq%3Dawsamazonprod1%252Cawsamazonallprod1%253D%252526pid%25253Dv1%2525252Fdocumentation%2525252Fapi%2525252Flatest%2525252Freference%2525252Fservices%2525252Flambda%252526pidt%25253D1%252526oid%25253Dhttps%2525253A%2525252F%2525252Fboto3.amazonaws.com%2525252Fv1%2525252Fdocumentation%2525252Fapi%2525252Flatest%2525252Freference%2525252Fservices%2525252Flambda.html%25252523Lambda.Client%252526ot%25253DA%3B",
        "Host": "i6xw0rey6a.execute-api.us-east-2.amazonaws.com",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "None",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36",
        "X-Amzn-Trace-Id": "Root=1-5e0fa778-e30a3ab909862d085a851680",
        "X-Forwarded-For": "135.180.49.92",
        "X-Forwarded-Port": "443",
        "X-Forwarded-Proto": "https",
    },
    "multiValueHeaders": {
        "accept": [
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"
        ],
        "accept-encoding": ["gzip, deflate, br"],
        "accept-language": ["en-US,en;q=0.9"],
        "cookie": [
            "pN=12; s_pers=%20s_vnum%3D1580606767677%2526vn%253D4%7C1580606767677%3B%20s_invisit%3Dtrue%7C1578074800277%3B%20s_nr%3D1578073000282-Repeat%7C1585849000282%3B; s_sess=%20s_cc%3Dtrue%3B%20s_sq%3Dawsamazonprod1%252Cawsamazonallprod1%253D%252526pid%25253Dv1%2525252Fdocumentation%2525252Fapi%2525252Flatest%2525252Freference%2525252Fservices%2525252Flambda%252526pidt%25253D1%252526oid%25253Dhttps%2525253A%2525252F%2525252Fboto3.amazonaws.com%2525252Fv1%2525252Fdocumentation%2525252Fapi%2525252Flatest%2525252Freference%2525252Fservices%2525252Flambda.html%25252523Lambda.Client%252526ot%25253DA%3B"
        ],
        "Host": ["i6xw0rey6a.execute-api.us-east-2.amazonaws.com"],
        "sec-fetch-mode": ["navigate"],
        "sec-fetch-site": ["None"],
        "sec-fetch-user": ["?1"],
        "upgrade-insecure-requests": ["1"],
        "User-Agent": [
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
        ],
        "X-Amzn-Trace-Id": ["Root=1-5e0fa778-e30a3ab909862d085a851680"],
        "X-Forwarded-For": ["135.180.49.92"],
        "X-Forwarded-Port": ["443"],
        "X-Forwarded-Proto": ["https"],
    },
    "queryStringParameters": None,
    "multiValueQueryStringParameters": None,
    "pathParameters": {"proxy": "chinook"},
    "stageVariables": None,
    "requestContext": {
        "resourceId": "b8e4h8",
        "resourcePath": "/{proxy+}",
        "httpMethod": "GET",
        "extendedRequestId": "FvcayGSyCYcFs5w=",
        "requestTime": "03/Jan/2020:20:43:36 +0000",
        "path": "/prod/chinook",
        "accountId": "179870984089",
        "protocol": "HTTP/1.1",
        "stage": "prod",
        "domainPrefix": "i6xw0rey6a",
        "requestTimeEpoch": 1578084216155,
        "requestId": "ec8fc9a0-bcee-4a54-9658-0152b1a410ab",
        "identity": {
            "cognitoIdentityPoolId": None,
            "accountId": None,
            "cognitoIdentityId": None,
            "caller": None,
            "sourceIp": "135.180.49.92",
            "principalOrgId": None,
            "accessKey": None,
            "cognitoAuthenticationType": None,
            "cognitoAuthenticationProvider": None,
            "userArn": None,
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36",
            "user": None,
        },
        "domainName": "i6xw0rey6a.execute-api.us-east-2.amazonaws.com",
        "apiId": "i6xw0rey6a",
    },
    "body": None,
    "isBase64Encoded": False,
}


if __name__ == "__main__":
    handler(test_event, {})
