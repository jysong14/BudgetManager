# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('budget_manager', '0003_auto_20140723_2331'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='budget',
            name='price',
        ),
        migrations.RemoveField(
            model_name='summed_budget',
            name='price',
        ),
    ]
