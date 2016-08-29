from django.db import models

# Create your models here.

from django.db import models

class User(models.Model):

    id = models.IntegerField(primary_key=True)
    username = models.CharField(max_length=255)
    password = models.CharField(max_length=255)

    def __unicode__(self):
        return self.username

    class Meta:
        db_table = "user"


