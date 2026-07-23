import { InputCreateProductDto, OutputCreateProductDto } from "./create.product.dto";
import CreateProductUseCase from "./create.product.usecase";

const input: InputCreateProductDto = {
    name: "Product 1",
    price: 10
};

const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    };
};

describe("Unit Test create product use case", () => {
    it("should find a product", async () => {
        const productRepository = MockRepository();
        const usecase = new CreateProductUseCase(productRepository);

        const output:OutputCreateProductDto = await usecase.execute(input);

        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            price: input.price
        });

    });

    it("should thrown an error when product name is missing", async () => {
        const productRepository = MockRepository();
        const productCreateUseCase = new CreateProductUseCase(productRepository);

        input.name = "";

        await expect(productCreateUseCase.execute(input)).rejects.toThrow(
            "Name is required"
        );
    });
});
