const bcrypt = require('bcrypt');

const run = async () => {
  // Generando nuevas contraseñas
  const adminPassword = await bcrypt.hash('123admin', 10);  // Nueva contraseña para admin
  const empleadoPassword = await bcrypt.hash('123empleado', 10);  // Nueva contraseña para empleado

  console.log('Admin password hash:', adminPassword);
  console.log('Empleado password hash:', empleadoPassword);
};

run();
