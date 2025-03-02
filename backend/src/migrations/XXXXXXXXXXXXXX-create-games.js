'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('games', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      tagline: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      genre: {
        type: Sequelize.STRING,
        allowNull: false
      },
      subgenre: {
        type: Sequelize.STRING,
        allowNull: false
      },
      primary_color: {
        type: Sequelize.STRING,
        allowNull: true
      },
      prompt_name: {
        type: Sequelize.STRING,
        defaultValue: 'UGC',
        allowNull: false
      },
      prompt_text: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      prompt_model: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'gpt-3.5-turbo'
      },
      image_prompt_model: {
        type: Sequelize.STRING,
        allowNull: true
      },
      image_prompt_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      image_prompt_text: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      image_data: {
        type: Sequelize.BLOB,
        allowNull: true
      },
      music_prompt_text: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      music_prompt_seed_image: {
        type: Sequelize.STRING,
        allowNull: true
      },
      private: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'draft',
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('games');
  }
};