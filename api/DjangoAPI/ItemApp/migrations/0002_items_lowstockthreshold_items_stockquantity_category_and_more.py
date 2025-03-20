# Generated by Django 5.1.7 on 2025-03-20 12:57

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ItemApp', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='items',
            name='LowStockThreshold',
            field=models.IntegerField(default=5),
        ),
        migrations.AddField(
            model_name='items',
            name='StockQuantity',
            field=models.IntegerField(default=0),
        ),
        migrations.CreateModel(
            name='Category',
            fields=[
                ('CategoryId', models.AutoField(primary_key=True, serialize=False)),
                ('CategoryName', models.CharField(max_length=100)),
                ('Description', models.TextField(blank=True, null=True)),
                ('ParentCategory', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='subcategories', to='ItemApp.category')),
            ],
            options={
                'verbose_name_plural': 'Categories',
            },
        ),
        migrations.AddField(
            model_name='items',
            name='Category',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='items', to='ItemApp.category'),
        ),
    ]
