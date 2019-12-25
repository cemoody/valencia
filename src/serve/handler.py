import json
from datasette.app import Datasette
from mangum import Mangum

files = ['prod.db', 'staging.db']
ds = Datasette(files)
handler = Mangum(ds.app(), enable_lifespan=False)
