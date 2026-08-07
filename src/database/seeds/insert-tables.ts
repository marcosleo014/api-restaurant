import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("tables").del();

    // Inserts seed entries
    await knex("tables").insert([
        { name: "Mesa 01" },
        { name: "Mesa 02" },
        { name: "Mesa 03" },
        { name: "Mesa 04" },
        { name: "Mesa 05" },
        { name: "Mesa 06" },
        { name: "Mesa 07" },
        { name: "Mesa 08" },
    ]);
};
