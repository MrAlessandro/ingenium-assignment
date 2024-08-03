from celery import shared_task


@shared_task(name="collect_usage_data")
def collect_usage_data():
    from core.models import UsageSample
    import psutil

    cpu_percent = psutil.cpu_percent()
    ram_percent = psutil.virtual_memory().percent

    UsageSample.objects.create(cpu_percent=cpu_percent, ram_percent=ram_percent)
    return True
