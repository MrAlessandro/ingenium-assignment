from django.db import models


# Create your models here.
class UsageSample(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    cpu_percent = models.FloatField()
    ram_percent = models.FloatField()

    def __str__(self):
        return f"{self.created_at}: CPU: {self.cpu_percent} - RAM: {self.ram_percent}"
