Building python env

    # Launch docker image
    docker run -v /Users/chris/code/valencia/src/serve:/serve -it lambci/lambda:build-python3.7 /bin/bash
    # within container, run installs, saving locally
    pip install pybind11 -t .
    pip install numpy -t .
    pip install pybind11 numpy
    pip install hnswlib -t .

    # Exit from docker, rename hnwslib
    mv hnswlib-0.3.4.dist-info/ hnswlib
