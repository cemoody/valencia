import json
from datasette.app import Datasette
from mangum import Mangum
import hnswlib

files = ["df_small.json.db", "staging.db"]
ds = Datasette(files)
handler = Mangum(ds.app(), enable_lifespan=False)
