import sys
import time
import json
import boto3
import os.path
import numpy as np
import pandas as pd
import hnswlib
import sqlite3
from urllib.parse import unquote_plus


s3 = boto3.client("s3")


def handler(event, context):
    # Log the event argument for debugging and for use in local development.
    print(json.dumps(event))
    bucket = event["Records"][0]["s3"]["bucket"]["name"]
    key = unquote_plus(event["Records"][0]["s3"]["object"]["key"])
    print(bucket, key)
    fn = f"/tmp/{os.path.basename(key)}"
    s3.download_file(bucket, key, fn)
    print(bucket, key)
    error = True
    with open("/tmp/.log", "w") as log:
        try:
            index, catalog = run(fn, log)
            error = False
        except Exception as e:
            log.write(str(e) + "\n")
    logs = open("/tmp/.log", "r").read()
    print("Execution logs:")
    print(logs)
    if not error:
        s3.upload_file(index, bucket, f"{key}.index")
        s3.upload_file(catalog, bucket, f"{key}.db")
        s3.upload_file("/tmp/.log", bucket, f"{key}.log")
    try_remove(f"{key}.db")
    codes = {True: "error", False: "success"}
    return {"status": codes[error], "log": logs, "key": key}


def run(fn, log):
    df = to_df(fn, log)
    catalog = make_sqlite(df, fn, log)
    index = make_index(df, fn, log)
    return index, catalog


def find_cols(df, log):
    """ Find the vector columns in the df by finding
    columns ending in a numeral and starting with the same letter,
    then finding the longest sequence of such columns.
    """
    cols = pd.DataFrame({"names": df.columns})
    cols["ends_in_numeric"] = cols.names.map(lambda s: s[-1].isdigit())
    cols["starting_letter"] = cols.names.map(lambda s: s[0])
    max_group = None
    for j, group in cols.groupby("starting_letter"):
        sub = group[group["ends_in_numeric"]]
        if max_group is None:
            max_group = sub
        elif len(sub) > len(max_group):
            max_group = sub
    err = (
        "Could not find a valid group of columns that indicate "
        "a vector embedding. "
        "Hint: we look for the longest sequence of columns "
        "with the same starting character and ending with a numeric digit. "
        "Try using columns names like: dim000, dim001, ...dim0999"
    )
    assert max_group is not None, err
    assert len(max_group) > 0, err
    names = list(max_group.names.values)
    log.write(f"Found embeddings columns: {names}\n")
    return names


def try_remove(fn):
    try:
        os.remove(fn)
    except:
        pass


def make_sqlite(df, fn, log):
    t0 = time.time()
    out = f"{fn}.db"
    try_remove(out)
    cnx = sqlite3.connect(out)
    df.to_sql(name="catalog", con=cnx)
    t1 = time.time()
    log.write(f"Constructed sqlite tables in {(t1 - t0):1.1f}s\n")
    return out


def make_index(df, fn, log):
    cols = find_cols(df, log)
    vec = df[cols].values.astype(np.float32)
    n_rows, n_cols = vec.shape
    log.write(f"Found n_rows={n_rows}, n_cols={n_cols}\n")
    labels = list(df.index)
    mdl = hnswlib.Index(space="l2", dim=n_cols)
    mdl.init_index(max_elements=n_rows, ef_construction=200, M=16)
    t0 = time.time()
    mdl.add_items(vec, labels)
    out = f"{fn}.index"
    mdl.save_index(out)
    t1 = time.time()
    log.write(f"Constructed index in {(t1 - t0):1.1f}s\n")
    return out


def read_sqlite(fn):
    """ Read a sqlite database and return the first table as
    a dataframe.
    >>> df = read_sqlite('chinook.db')
    >>> df.head(1)
    AlbumId                                  Title  ArtistId
    0        1  For Those About To Rock We Salute You         1
    """
    conn = sqlite3.connect(fn)
    query = "select name from sqlite_master where type = 'table'"
    tables = pd.read_sql_query(query, conn)
    table = tables.values[0][0]
    df = pd.read_sql_query(f"select * from {table}", conn)
    return df


def to_df(fn, log):
    """ Try different pandas dataframe readers validate
    some reasonable expectations and yield errors back to
    the user.
    """
    read_funcs = [pd.read_csv, pd.read_json, pd.read_sql, read_sqlite]
    for func in read_funcs:
        try:
            log.write(f"\nTrying to read using {func.__name__}\n")
            df = func(fn)
            assert len(df) > 1, "Rejected dataset because fewer than 2 rows were found"
            assert (
                len(df.columns) > 1
            ), "Rejected dataset because fewer than 2 columns were found"
            log.write(f"\nSucceeded reading dataframe using {func.__name__}\n")
            return df
        except Exception as e:
            msg = (
                f"pandas could not read the uploaded file {fn}.\n"
                + "To reproduce this error locally, try:\n"
                + f">>> import pandas as pd\n"
                + f">>> df = pd.{func.__name__}('{fn}')\n"
                + f"Exception: {e}\n"
            )
            log.write(msg)
    raise IOError(f"Could not parse file '{fn}' as a dataframe")


if __name__ == "__main__":
    event = {
        "bucket": "valenciauserstorage163901-prod",
        "key": "private/us-east-2:03e6c35f-0e7a-4cc3-91db-acf79ce94f28/Screen Shot 2019-12-22 at 9.23.50 AM.png",
    }
    # with open("log", "w") as log:
    #     run(sys.argv[-1], log)
    ret = handler(event, {})
    print(ret)
