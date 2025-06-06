# Generated by Django 4.2.16 on 2024-11-24 04:08

import django.contrib.gis.db.models.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('AngusEats', '0014_estadopedido_alter_pedido_estado'),
    ]

    operations = [
        migrations.CreateModel(
            name='Ubicacion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('direccion', models.CharField(max_length=255)),
                ('coordenadas', django.contrib.gis.db.models.fields.PointField(blank=True, null=True, srid=4326)),
            ],
        ),
        migrations.RemoveField(
            model_name='pedido',
            name='coordenadas_destino',
        ),
        migrations.RemoveField(
            model_name='pedido',
            name='coordenadas_origen',
        ),
        migrations.RemoveField(
            model_name='pedido',
            name='direccion_destino',
        ),
        migrations.RemoveField(
            model_name='pedido',
            name='direccion_origen',
        ),
        migrations.AddField(
            model_name='pedido',
            name='destino',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='destino_pedidos', to='AngusEats.ubicacion'),
        ),
        migrations.AddField(
            model_name='pedido',
            name='origen',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='origen_pedidos', to='AngusEats.ubicacion'),
        ),
    ]
