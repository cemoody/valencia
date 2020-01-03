Building python env

    # Launch docker image
    docker run -v /Users/chris/code/valencia/src/serve:/serve -it lambci/lambda:build-python3.7 /bin/bash
    # within container, run installs, saving locally
    export PYTHONPATH=/serve
    yum install gcc
    cd /serve
    pip install numpy pandas setuptools -t . --upgrade
    pip install pybind11 -t . --upgrade
    cp -rd include/python/pybind11 /var/lang/include/python3.7m
    yum install git
    git clone https://github.com/nmslib/hnswlib.git
    cd hnswlib/
    cd python_bindings
    python setup.py install --root=/serve

Make a python lambda layer:

    docker run -v /Users/chris/code/valencia/src/serve:/serve -it lambci/lambda:build-python3.7 /bin/bash
    cd /serve
    mkdir -p temp/python
    cd temp
    # These libs you need zipped up
    pip install --no-deps numpy pandas setuptools pybind11 pytz python-dateutil boto3 six urllib3 jmespath -t python

    # These libs you need temporarily to build hnswlib
    pip install setuptools
    pip install pybind11
    yum install git
    git clone https://github.com/nmslib/hnswlib.git
    cd hnswlib/python_bindings
    export PYTHONPATH=/serve/temp/python/
    python setup.py install --root=/serve/temp/python
    cp -rd /serve/temp/python/var/lang/lib/python3.7/site-packages/* /serve/temp/python/
    cd /serve/temp/
    zip -r pandas-025-numpy-018-hnswlib.zip .

To run `indexer.py` to interactively debug:

    cp ln -s ~/.aws/credentials ~/code/valencia/src/serve
    docker run -p 8001:8001 -v /Users/chris/code/valencia/src/serve:/serve -it lambci/lambda:build-python3.7 /bin/bash
    export AWS_CONFIG_FILE=/serve/credentials
    # Then, within the task:
    cd /serve
    # Creates the index files
    python indexer.py df_small.json
    # Serve datasette using the built-in server (not used in production)
    datasette -h 0.0.0.0 df_small.json.db

Deploy stackery (which is most of the python backend code) doing:

    stackery deploy --strategy local --stack-name valencia --env-name prod

Deploy AWS amplify (which is mostly authentication-related backend).
Remember you need to copy `#current-cloud-backend` back into `valencia/amplify/` for the amplify commands to work
and move away that directory to make `now dev` work.

#current-cloud-backend
