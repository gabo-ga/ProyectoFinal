from django.db import connection

def execute_sql_query(query, params=None):
    """Ejecuta una consulta SQL y devuelve los resultados."""
    with connection.cursor() as cursor:
        cursor.execute(query, params or [])
        rows = cursor.fetchall()
        columnas = [col[0] for col in cursor.description]
        return [dict(zip(columnas, row)) for row in rows]

def contar_pedidos(estado=None):
    """Cuenta pedidos según su estado."""
    if estado:
        query = """
            SELECT COUNT(*) AS total_pedidos
            FROM "AngusEats_pedido"
            WHERE estado = %s;
        """
        params = [estado]
    else:
        query = """
            SELECT COUNT(*) AS total_pedidos
            FROM "AngusEats_pedido"
            WHERE estado IN ('pendiente', 'en_ruta');
        """
        params = []

    result = execute_sql_query(query, params)
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
            p.estado AS pedido_estado,
            p.direccion_destino AS pedido_direccion_destino
        FROM 
            "AngusEats_cliente" c
        JOIN 
            "AngusEats_pedido" p
        ON 
            c.id = p.cliente_id
        WHERE 
            p.estado IN ('pendiente', 'en_ruta');
    """
    return execute_sql_query(query)

def obtener_pedidos_entregados():
    """Obtiene la lista de pedidos en estado 'entregado'."""
    query = """
        SELECT 
            c.nombre AS cliente_nombre,
            c.telefono AS cliente_telefono,
            p.fecha_creacion AS pedido_fecha,
            p.estado AS pedido_estado,
            p.direccion_destino AS pedido_direccion_destino
        FROM 
            "AngusEats_cliente" c
        JOIN 
            "AngusEats_pedido" p
        ON 
            c.id = p.cliente_id
        WHERE 
            p.estado = 'entregado';
    """
    return execute_sql_query(query)

def contar_pedidos_cancelados():
    """Cuenta los pedidos con estado 'cancelado'."""
    query = """
        SELECT COUNT(*) AS total_pedidos_cancelados
        FROM "AngusEats_pedido"
        WHERE estado = 'cancelado';
    """
    result = execute_sql_query(query)
    return result[0]['total_pedidos_cancelados'] if result else 0

def contar_pedidos_entregados():
    """Cuenta los pedidos con estado 'entregado'."""
    query = """
        SELECT COUNT(*) AS total_pedidos_entregados
        FROM "AngusEats_pedido"
        WHERE estado = 'entregado';
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
            c.nombre AS conductor_nombre,
            c.telefono AS conductor_telefono
        FROM 
            "AngusEats_vehiculo" v
        JOIN 
            "AngusEats_conductor" c
        ON 
            v.conductor_id = c.id
        WHERE 
            v.disponible = TRUE;
    """
    return execute_sql_query(query)

