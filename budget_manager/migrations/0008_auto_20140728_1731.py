# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('budget_manager', '0007_auto_20140723_2352'),
    ]

    operations = [
        migrations.CreateModel(
            name='Card',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('number', models.IntegerField(max_length=4)),
                ('spender', models.ForeignKey(blank=True, to=settings.AUTH_USER_MODEL, null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='budget',
            name='card',
            field=models.ForeignKey(blank=True, to='budget_manager.Card', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='summed_budget',
            name='card',
            field=models.ForeignKey(blank=True, to='budget_manager.Card', null=True),
            preserve_default=True,
        ),
        migrations.RemoveField(
            model_name='budget',
            name='spender',
        ),
        migrations.RemoveField(
            model_name='summed_budget',
            name='spender',
        ),
    ]
