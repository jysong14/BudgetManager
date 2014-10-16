# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('budget_manager', '0001_initial'),
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
    ]
