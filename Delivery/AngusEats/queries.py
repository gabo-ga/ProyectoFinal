from django.db import connection

def execute_sql_query(query, params=None):
    """Ejecuta una consulta SQL y devuelve los resultados."""
    with connection.cursor() as cursor:
        cursor.execute(query, params or [])
        rows = cursor.fetchall()
        columnas = [col[0] for col in cursor.description]
        return [dict(zip(columnas, row)) for row in rows]

def contar_pedidos(estado_ids):
    ids_placeholder = ", ".join(["%s"] * len(estado_ids))

    query = f"""
        SELECT COUNT(*) AS total_pedidos
        FROM "AngusEats_pedido" p
        JOIN "AngusEats_estadopedido" e
        ON p.estado_id = e.id
        WHERE e.id IN ({ids_placeholder});
    """

    # Ejecutar la consulta
    result = execute_sql_query(query, estado_ids)

    # Retornar el conteo de pedidos
    return result[0]['total_pedidos'] if result else 0


def contar_vehiculos(disponible=None):
    """Cuenta vehículos según su estado de disponibilidad."""
    query = """
        SELECT COUNT(*) AS total_vehiculos
        FROM "AngusEats_vehiculo"
    """
    params = []

    if disponible is not None:
        query += " WHERE disponible = %s"
        params.append(disponible)

    result = execute_sql_query(query, params)
    return result[0]['total_vehiculos'] if result else 0

def obtener_pedidos_en_curso():
    """Obtiene la lista de pedidos en estado 'pendiente' o 'en_ruta'."""
    query = """
        SELECT 
            p.id AS pedido_id,
            c.nombre AS cliente_nombre,
            c.telefono AS cliente_telefono,
            p.fecha_creacion AS pedido_fecha,
            e.nombre AS pedido_estado,
            u_destino.direccion AS pedido_direccion_destino
        FROM 
            "AngusEats_cliente" c
        JOIN 
            "AngusEats_pedido" p
        ON 
            c.id = p.cliente_id
        JOIN 
            "AngusEats_estadopedido" e
        ON 
            p.estado_id = e.id
        JOIN 
            "AngusEats_ubicacion" u_destino
        ON 
            p.destino_id = u_destino.id
        WHERE 
            e.nombre IN ('pendiente', 'en_ruta');
    """
    return execute_sql_query(query)

def obtener_pedidos_entregados():
    """Obtiene la lista de pedidos en estado 'entregado'."""
    query = """
        SELECT 
            c.nombre AS cliente_nombre,
            c.telefono AS cliente_telefono,
            p.fecha_creacion AS pedido_fecha,
            e.nombre AS pedido_estado,
            u_destino.direccion AS pedido_direccion_destino
        FROM 
            "AngusEats_cliente" c
        JOIN 
            "AngusEats_pedido" p
        ON 
            c.id = p.cliente_id
        JOIN 
            "AngusEats_estadopedido" e
        ON 
            p.estado_id = e.id
        JOIN 
            "AngusEats_ubicacion" u_destino
        ON 
            p.destino_id = u_destino.id
        WHERE 
            e.nombre = 'entregado';
    """
    return execute_sql_query(query)

def obtener_detalle_pedidos():
    """
    Obtiene el detalle de los pedidos con su cliente, estado, hora estimada y dirección de destino.
    """
    query = """
        SELECT
            "AngusEats_pedido"."id" AS "ID",
            "AngusEats_cliente"."nombre" AS "CLIENTE",
            "AngusEats_estadopedido"."nombre" AS "ESTADO",
            "AngusEats_ubicacion"."direccion" AS "DIRECCION_DESTINO"
        FROM
            "AngusEats_pedido"
        INNER JOIN
            "AngusEats_cliente" ON "AngusEats_pedido"."cliente_id" = "AngusEats_cliente"."id"
        INNER JOIN
            "AngusEats_estadopedido" ON "AngusEats_pedido"."estado_id" = "AngusEats_estadopedido"."id"
        INNER JOIN
            "AngusEats_ubicacion" ON "AngusEats_pedido"."destino_id" = "AngusEats_ubicacion"."id";
    """
    return execute_sql_query(query)

def contar_pedidos_cancelados():
    """Cuenta los pedidos con estado 'cancelado'."""
    query = """
        SELECT 
            COUNT(*) AS total_pedidos_cancelados
        FROM 
            "AngusEats_pedido" p
        JOIN 
            "AngusEats_estadopedido" e
        ON 
            p.estado_id = e.id
        WHERE 
            e.nombre = 'cancelado';
    """
    result = execute_sql_query(query)
    return result[0]['total_pedidos_cancelados'] if result else 0

def contar_pedidos_entregados():
    """Cuenta los pedidos con estado 'entregado'."""
    query = """
        SELECT 
            COUNT(*) AS total_pedidos_entregados
        FROM 
            "AngusEats_pedido" p
        JOIN 
            "AngusEats_estadopedido" e
        ON 
            p.estado_id = e.id
        WHERE 
            e.nombre = 'entregado';
    """
    result = execute_sql_query(query)
    return result[0]['total_pedidos_entregados'] if result else 0

def obtener_vehiculos_disponibles():
    """Devuelve los vehículos disponibles."""
    query = """
        SELECT 
            v.placa AS vehiculo_placa,
            v.vehiculo_nombre AS vehiculo_nombre,
            v.tipo AS vehiculo_tipo,
            v.disponible AS vehiculo_disponible,
            u.nombre AS conductor_nombre,
            u.telefono AS conductor_telefono
        FROM 
            "AngusEats_vehiculo" v
        JOIN 
            "AngusEats_usuario" u
        ON 
            v.conductor_id = u.id
        WHERE 
            v.disponible = TRUE
        AND u.rol = 'conductor';
    """
    return execute_sql_query(query)

def obtener_detalle_coordenadas(estado_id, conductor_id):
    """
    Obtiene las coordenadas de origen y destino de los pedidos con un estado específico
    y un conductor especifico.
    """
    query = """
        SELECT
            p.id AS "ID",
            ST_X(u_origen.coordenadas) AS "ORIGEN_LAT",
            ST_Y(u_origen.coordenadas) AS "ORIGEN_LNG",
            ST_X(u_destino.coordenadas) AS "DESTINO_LAT",
            ST_Y(u_destino.coordenadas) AS "DESTINO_LNG"
        FROM 
            "AngusEats_pedido" p
        JOIN 
            "AngusEats_ubicacion" u_origen
        ON 
            p.origen_id = u_origen.id
        JOIN 
            "AngusEats_ubicacion" u_destino
        ON 
            p.destino_id = u_destino.id
        WHERE 
            p.estado_id = %s
            AND p.conductor_id=%s;
    """
    return execute_sql_query(query, [estado_id, conductor_id])

def obtener_conductores():
    """
    Obtiene todos los usuarios que tienen el rol de 'conductor' y el numero de pedidos actuales.
    """
    query = """
        SELECT 
            u.id AS id_conductor,
            u.nombre AS nombre_conductor, 
            u.correo AS correo_conductor, 
            u.telefono AS telefono_conductor, 
            u.rol AS rol_conductor,
            COUNT(p.id) AS numero_pedidos_pendientes
        FROM 
            "AngusEats_usuario" u
        LEFT JOIN 
            "AngusEats_pedido" p ON u.id = p.conductor_id AND p.estado_id = '1'
        WHERE 
            u.rol = 'conductor'
        GROUP BY 
            u.id, u.nombre, u.correo, u.telefono, u.rol
        ORDER BY 
            numero_pedidos_pendientes DESC;
    """
    return execute_sql_query(query)

def actualizar_estado_pedido(pk, nuevo_estado_id):
    """
    Actualiza el estado de un pedido dado su ID y el nuevo estado (por su clave foránea).
    """
    query = """
        UPDATE "AngusEats_pedido"
        SET estado_id = %s
        WHERE id = %s
    """
    with connection.cursor() as cursor:
        cursor.execute(query, [nuevo_estado_id, pk])

