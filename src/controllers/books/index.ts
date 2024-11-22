import { Elysia, t } from "elysia";
import { createBook } from "./services";
const books = new Elysia();

export const createBookController = books.post(
    "/create-book",
    ({ body }) => {
        const { title, desc: description, author, price } = body;
        const rs = createBook(title, description, author, price);
        if (rs && rs > 0) {
            return {
                status: "success",
                message: "Insert book successful",
                book_id: rs
            };
        } else {
            return {
                status: "error",
                message: "Insert book failed"
            };
        }
    },
    {
        body: t.Object({
            title: t.String(),
            desc: t.String(),
            author: t.String(),
            price: t.Number()
        })
    }
);
