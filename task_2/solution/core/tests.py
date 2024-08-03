from functools import cache
from django.test import TestCase
from random import random
from django.test import Client

from django.core.cache import cache


from core.models import UsageSample

# Create your tests here.


class TestUsageSample(TestCase):
    def setUp(self):
        # Every test needs access to the request factory.
        self.client = Client()
        cache.clear()

    # test empty database
    def test_no_samples(self):
        # make request to /samples/last
        response = self.client.get("/api/samples/last/")
        # check if response is 404
        self.assertEqual(response.status_code, 404)

    # test database with one sample
    def test_one_sample(self):
        UsageSample.objects.create(cpu_percent=10, ram_percent=20)
        response = self.client.get("/api/samples/last/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["cpu_percent"], 10)
        self.assertEqual(response.data["ram_percent"], 20)

    # test database with multiple samples
    def test_multiple_samples(self):
        for i in range(30):
            # generate random number
            cpu_percent = random() * 100
            ram_percent = random() * 100
            UsageSample.objects.create(cpu_percent=cpu_percent, ram_percent=ram_percent)
        response = self.client.get("/api/samples/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 30)
        self.assertIsNotNone(response.data["next"])
        self.assertEqual(len(response.data["results"]), 10)
