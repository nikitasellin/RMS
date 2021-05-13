from django.core.mail import send_mail

from config.celery import app


@app.task
def async_send_mail(subject, message, from_email,
                    recipient_list, fail_silently=False):
    send_mail(subject, message, from_email, recipient_list, fail_silently)
