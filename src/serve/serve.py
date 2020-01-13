import os
import os.path
import json
import time
from datasette.app import Datasette
from mangum import Mangum
import hnswlib
import boto3
from test_events import test_event6

s3 = boto3.client("s3")


class DatasetteInMem(Datasette):
    def connect(self):
        if self.is_memory:
            return sqlite3.connect(":memory:")
        # mode=ro or immutable=1?
        if self.is_mutable:
            qs = "mode=ro"
        else:
            qs = "immutable=1"
        print("connecting")
        new_db = sqlite3.connect(':memory:') # create a memory database
        old_db = sqlite3.connect(
            "file:{}?{}".format(self.path, qs), uri=True, check_same_thread=False
        )
        query = "".join(line for line in old_db.iterdump())
        # Dump old database in the new one.
        new_db.executescript(query)
        print("moved db to in mem")
        return new_db


def trying(func, *args, trying=False):
    if trying:
        try:
            return func(*args)
        except:
            return None
    else:
        return func(*args)


def download_files(bucket=None, key_no_suffix=None):
    base = os.path.basename(key_no_suffix)
    files = [f"/tmp/{base}.db"]
    for suffix in [".db", ".index"]:
        fn = f"/tmp/{base}{suffix}"
        if os.path.exists(fn):
            continue
        t0 = time.time()
        key = key_no_suffix + suffix
        trying(s3.download_file, bucket, key, fn, trying=suffix != ".db")
        t1 = time.time()
        print(f"Downloading {fn} took {(t1-t0)*1000.0:1.3f}ms")
    return files


key = os.environ.get("S3_KEY", None)
bucket = os.environ.get("S3_BUCKET", None)
files = ["chinook.db"]
if key is not None:
    files = download_files(bucket, key)
ds = DatasetteInMem(files)
asgi = Mangum(ds.app(), enable_lifespan=False)


def remove_extension(fn):
    splits = fn.split(".")
    if len(splits) > 1:
        splits = splits[:-1]
    removed = ".".join(splits)
    return removed


def to_key(user, database):
    fn = remove_extension(database)
    bucket = "valenciauserstorage163901-prod"
    key_no_suffix = f"private/us-east-2:{user}/{fn}"
    return bucket, key_no_suffix


def handler(event, context):
    global files
    global ds
    global asgi
    print(event)
    print(context)
    # This is like /prod/{user}/{database}
    original_path = event["requestContext"]["path"]
    # This is like /{user}/{database}, database should match local file
    proxy = event["pathParameters"]["proxy"]
    # Remove leading or trailing slashes, what's left is
    # user & database
    splits = proxy.strip("/").split("/")
    user, database = splits[:2]
    fake_path = ("/" + "/".join(splits[1:])).replace("//", "/")
    print("fake path:", fake_path)
    # Remove user from path, so datasette thinks request is really
    # /{database}/{subdir...} instead of /prod/{user}/{database}/{subdir...}
    event["pathParameters"]["proxy"] = fake_path
    event["path"] = fake_path
    if database not in files:
        files = download_files(*to_key(user, database))
        ds = DatasetteInMem(files)
        asgi = Mangum(ds.app(), enable_lifespan=False)
    prefix, suffix = original_path.split(fake_path)
    response = asgi(event, context)
    reformed = rewrite_html(response, prefix, f"/{database}")
    print(reformed)
    return reformed


def rewrite_html(response, prefix, proxy):
    body = response["body"]
    if "html" in response["headers"]["content-type"]:
        # on input time, origina_path was renamed to proxy
        # now reverse this
        target = f"/{prefix}/{proxy}".replace("//", "/")
        source = f"/{proxy}".replace("//", "/")
        body = body.replace(source, target)
    response["body"] = body
    return response


if __name__ == "__main__":
    handler(test_event6, {})
