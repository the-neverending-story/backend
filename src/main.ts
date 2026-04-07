import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ["http://localhost:4200", "http://worldofteramir.com"],
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  });
  app.use(cookieParser());
  await app.listen(3000);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
