from django.db import models

class User(models.Model):

    id = models.IntegerField(primary_key=True)
    username = models.CharField(max_length=255)
    password = models.CharField(max_length=255)

    def __unicode__(self):
        return self.username

    class Meta:
        db_table = "user"

class Posttypes(models.Model):
    id = models.IntegerField(db_column='Id', primary_key=True)
    name = models.CharField(db_column='Name', max_length=255)  # Field name made lowercase.

    def __unicode__(self):
        return self.name

    class Meta:
        managed = False
        db_table = 'posttypes'


