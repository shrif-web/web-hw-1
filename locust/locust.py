from random import paretovariate
from locust import task, between, HttpUser
from locust.user import wait_time
import random
import time
import string


def id_generator(size=10, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))


class WebsiteUser(HttpUser):
    def __init__(self, parent):
        super(WebsiteUser, self).__init__(parent)

    wait_time = wait_time.constant(1)

    @task
    def get_golang(self):
        key = id_generator()
        self.client.get("/Loader.aspx?ParTree=151311&i=46348559193224090")
