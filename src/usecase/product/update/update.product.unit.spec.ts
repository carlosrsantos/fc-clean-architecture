import ProductFactory from "../../../domain/product/factory/product.factory";
import UpdateProductUseCase from "./udpate.product.usecase";
import { InputUpdateProductDto } from "./update.product.dto";

const product = ProductFactory.create("a", "Product 1", 10);

const input: InputUpdateProductDto = {
    id: product.id,
    name: "Product Updated",
    price: 25
}

const MockRepository = () => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
    }
}

describe("Unit test update product use case", () => {
    it("should update a product", async () => {
        const productRepository = MockRepository();
        const productUpdateUseCase = new UpdateProductUseCase(productRepository);

        const output = await productUpdateUseCase.execute(input);

        expect(output).toEqual(input);
    });

    it("should throw an error when trying to update a product", async () => {
        const productRepository = MockRepository();
        const productUpdateUseCase = new UpdateProductUseCase(productRepository);

        input.price = -10;

        await expect(productUpdateUseCase.execute(input)).rejects.toThrow(
            "Price must be greater than zero"
        );
    });
});