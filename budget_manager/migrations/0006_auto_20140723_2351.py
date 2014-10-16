# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('budget_manager', '0005_auto_20140723_2350'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='budget',
            name='spender',
        ),
        migrations.RemoveField(
            model_name='summed_budget',
            name='spender',
        ),
        migrations.AlterField(
            model_name='budget',
            name='price',
            field=models.FloatField(),
        ),
    ]
