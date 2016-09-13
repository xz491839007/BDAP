# coding: utf-8
from __future__ import unicode_literals
from django.db import models

class ColumnLabel(models.Model):
    id = models.BigIntegerField(primary_key=True)
    name = models.CharField(max_length=255)
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

class Dbs(models.Model):
    db_id = models.BigIntegerField(db_column='DB_ID', primary_key=True)  # Field name made lowercase.
    desc = models.CharField(db_column='DESC', max_length=4000, blank=True, null=True)  # Field name made lowercase.
    db_location_uri = models.CharField(db_column='DB_LOCATION_URI', max_length=4000)  # Field name made lowercase.
    name = models.CharField(db_column='NAME', unique=True, max_length=128, blank=True, null=True)  # Field name made lowercase.
    owner_name = models.CharField(db_column='OWNER_NAME', max_length=128, blank=True, null=True)  # Field name made lowercase.
    owner_type = models.CharField(db_column='OWNER_TYPE', max_length=10, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'DBS'

    def __unicode__(self):
        return self.db_id

class Cds(models.Model):
    cd_id = models.BigIntegerField(db_column='CD_ID', primary_key=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'CDS'

    def __unicode__(self):
        return self.cd_id

class ColumnsV2(models.Model):
    cd = models.ForeignKey(Cds, models.DO_NOTHING, db_column='CD_ID')  # Field name made lowercase.
    comment = models.CharField(db_column='COMMENT', max_length=256, blank=True, null=True)  # Field name made lowercase.
    column_name = models.CharField(db_column='COLUMN_NAME', max_length=767)  # Field name made lowercase.
    type_name = models.CharField(db_column='TYPE_NAME', max_length=4000, blank=True, null=True)  # Field name made lowercase.
    integer_idx = models.IntegerField(db_column='INTEGER_IDX')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'COLUMNS_V2'
        unique_together = (('cd', 'column_name'),)

    def __unicode__(self):
        return self.cd

class Sds(models.Model):
    sd_id = models.BigIntegerField(db_column='SD_ID', primary_key=True)  # Field name made lowercase.
    cd = models.ForeignKey(Cds, models.DO_NOTHING, db_column='CD_ID', blank=True, null=True)  # Field name made lowercase.
    input_format = models.CharField(db_column='INPUT_FORMAT', max_length=4000, blank=True, null=True)  # Field name made lowercase.
    is_compressed = models.TextField(db_column='IS_COMPRESSED')  # Field name made lowercase. This field type is a guess.
    is_storedassubdirectories = models.TextField(db_column='IS_STOREDASSUBDIRECTORIES')  # Field name made lowercase. This field type is a guess.
    location = models.CharField(db_column='LOCATION', max_length=4000, blank=True, null=True)  # Field name made lowercase.
    num_buckets = models.IntegerField(db_column='NUM_BUCKETS')  # Field name made lowercase.
    output_format = models.CharField(db_column='OUTPUT_FORMAT', max_length=4000, blank=True, null=True)  # Field name made lowercase.
    serde = models.ForeignKey('Serdes', models.DO_NOTHING, db_column='SERDE_ID', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'SDS'
        
class Tbls(models.Model):
    tbl_id = models.BigIntegerField(db_column='TBL_ID', primary_key=True)  # Field name made lowercase.
    create_time = models.IntegerField(db_column='CREATE_TIME')  # Field name made lowercase.
    db = models.ForeignKey(Dbs, models.DO_NOTHING, db_column='DB_ID', blank=True, null=True)  # Field name made lowercase.
    last_access_time = models.IntegerField(db_column='LAST_ACCESS_TIME')  # Field name made lowercase.
    owner = models.CharField(db_column='OWNER', max_length=767, blank=True, null=True)  # Field name made lowercase.
    retention = models.IntegerField(db_column='RETENTION')  # Field name made lowercase.
    sd = models.ForeignKey(Sds, models.DO_NOTHING, db_column='SD_ID', blank=True, null=True)  # Field name made lowercase.
    tbl_name = models.CharField(db_column='TBL_NAME', max_length=128, blank=True, null=True)  # Field name made lowercase.
    tbl_type = models.CharField(db_column='TBL_TYPE', max_length=128, blank=True, null=True)  # Field name made lowercase.
    view_expanded_text = models.TextField(db_column='VIEW_EXPANDED_TEXT', blank=True, null=True)  # Field name made lowercase.
    view_original_text = models.TextField(db_column='VIEW_ORIGINAL_TEXT', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'TBLS'
        unique_together = (('tbl_name', 'db'),)

    def __unicode__(self):
        return self.tbl_id



class Serdes(models.Model):
    serde_id = models.BigIntegerField(db_column='SERDE_ID', primary_key=True)  # Field name made lowercase.
    name = models.CharField(db_column='NAME', max_length=128, blank=True, null=True)  # Field name made lowercase.
    slib = models.CharField(db_column='SLIB', max_length=4000, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'SERDES'
