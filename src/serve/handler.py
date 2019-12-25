import json
from datasette.app import Datasette
from mangum import Mangum

files = ['chinook.db']
ds = Datasette(files)
handler = Mangum(ds.app(), enable_lifespan=False)
