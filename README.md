Building python env

    # Launch docker image
    docker run -v /Users/chris/code/valencia/src/serve:/serve -it lambci/lambda:build-python3.7 /bin/bash
    # within container, run installs, saving locally
    pip install pybind11 -t .
    pip install numpy -t .
    pip install pandas -t
    pip install hnswlib -t .

    # Exit from docker, rename hnwslib
    mv hnswlib-0.3.4.dist-info/ hnswlib

To run `indexer.py` to interactively debug:

    docker run -p 8001:8001 -v /Users/chris/code/valencia/src/serve:/serve -it lambci/lambda:build-python3.7 /bin/bash
    # Then, within the task:
    cd /serve
    # Creates the index files
    python indexer.py df_small.json
    # Serve datasette using the built-in server (not used in production)
    datasette -h 0.0.0.0 df_small.json.db
