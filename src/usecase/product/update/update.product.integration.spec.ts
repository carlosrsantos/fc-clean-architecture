import { Sequelize } from "sequelize-typescript";
import UpdateProductUseCase from "./udpate.product.usecase";
import { InputUpdateProductDto, OutputUpdateProductDto } from "./update.product.dto";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import Product from "../../../domain/product/entity/product";

describe("Integration test update product use case", () => {
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

    it("should update a product", async () => {
        const productRepository = new ProductRepository();
        const productUpdateUseCase = new UpdateProductUseCase(productRepository);

        const product = new Product("123", "Product A", 10);
        await productRepository.create(product);

        const input: InputUpdateProductDto = {
            id: product.id,
            name: "Product A1",
            price: 15
        }

        const output: OutputUpdateProductDto = await productUpdateUseCase.execute(input);

        expect(output).toEqual(input);
    });

    it("should throw an error when trying to update a product", async () => {
        const productRepository = new ProductRepository();
        const productUpdateUseCase = new UpdateProductUseCase(productRepository);
        
        const product = new Product("123", "Product A", 10);
        await productRepository.create(product);

        const input: InputUpdateProductDto = {
            id: product.id,
            name: "Product A1",
            price: -15
        }

        await expect(productUpdateUseCase.execute(input)).rejects.toThrow(
            "Price must be greater than zero"
        );
    });
});