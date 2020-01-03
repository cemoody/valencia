import pandas as pd
import numpy as np

df = pd.DataFrame(
    {
        "a": list("abc"),
        "b": list(range(1, 4)),
        "c": np.arange(3, 6).astype("u1"),
        "d": np.arange(4.0, 7.0, dtype="float64"),
        "e": [True, False, True],
        "f": pd.date_range("20130101", periods=3),
        "g": pd.date_range("20130101", periods=3, tz="US/Eastern"),
        "pc00": np.arange(4.0, 7.0, dtype="float64"),
        "pc01": np.arange(4.0, 7.0, dtype="float64"),
        "pc02": np.arange(4.0, 7.0, dtype="float64"),
        "pc03": np.arange(4.0, 7.0, dtype="float64"),
        "pc04": np.arange(4.0, 7.0, dtype="float64"),
        "pc05": np.arange(4.0, 7.0, dtype="float64"),
        "pc06": np.arange(4.0, 7.0, dtype="float64"),
    }
)

if __name__ == "__main__":
    with open("df_small.json", "w") as fh:
        fh.write(df.to_json())
