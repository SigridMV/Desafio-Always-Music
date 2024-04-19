const { Client } = require("pg");

const connection = async () => {
  // Obtener argumentos de la línea de comandos
  const arg_accion = process.argv[2];
  const database = process.argv[3];
  const user = process.argv[4];
  const password = process.argv[5];
  const arg_1 = process.argv[6];
  const arg_2 = process.argv[7];
  const arg_3 = process.argv[8];
  const arg_4 = process.argv[9];

  // Función para conectar a la base de datos
  const client = new Client({
    host: "localhost",
    port: 5432,
    database: database,
    user: user,
    password: password,
  });

  try {
    await client.connect();

    // Ejecutar la acción correspondiente
    if (arg_accion === "nuevo") {
      async function ingresar(nombre, rut, curso, nivel) {
        const res = await client.query(
          `INSERT INTO estudiantes (nombre, rut, curso, nivel)
          VALUES ('${nombre}', '${rut}', '${curso}', '${nivel}')
          RETURNING *`
        );
        console.log(`El estudiante ${res.rows[0].nombre} agregado con éxito.`);
        client.end();
      }
      ingresar(arg_1, arg_2, arg_3, arg_4);
    } else if (arg_accion === "rut") {
      async function consulta_rut(rut) {
        const res = await client.query(
          `SELECT * FROM estudiantes WHERE rut = '${rut}'`
        );
        console.log(res.rows[0]);
        client.end();
      }
      consulta_rut(arg_1);
    } else if (arg_accion === "consulta") {
      async function consultar_todos() {
        const res = await client.query(`SELECT * FROM estudiantes`);
        console.log("Registro actual:");
        console.log(res.rows);
        client.end();
      }
      consultar_todos();
    } else if (arg_accion === "editar") {
      async function editar(nombre, rut, curso, nivel) {
        const res = await client.query(
          `UPDATE estudiantes 
          SET nombre = '${nombre}', curso = '${curso}', nivel = '${nivel}' 
          WHERE rut = '${rut}' RETURNING *`
        );
        console.log(`El estudiante ${res.rows[0].nombre} editado con éxito.`);
        client.end();
      }
      editar(arg_1, arg_2, arg_3, arg_4);
    } else if (arg_accion === "eliminar") {
      async function eliminar(rut) {
        const res = await client.query(
          `DELETE FROM estudiantes WHERE rut = '${rut}' RETURNING *`
        );
        console.log(
          `Registro de estudiante con rut ${res.rows[0].rut} eliminado.`
        );
        client.end();
      }
      eliminar(arg_1);
    } else {
      console.log("Acción no reconocida.");
      client.end();
    }
  } catch (error) {
    console.error("Error:", error.message);
    client.end();
  }
};

connection();
