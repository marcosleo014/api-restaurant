import { Request, Response, NextFunction } from "express";
import { knex } from "../database/knex";
import { z } from "zod";
import { Table } from "../types/Table";
import { AppError } from "../utils/AppError";

export class TablesController {

    index = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const tables = await knex("tables").select();
        return response.status(200).json(tables);
    };

    create = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const { name } = z.object({
            name: z.string().trim().min(1)
        }).parse(request.body);

        const table = await this.findByName(name);
        if (table) {
            throw new AppError(`${table.name} já foi cadastrada`);
        }

        const [ id ] = await knex<Table>("tables").insert({ name });
        const tableCreated = await this.findById(id);
        return response.status(201).json(tableCreated);
    };

    update = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const { id } = z.object({
            id: z.coerce.number().positive()
        }).parse(request.params);

        const table = await this.findById(id);
        if(!table) {
            throw new AppError("Mesa não encontrada");
        };

        const { name } = z.object({
            name: z.string().trim().min(1)
        }).parse(request.body);
        
        const tableName = await this.findByName(name);
        if (tableName) {
            throw new AppError(`${tableName.name} já está cadastrada`);
        };

        await knex<Table>("tables").update({
            name,
            updated_at: knex.fn.now()
        }).where({id});

        const tableUpdated = await this.findById(id);
        return response.status(200).json(tableUpdated);
    };

    remove = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const { id } = z.object({
            id: z.coerce.number().positive()
        }).parse(request.params);

        const tableDeleted = await this.findById(id);
        if (!tableDeleted) {
            throw new AppError("Mesa não encontrada", 404);
        }

        await knex<Table>("tables").delete().where({id});
        return response.status(200).json(tableDeleted);
    };

    private async findById(id: number) {
        const table = await knex<Table>("tables").select().where("id", id).first();
        return table;
    };

    private async findByName(name: string) {
        const table = await knex<Table>("tables").where({name}).first();
        return table;
    };
};