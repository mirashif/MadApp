#!/usr/bin/env python3
import subprocess
import os
import time
from datetime import datetime

ran = False

while True:
    result = subprocess.run(['adb', 'devices'], stdout=subprocess.PIPE)
    result = result.stdout.decode('utf8')
    lines = list(filter(lambda l: len(l) > 5, result.split('\n')[1:]))

    if len(lines) >= 1:
        error = False

        for line in lines:
            if len(line) > 20:
                error = True
                break

        if not error:
            os.system('bash ./tunnel.sh')

            if not ran:
                print(datetime.now(), "TUNNELED")
        else:
            print(datetime.now(), "ERROR IN ONE OF THE DEVICES, PLEASE RUN: adb devices")

        ran = True
    else:
        ran = False


    time.sleep(5)
