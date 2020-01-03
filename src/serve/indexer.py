import sys
import time
import json
import boto3
import os.path
import numpy as np
import pandas as pd
import hnswlib
import sqlite3
from contextlib import redirect_stdout


s3 = boto3.client("s3")


def handler(event, context):
    # Log the event argument for debugging and for use in local development.
    print(json.dumps(event))
    bucket = event["bucket"]
    key = event["key"]
    print(bucket, key)
    fn = os.path.basename(key)
    s3.download_file(bucket, key, fn)
    print(bucket, key)
    error = True
    with open("log", "w") as log:
        try:
            index, catalog = run(fn, log)
            error = False
        except Exception as e:
            log.write(str(e) + "\n")
    logs = open("log", "r").read()
    print("Execution logs:")
    print(logs)
    if not error:
        s3.upload_file(index, bucket, f"{key}.index")
        s3.upload_file(catalog, bucket, f"{key}.db")
        s3.upload_file("log", bucket, f"{key}.log")
    codes = {True: "error", False: "success"}
    return {"status": codes[error], "log": logs, "key": key}


def run(fn, log):
    df = to_df(fn, log)
    index = make_index(df, fn, log)
    catalog = make_sqlite(df, fn, log)
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


def make_sqlite(df, fn, log):
    t0 = time.time()
    cnx = sqlite3.connect(f"{fn}.db")
    df.to_sql(name="catalog", con=cnx)
    t1 = time.time()
    log.write(f"Constructed sqlite tables in {(t1 - t0):1.1f}s\n")


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
    mdl.save_index(f"{fn}.index")
    t1 = time.time()
    log.write(f"Constructed index in {(t1 - t0):1.1f}s\n")


def to_df(fn, log):
    """ Try different pandas dataframe readers validate
    some reasonable expectations and yield errors back to
    the user.
    """
    read_funcs = [pd.read_csv, pd.read_json, pd.read_sql]
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
