const bcrypt = require('bcrypt');
const { createUser, getUserByEmail, getUserByUsername, updateUserRole } = require('../database');

const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function ensureAdminUser() {
  const username = String(process.env.ADMIN_USERNAME || '').trim();
  const email = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || '';

  if (!username && !email && !password) {
    console.log('[ADMIN] Bootstrap desactivado: configura ADMIN_USERNAME, ADMIN_EMAIL y ADMIN_PASSWORD.');
    return;
  }

  if (!username || !email || !password) {
    throw new Error('Configura ADMIN_USERNAME, ADMIN_EMAIL y ADMIN_PASSWORD para crear el administrador.');
  }

  if (!USERNAME_REGEX.test(username)) {
    throw new Error('ADMIN_USERNAME debe tener entre 3 y 20 caracteres alfanuméricos, guion o guion bajo.');
  }

  if (!EMAIL_REGEX.test(email)) {
    throw new Error('ADMIN_EMAIL no tiene un formato válido.');
  }

  if (password.length < 12) {
    throw new Error('ADMIN_PASSWORD debe tener al menos 12 caracteres.');
  }

  const [userByUsername, userByEmail] = await Promise.all([
    getUserByUsername(username),
    getUserByEmail(email),
  ]);

  if (userByUsername && userByEmail && userByUsername.id !== userByEmail.id) {
    throw new Error('ADMIN_USERNAME y ADMIN_EMAIL pertenecen a cuentas distintas; no se modificó ninguna.');
  }

  const existingUser = userByUsername || userByEmail;
  if (existingUser) {
    if (existingUser.username !== username || existingUser.email !== email) {
      throw new Error('ADMIN_USERNAME o ADMIN_EMAIL ya pertenecen a otra cuenta; revisa la configuración.');
    }

    if (existingUser.role !== 'admin') {
      await updateUserRole(existingUser.id, 'admin');
    }
    console.log(`[ADMIN] La cuenta ${username} ya está configurada como administradora.`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await createUser({ username, email, passwordHash, role: 'admin' });
  console.log(`[ADMIN] Cuenta administradora ${username} creada en la base de datos configurada.`);
}

module.exports = { ensureAdminUser };