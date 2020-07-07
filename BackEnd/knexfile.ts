import path from 'path';

module.exports = {
    client:'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'server','src', 'database', 'database.sqlite'),
    migrations: {
        directory: path.resolve(__dirname, 'server','src', 'database', 'migrations'),
    },
    seeds: {
        directory: path.resolve(__dirname, 'server','src', 'database', 'seeds'),
    },
    useNullAsDefault: true,
    }
};