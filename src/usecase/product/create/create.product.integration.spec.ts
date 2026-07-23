import { Sequelize } from "sequelize-typescript";
import { InputCreateProductDto, OutputCreateProductDto } from "./create.product.dto";
import CreateProductUseCase from "./create.product.usecase";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";

describe("Integration Test create product use case", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });


    it("should find a product", async () => {
        const productRepository = new ProductRepository();
        const usecase = new CreateProductUseCase(productRepository);

        const input: InputCreateProductDto = { 
            name: "Product 1", 
            price: 10 
        };

        const output: OutputCreateProductDto = await usecase.execute(input);

        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            price: input.price
        });

    });

    it("should thrown an error when product name is missing", async () => {
        const productRepository = new ProductRepository();
        const productCreateUseCase = new CreateProductUseCase(productRepository);

        const input: InputCreateProductDto = { 
            name: "", 
            price: 10 
        };

        await expect(productCreateUseCase.execute(input)).rejects.toThrow(
            "Name is required"
        );
    });
});
