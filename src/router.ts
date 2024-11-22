import { Elysia } from "elysia";
import env from "./env";
import { loginController } from "./controllers/auth";
import { uploadController } from "./controllers/uploads";
import { createBookController } from "./controllers/books";

const router = new Elysia({ prefix: `${env.BASE_PATH}/v1` });

router.use(loginController);
router.use(uploadController);
router.use(createBookController);

export default router;
