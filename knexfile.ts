export default {
    client: "sqlite3",
    connection: {
        filename: "./src/database/database.db"
    },
    pool: {
        afterCreate: (connection: any, done: Function) => {
            connection.run("PRAGMA foreign_keys = ON", (error: Error) => {
                return done(error, connection)
            })
        }
    },
    useNullAsDefault: true,
    migrations : {
        extensions: "ts",
        directory: "./src/database/migrations"
    },
    seeds: {
        extensions: "ts",
        directory: "./src/database/seeds"
    }
}