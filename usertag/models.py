from __future__ import unicode_literals

from django.db import models

class ColumnLabel(models.Model):
    id = models.BigIntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    db_id = models.BigIntegerField()
    db_name = models.CharField(max_length=255)
    table_name = models.CharField(max_length=255)
    column_name = models.CharField(max_length=255)
    join_column_name = models.CharField(max_length=255)
    type = models.IntegerField()
    aggregate_rule = models.CharField(max_length=255)
    aggregate_express = models.CharField(max_length=255)
    classification = models.IntegerField()
    column_enums = models.CharField(max_length=2000)
    note = models.CharField(max_length=255)
    create_time = models.DateTimeField()

    def __unicode__(self):
        return self.name

    class Meta:
        managed = False
        db_table = 'column_label'


class UserGroup(models.Model):
    id = models.BigIntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    type = models.IntegerField()
    user_identity_column = models.CharField(max_length=255)
    last_time_type = models.IntegerField()
    note = models.CharField(max_length=255)
    create_time = models.DateTimeField()

    def __unicode__(self):
        return self.name

    class Meta:
        managed = False
        db_table = 'user_group'

class UserGroupColumnLabelRelation(models.Model):
    group_id = models.BigIntegerField()
    label_id = models.BigIntegerField()
    express = models.CharField(max_length=255)
    and_or_type = models.IntegerField()
    note = models.CharField(max_length=255)
    create_time = models.DateTimeField()

    def __unicode__(self):
        return self.group_id

    class Meta:
        managed = False
        db_table = 'user_group_column_label_relation'
        unique_together = (('group_id', 'label_id'),)