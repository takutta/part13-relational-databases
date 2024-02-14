const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {

    await queryInterface.addColumn('users', 'enabled', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });

    // Aseta 'enabled' arvo 'true' kaikille olemassa oleville riveille
    await queryInterface.sequelize.query('UPDATE users SET enabled = true WHERE enabled IS NULL');
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('users', 'enabled');
  },
};
