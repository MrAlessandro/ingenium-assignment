import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "sampler.settings.production")
app = Celery("sampler")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()


@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(
        crontab(minute="*/1"),
        collect_usage_data.s(),
    )


@app.task(bind=True, ignore_result=True)
def collect_usage_data(*args, **kwargs):
    from django.core.cache import cache
    from core.models import UsageSample
    from core.serializers import UsageSampleSerializer
    from django.conf import settings
    import psutil

    cpu_percent = psutil.cpu_percent()
    ram_percent = psutil.virtual_memory().percent

    sample = UsageSample.objects.create(
        cpu_percent=cpu_percent, ram_percent=ram_percent
    )
    cache.set(settings.LAST_SAMPLE_CACHE_KEY, UsageSampleSerializer(sample).data)

    return True
