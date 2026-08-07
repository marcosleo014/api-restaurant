import { Request, Response, NextFunction } from "express";
import { knex } from "../database/knex";
import { z } from "zod";
import { AppError } from "../utils/AppError";

export class ProductController {

    async index(
        request: Request,
        response: Response,
        next: NextFunction
    ) {
        const { name, price_min, price_max } = z.object({
            name: z.string().optional(),
            price_min: z.coerce.number().nonnegative().optional(),
            price_max: z.coerce.number().positive().optional()
        }).parse(request.query);

        const query = knex<Product>("products").select();

        if (name) {
            query.whereILike("name", `%${name}%`);
        }
        if (price_min) {
            query.where("price", ">=", price_min);
        }
        if (price_max) {
            query.where("price", "<=", price_max);
        }

        const products = await query;
        return response.status(200).json(products);
    };

    async create(
        request: Request,
        response: Response,
        next: NextFunction
    ) {
        const { name, price } = z.object({
            name: z.string().trim().min(3),
            price: z.number().positive()
        }).parse(request.body);

        const [ id ] = await knex<Product>("products").insert({ name, price });
        const productCreate = await this.findById(id)
        return response.status(201).json(productCreate);
    };

    async update(
        request: Request,
        response: Response,
        next: NextFunction
    ) {
        const { id } = z.object({
            id: z.coerce.number()
        }).parse(request.params);

        if (!await this.findById(id)) {
            throw new AppError("Produto não encontrado", 404);
        };

        const { name, price } = z.object({
            name: z.string().trim().min(3),
            price: z.number().positive()
        }).parse(request.body);

        await knex<Product>("products")
        .update({ name, price, updated_at: knex.fn.now() })
        .where("id", id);
        const productUpdate = await this.findById(id);
        return response.status(200).json(productUpdate);
    };

    async remove(
        request: Request,
        response: Response,
        next: NextFunction
    ) {
        const { id } = z.object({
            id: z.coerce.number().positive()
        }).parse(request.params);

        const productDeleted = await this.findById(id);

        if (!productDeleted) {
            throw new AppError("Produto não encontrado", 404);
        };

        await knex<Product>("products").delete().where("id", id);
        return response.status(200).json(productDeleted);
    };

    private async findById(id: number) {
        const product = await knex<Product>("products").select().where("id", id).first();
        return product;
    };
}