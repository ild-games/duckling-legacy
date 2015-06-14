#!/usr/bin/env python3

import sys,shutil,os

if len(sys.argv) != 3:
    print("Usage: {} <source_name> <target_name>",sys.argv[0])
    sys.exit(1)

source_name = sys.argv[1]
dest_name = sys.argv[2]

os.makedirs(os.path.dirname(dest_name),exist_ok=True)
shutil.copyfile(source_name, dest_name)
