'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Update existing records with current timestamps
    await queryInterface.sequelize.query(`
      UPDATE "Users"
      SET "created_at" = COALESCE("created_at", CURRENT_TIMESTAMP),
          "updated_at" = COALESCE("updated_at", CURRENT_TIMESTAMP)
    `);

    // Alter the table to set default values for the timestamps
    await queryInterface.changeColumn('Users', 'created_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });

    await queryInterface.changeColumn('Users', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
  },

  async down(queryInterface, Sequelize) {
    // Optional: Revert changes if needed
  }
};