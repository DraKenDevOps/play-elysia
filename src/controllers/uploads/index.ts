import { Elysia, t } from "elysia";
import path from "path";
import env from "../../env";

export const uploadController = new Elysia().post(
    "/upload",
    async ({ body }) => {
        const image = body["image"];
        // const file = await image.text();
        const filename = crypto.randomUUID().replace(/-/g, "");
        const ext = path.extname(image.name);
        const filepath = path.resolve(`${env.PWD}/uploads/images/${filename}${ext}`);
        const size = await Bun.write(filepath, image);
        if (size > 0) {
            return {
                message: "success",
                filename

            };
        } else {
            return {
                message: "error",
                filename: null
            };
        }
    },
    {
        body: t.Object({
            // title: t.String(),
            image: t.File()
        })
    }
);
