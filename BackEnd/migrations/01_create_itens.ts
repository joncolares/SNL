import Knex from 'knex';

export async function up(knex : Knex){
    //criar a tabela
    return knex.schema.createTable('itens', table => {
        table.increments('id').primary();
        table.string('image').notNullable();
        table.string('title').notNullable();

    })
}

export async function down(knex :Knex){
    // voltar atras 
    return knex.schema.dropTable('itens');
}