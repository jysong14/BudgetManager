# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('budget_manager', '0004_auto_20140723_2348'),
    ]

    operations = [
        migrations.AddField(
            model_name='budget',
            name='price',
            field=models.FloatField(default=0),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='summed_budget',
            name='price',
            field=models.FloatField(default=0),
            preserve_default=False,
        ),
    ]
